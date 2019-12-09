import { createGzip } from "zlib"
import { getModel } from "@factor/post/database"
import { SitemapStream, streamToPromise } from "sitemap"
import { uniq, addFilter, applyFilters, getPermalink, log } from "@factor/tools"
import { currentUrl } from "@factor/tools/url"
import { Request, Response } from "express"
import { RouteConfig } from "vue-router"

let sitemap: Buffer

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

const getRouteUrls = (): string[] => {
  // get routes
  // then remove duplicated and dynamic routes (which include a colon (:))
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
    { permalink: { $ne: null }, status: "published" },
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

export const setup = (): void => {
  addFilter({
    key: "sitemapMiddleware",
    hook: "middleware",
    callback: (_: object[]) => {
      _.push({
        path: "/sitemap.xml",
        middleware: [
          async (request: Request, response: Response): Promise<void> => {
            // if we have a cached entry send it
            if (sitemap) {
              response.send(sitemap)
              return
            }
            try {
              const smStream = new SitemapStream({ hostname: currentUrl() })
              const pipeline = smStream.pipe(createGzip())

              const urls = await getPermalinks()

              urls.forEach(url => {
                smStream.write({ url })
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
