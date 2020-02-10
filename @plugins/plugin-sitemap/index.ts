import { createGzip } from "zlib"
import { getModel } from "@factor/post/database"
import { SitemapStream, streamToPromise } from "sitemap"
import { uniq, addFilter, applyFilters, getPermalink, log } from "@factor/api"
import { currentUrl } from "@factor/api/url"
import { setting } from "@factor/api/settings"
import { Request, Response } from "express"
import { RouteConfig } from "vue-router"
import { WebpackCopyItemConfig } from "@factor/build/types"
let sitemap: Buffer

/**
 * Pull routes for sitemap out of a router config
 */
const getRoutesRecursively = (routes: RouteConfig[], parent = ""): string[] => {
  let out: string[] = []

  routes
    .filter(_ => _.path !== "*")
    .forEach(_ => {
      if (_.path) {
        let _p = _.path

        if (parent && !_.path.startsWith("/")) {
          _p = `${parent}/${_.path}`
        } else if (parent && _.path == "/") {
          _p = parent
        }

        out.push(_p)
      }

      if (_.children) {
        out = [...out, ...getRoutesRecursively(_.children, _.path)]
      }
    })

  return out
}

/**
 * get statically assigned routes
 * then remove duplicated and dynamic routes (which include a colon (:))
 */
const getRouteUrls = (): string[] => {
  const contentRoutes = applyFilters("content-routes", [])
  const theRoutes = uniq(getRoutesRecursively(contentRoutes)).filter(
    (fullPath: string) => {
      return !fullPath.includes(":")
    }
  )

  return theRoutes
}

export const getPermalinks = async (): Promise<string[]> => {
  const posts = await getModel("post").find(
    { permalink: { $ne: null }, status: "published", source: setting("package.name") },
    "permalink postType",
    { limit: 2000 }
  )

  const urls = posts.map(
    ({ postType, permalink }: { postType?: string; permalink?: string }) => {
      return getPermalink({ postType, permalink })
    }
  )

  return urls.concat(getRouteUrls())
}

/**
 * Copy the XSL file into dist folder
 * This currently isn't being loaded because of API issues with the existing sitemap npm module
 * At some point, it should be loaded like this:
 * <?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="[URL]/sitemap.xsl"?>
 */
const copyStaticFiles = (): WebpackCopyItemConfig[] => {
  const from = require.resolve("@factor/plugin-sitemap/sitemap.xsl")

  const copyItems: WebpackCopyItemConfig[] = []

  copyItems.push({ from, to: "" })

  return copyItems
}

export const setup = (): void => {
  /**
   * Copy any static/built files into root of dist
   */
  addFilter({
    key: "paths",
    hook: "webpack-copy-files-config",
    callback: (_: WebpackCopyItemConfig[], { cwd }) => {
      return [..._, ...copyStaticFiles()]
    }
  })

  addFilter({
    key: "sitemapRoutesMiddleware",
    hook: "middleware",
    callback: (_: object[]) => {
      _.push({
        path: "/sitemap.xml",
        middleware: [
          async (request: Request, response: Response): Promise<void> => {
            response.header("Content-Type", "application/xml")
            response.header("Content-Encoding", "gzip")

            // if we have a cached entry send it
            if (sitemap) {
              response.send(sitemap)
              return
            }
            try {
              const smStream = new SitemapStream({
                hostname: currentUrl()
              })
              const pipeline = smStream.pipe(createGzip())

              const urls = await getPermalinks()

              urls.forEach(url => {
                smStream.write({ url, changefreq: "weekly", priority: 0.8 })
              })

              smStream.end()

              // cache the response
              streamToPromise(pipeline).then(sm => (sitemap = sm))
              // stream the response
              pipeline.pipe(response).on("error", e => {
                throw e
              })
            } catch (error) {
              log.error(error)
              response.status(500).end()
            }
          }
        ]
      })

      return _
    }
  })
}

setup()
