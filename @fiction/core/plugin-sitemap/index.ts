import path from 'node:path'
import type { Buffer } from 'node:buffer'
import fs from 'fs-extra'
import type { FictionPluginSettings } from '../plugin.js'
import { FictionPlugin } from '../plugin.js'
import { safeDirname } from '../utils/index.js'
import { dayjs } from '../utils/libraries.js'
import type { RunVars } from '../inject.js'
import type { FictionApp } from '../plugin-app/index.js'
import type { FictionRouter } from '../plugin-router/index.js'

export type SitemapLoader = (args: { runVars: Partial<RunVars>, fictionRouter: FictionRouter }) => (SitemapConfig | Promise<SitemapConfig>)

export type SitemapConfig = { paths: string[], topic: string, hostname: string }

type FictionSitemapSettings = { fictionApp: FictionApp } & FictionPluginSettings

export class FictionSitemap extends FictionPlugin<FictionSitemapSettings> {
  constructor(settings: FictionSitemapSettings) {
    super('sitemap', settings)
  }

  sitemapLoaders: SitemapLoader[] = []

  async generateSitemap(args: {
    runVars: Partial<RunVars>
    distClient?: string
    baseUrl?: string
  }): Promise<Buffer | undefined> {
    const { distClient } = args

    try {
      const paths = await this.getSitemapPaths(args)

      const requestUrl = new URL(args.runVars.ORIGIN || '')

      this.log.info(`starting sitemap with ${paths.length} paths`, { data: { requestUrl, paths } })

      if (paths.length === 0)
        return
      const sourceData = paths.map((url) => {
        return { url, changefreq: 'daily', priority: 0.7, lastmod: dayjs().format('YYYY-MM-DD') }
      })

      const sitemap = await import(/* @vite-ignore */ 'sitemap')
      const { getNodeStream } = await import('../utils/nodeUtils.js')
      const nodeStream = getNodeStream()

      const xslUrl = [requestUrl, 'sitemap.xsl'].join('')
      const stream = new sitemap.SitemapStream({ hostname: requestUrl.toString(), xslUrl })

      // Return a promise that resolves with your XML string
      const sitemapXmlData = await sitemap.streamToPromise(
        nodeStream.Readable.from(sourceData).pipe(stream),
      )

      const dirname = safeDirname(import.meta.url)

      if (distClient) {
        fs.copySync(
          path.resolve(dirname, './sitemap.xsl'),
          path.join(distClient, './sitemap.xsl'),
        )
        fs.writeFileSync(
          path.join(distClient, './sitemap.xml'),
          sitemapXmlData.toString(),
        )

        this.log.info('built sitemap.xml', { data: { distClient } })
      }

      return sitemapXmlData
    }
    catch (error) {
      this.log.error('error in generateSitemap', { error })
    }
  }

  getSitemapPaths = async (args: { runVars: Partial<RunVars> }): Promise<string[]> => {
    const fictionRouter = this.settings.fictionApp.settings.fictionRouter
    const sitemaps = await Promise.all(this.sitemapLoaders.map(async loader => loader({ ...args, fictionRouter })))

    const out = sitemaps.flatMap(({ paths }) => [...paths])

    // use Set to remove duplicates
    const urls = new Set(out)

    return [...urls]
  }

  getXslContent = async (): Promise<string> => {
    const dirname = safeDirname(import.meta.url)
    const xslPath = path.resolve(dirname, './sitemap.xsl')
    return fs.readFile(xslPath, 'utf8')
  }
}
