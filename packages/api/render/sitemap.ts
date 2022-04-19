import { Readable } from "stream"
import path from "path"
import { RouteRecordRaw } from "vue-router"
import dayjs from "dayjs"
import { SitemapStream, streamToPromise } from "sitemap"
import fs from "fs-extra"
import { logger } from ".."
import { getSitemaps } from "../engine/sitemap"
import { generateRoutes } from "../router"
import { userConfigSetting } from "../config/plugins"
import { RunConfig } from "../cli/utils"
/**
 * Recursively process route config to string urls
 */
export const _processRouteConfigToUrls = (
  routes?: RouteRecordRaw[],
  parent = "",
): string[] => {
  let out: string[] = []

  routes
    ?.filter((_) => _.path !== "*" && (_.component || _.components))
    .forEach((_) => {
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
        out = [...out, ..._processRouteConfigToUrls(_.children, _.path)]
      }
    })

  return out.filter(
    (_) => !_.includes(":") && !_.includes("?") && !_.includes("*"),
  )
}

export const getKnownRouteUrls = async (): Promise<string[]> => {
  const urls = _processRouteConfigToUrls(
    generateRoutes(userConfigSetting("routes")),
  )

  return urls
}

export const getSitemapPaths = async (): Promise<string[]> => {
  const main = await getKnownRouteUrls()
  const maps = getSitemaps()

  let out: string[] = []

  maps.forEach(({ paths }) => {
    out = [...out, ...paths]
  })

  // use Set to remove duplicates
  const urls = new Set([...out, ...main])

  return [...urls]
}

export const generateSitemap = async (params: RunConfig): Promise<void> => {
  const { distClient, userConfig } = params

  if (!distClient) throw new Error("distClient is required for sitemap")

  logger.info("generateSitemap", "starting")
  const sitemapBaseUrl = userConfig?.appUrl

  if (!sitemapBaseUrl) {
    throw new Error("sitemap: base URL was empty (FACTOR_APP_URL)")
  }

  const paths = await getSitemapPaths()

  const sourceData = paths.map((url) => {
    const slashes = url.split("/").length

    let changefreq: "daily" | "weekly"
    let priority: number
    if (slashes > 2) {
      changefreq = "weekly"
      priority = 0.3
    } else {
      changefreq = "daily"
      priority = 0.7
    }
    return {
      url,
      changefreq,
      priority,
      lastmod: dayjs().format("YYYY-MM-DD"),
    }
  })

  const stream = new SitemapStream({
    hostname: sitemapBaseUrl,
    xslUrl: [sitemapBaseUrl, "sitemap.xsl"].join("/"),
  })

  // Return a promise that resolves with your XML string
  const sitemapXmlData = await streamToPromise(
    Readable.from(sourceData).pipe(stream),
  )

  const dirname = new URL(".", import.meta.url).pathname
  fs.copySync(
    path.resolve(dirname, "./sitemap.xsl"),
    path.join(distClient, "./sitemap.xsl"),
  )
  fs.writeFileSync(
    path.join(distClient, "./sitemap.xml"),
    sitemapXmlData.toString(),
  )

  logger.info("generateSitemap", "built")
}
