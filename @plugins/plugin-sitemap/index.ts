import { createGzip } from "zlib"
import { getModel } from "@factor/post/database"
import { SitemapStream, SitemapIndexStream, ErrorLevel, SitemapItemLoose } from "sitemap"
import {
  addFilter,
  runCallbacks,
  addCallback,
  log,
  getKnownRoutePaths
} from "@factor/api"
import { currentUrl } from "@factor/api/url"
import { postTypesConfig, PostTypeConfig } from "@factor/api/post-types"

import NodeCache from "node-cache"

import { Request, Response } from "express"
import { WebpackCopyItemConfig } from "@factor/build/types"
import { PostStatus } from "@factor/post/types"

const sitemapsCache = new NodeCache()

export type SitemapItem = SitemapItemLoose
export interface RegisteredSitemap {
  _id: string;
  items: SitemapItem[];
}

/**
 * Registers a sitemap callback
 * @param _id - sitemap ID
 * @param getItems - sync/async function that gets the sitemap items
 */
export const registerSitemap = (
  _id: string,
  getItems: () => Promise<SitemapItemLoose[]> | SitemapItemLoose[]
): void => {
  addCallback({
    key: _id,
    hook: "sitemaps",
    callback: async (): Promise<RegisteredSitemap> => {
      const items = await getItems()

      return { _id, items }
    }
  })
  return
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

/**
 * Get all registered sitemaps, only run this once as sitemaps may run queries on the DB
 */
const getRegisteredSitemaps = async (): Promise<RegisteredSitemap[]> => {
  const cached = sitemapsCache.get<RegisteredSitemap[]>("sitemaps")
  if (cached) {
    return cached
  } else {
    const sitemaps = await runCallbacks<RegisteredSitemap>("sitemaps")

    const DAY = 60 * 60 * 24
    sitemapsCache.set("sitemaps", sitemaps, DAY)
    return sitemaps
  }
}

const getSitemap = async (_id: string): Promise<RegisteredSitemap | undefined> => {
  const sitemaps = await getRegisteredSitemaps()

  return sitemaps.find(map => map._id == _id)
}

const getSitemapUrl = (_id: string): string => {
  return [currentUrl(), "sitemaps", _id, "sitemap.xml"].join("/")
}

const getStyleUrl = (): string => {
  return [currentUrl(), "sitemap.xsl"].join("/")
}

export const setPostTypeSitemaps = async (): Promise<void> => {
  const postTypes: PostTypeConfig[] = postTypesConfig()

  postTypes.forEach((postTypeConfig: PostTypeConfig): void => {
    const { postType, addSitemap, permalink } = postTypeConfig
    if (!addSitemap || !permalink) return

    registerSitemap(
      postTypeConfig.postType,
      async (): Promise<SitemapItem[]> => {
        const Model = getModel(postType)

        const posts = await Model.find({ status: PostStatus.Published })

        return posts.map(p => {
          return { url: permalink(p), lastmod: p.updatedAt?.toString() ?? "" }
        })
      }
    )
  })
  return
}

export const setup = (): void => {
  addCallback({
    key: "addSitemaps",
    hook: "db-initialized",
    callback: () => {
      registerSitemap("routes", () =>
        getKnownRoutePaths().map(_ => {
          return { url: _ }
        })
      )

      return setPostTypeSitemaps()
    }
  })
  /**
   * Copy any static/built files into root of dist
   */
  addFilter({
    key: "sitemapCopy",
    hook: "webpack-copy-files-config",
    callback: (_: WebpackCopyItemConfig[]) => {
      return [..._, ...copyStaticFiles()]
    }
  })

  addFilter({
    key: "sitemapRoutesMiddleware",
    hook: "middleware",
    callback: (_: object[]) => {
      _.push({
        path: "/sitemaps/:sitemapId/sitemap.xml",
        middleware: [
          async (request: Request, response: Response): Promise<void> => {
            response.header("Content-Type", "application/xml")
            response.header("Content-Encoding", "gzip")
            const _id = request.params.sitemapId

            try {
              const map = await getSitemap(_id)
              if (!map) {
                throw new Error(`Sitemap not found for ${_id}`)
              }
              const smStream = new SitemapStream({
                hostname: currentUrl(),
                xslUrl: getStyleUrl()
              })
              const pipeline = smStream.pipe(createGzip())

              map.items
                .map(item => {
                  const merged = { changefreq: "weekly", priority: 0.5, ...item }
                  // Ensure priority is a number or throws error
                  return { ...merged, priority: Number(merged.priority) }
                })
                .forEach(item => {
                  smStream.write(item)
                })
              smStream.end()

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
      _.push({
        path: "/sitemap.xml",
        middleware: [
          async (request: Request, response: Response): Promise<void> => {
            response.header("Content-Type", "application/xml")
            response.header("Content-Encoding", "gzip")

            try {
              const sitemapIndex = new SitemapIndexStream({
                xslUrl: getStyleUrl(),
                level: ErrorLevel.WARN
              })

              const sitemaps = await getRegisteredSitemaps()

              sitemaps.forEach(({ _id }) => {
                sitemapIndex.write({ url: getSitemapUrl(_id) })
              })

              const pipeline = sitemapIndex.pipe(createGzip())

              pipeline.pipe(response).on("error", e => {
                throw e
              })
              sitemapIndex.end()
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
