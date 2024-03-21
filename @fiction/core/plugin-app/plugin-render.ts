/* server-only-file */
import path from 'node:path'
import type http from 'node:http'
import * as vite from 'vite'
import fs from 'fs-extra'
import compression from 'compression'
import serveStatic from 'serve-static'
import { minify } from 'html-minifier'
import type { Express, Request } from 'express'
import unocss from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'
import type tailwindcss from 'tailwindcss'
import { getRequire, importIfExists, requireIfExists, runHooks, safeDirname } from '../utils'
import type { FictionEnv } from '../plugin-env'
import type { FictionRouter } from '../plugin-router'
import { FictionBuild } from '../plugin-build'
import { FictionPlugin } from '../plugin'
import { version } from '../package.json'
import type { RunVars } from '../inject'
import type * as types from './types'
import { FictionSitemap } from './sitemap'
import { getMarkdownPlugins } from './utils/vitePluginMarkdown'
import { IndexHtml, getRequestVars } from './render/utils'
import { SSR } from './render/ssr'
import type { FictionApp } from '.'

export type FictionRenderSettings = {
  fictionEnv: FictionEnv
  fictionRouter: FictionRouter
  fictionApp: FictionApp
}

export class FictionRender extends FictionPlugin<FictionRenderSettings> {
  fictionApp = this.settings.fictionApp
  fictionEnv = this.settings.fictionEnv
  fictionRouter = this.settings.fictionRouter
  fictionBuild: FictionBuild
  fictionSitemap: FictionSitemap
  isApp = this.fictionEnv.isApp
  distFolder = path.join(this.fictionEnv.distFolder, this.fictionApp.appInstanceId)
  distFolderServer = path.join(this.distFolder, `server`)
  distFolderServerMountFile = path.join(this.distFolderServer, 'mount')
  distFolderClient = path.join(this.distFolder, `client`)
  distFolderStatic = path.join(this.distFolder, `static`)
  srcFolder = this.fictionApp.srcFolder
  mainIndexHtml = this.fictionApp.mainIndexHtml
  publicFolder = this.fictionApp.publicFolder

  indexTemplates: types.IndexTemplates = {
    main: {
      location: this.mainIndexHtml,
    },
  }

  staticServer?: http.Server
  viteDevServer?: vite.ViteDevServer
  root = safeDirname(import.meta.url)
  mountFilePath = path.join(this.root, '/mount.ts')

  indexHtml = new IndexHtml({ mountFilePath: this.mountFilePath, distClientFolder: this.distFolderClient })

  constructor(settings: FictionRenderSettings) {
    super('FictionRender', settings)

    if (this.isApp.value)
      throw new Error('render is server only')

    this.fictionBuild = new FictionBuild({ fictionEnv: this.fictionEnv })
    this.fictionSitemap = new FictionSitemap({ fictionRouter: this.fictionRouter, fictionEnv: this.fictionEnv })
  }

  getViteServer = async (config: {
    isProd: boolean
  }): Promise<vite.ViteDevServer> => {
    const { isProd } = config
    if (!this.viteDevServer) {
      const viteConfig = await this.getViteConfig({ isProd })

      const serverConfig = this.utils.deepMergeAll([
        viteConfig,
        {
          appType: 'custom',
          server: { middlewareMode: true },
        },
      ])

      this.viteDevServer = await vite.createServer(serverConfig)
    }

    return this.viteDevServer
  }

  getAppViteConfigFile = async (): Promise<vite.InlineConfig | undefined> => {
    const _module = await importIfExists<{
      default: vite.InlineConfig | (() => Promise<vite.InlineConfig>)
    }>(path.join(this.fictionEnv.cwd, 'vite.config.ts'))

    let config: vite.InlineConfig | undefined
    const result = _module?.default

    if (result) {
      if (typeof result === 'function')
        config = await result()
      else
        config = result
    }

    return config
  }

  async getTailwindConfig(): Promise<Record<string, any> | undefined> {
    const baseUiPaths = [...this.fictionEnv.uiPaths, ...this.fictionApp.uiPaths]
    const fullUiPaths = baseUiPaths.map(p => path.normalize(p))

    const c: Record<string, any>[] = [
      {
        mode: 'jit',
        content: fullUiPaths,
        safelist: ['italic', 'lowercase', 'font-bold'],
      },
      ...this.fictionApp.tailwindConfig,
    ]

    const userTailwindConfig = await requireIfExists(
      path.join(this.fictionEnv.cwd, 'tailwind.config.cjs'),
    )

    if (userTailwindConfig) {
      const userConf = userTailwindConfig as Record<string, any>
      c.push(userConf)
    }

    const config = this.utils.deepMergeAll<Record<string, any>>(
      c.map((_) => {
        return { ..._ }
      }),
    )

    return config
  }

  getStaticPathAliases = (opts: { mainFilePath?: string }): { find: string, replacement: string }[] => {
    const { mainFilePath } = opts
    const blankModule = path.join(this.root, './blank.ts')

    const mainFileExists = mainFilePath && fs.existsSync(mainFilePath)
    if (mainFilePath && !mainFileExists)
      this.log.error(`mainFilePath does not exist: ${mainFilePath}`)

    const mainFile = mainFileExists ? mainFilePath : blankModule

    const out = [
      { find: '@MOUNT_FILE_ALIAS', replacement: this.mountFilePath },
      { find: '@MAIN_FILE_ALIAS', replacement: mainFile },
      { find: '/@mount.ts', replacement: blankModule },
    ]

    return out
  }

  async getViteConfig(config: { isProd: boolean, isServerBuild?: boolean }): Promise<vite.InlineConfig> {
    const { isProd, isServerBuild } = config

    const { default: pluginVue } = await import('@vitejs/plugin-vue')

    const commonVite = await this.fictionBuild?.getFictionViteConfig({
      isProd,
      root: this.fictionEnv.cwd,
      mainFilePath: this.fictionEnv.mainFilePath,
      isServerBuild,
    })

    const appViteConfigFile = await this.getAppViteConfigFile()

    const twPlugin = getRequire()('tailwindcss') as typeof tailwindcss
    const { visualizer } = await import('rollup-plugin-visualizer')
    const twConfig = (await this.getTailwindConfig()) as Parameters<typeof twPlugin>[0]

    let merge: vite.InlineConfig[] = [
      commonVite || {},
      {
        publicDir: this.publicFolder,
        css: {
          postcss: {
            plugins: [
              getRequire()('tailwindcss/nesting'),
              twPlugin(twConfig),
              getRequire()('autoprefixer'),
            ],
          },
        },
        server: {},
        plugins: [
          visualizer({ filename: `stats.html`, emitFile: true }),
          pluginVue(),
          ...getMarkdownPlugins({ isProd, distClient: this.distFolderClient }),
          unocss({ presets: [presetIcons()], safelist: [] }),
        ],
        resolve: {
          alias: [
            ...this.getStaticPathAliases({ mainFilePath: this.fictionEnv.mainFilePath }),
          ],
        },
      },
      appViteConfigFile || {},
    ]

    merge = await this.utils.runHooks({ list: this.fictionApp.hooks, hook: 'viteConfig', args: [merge] })

    const viteConfig = this.utils.deepMergeAll(merge)

    return viteConfig
  }

  serverRenderHtml = async (params: types.RenderConfig): Promise<string> => {
    const { pathname = '/', template, isProd, runVars = {} } = params

    const viteServer = await this.getViteServer({ isProd })

    const ssr = new SSR({
      appUrl: this.fictionApp.appUrl.value,
      distFolderServerMountFile: this.distFolderServerMountFile,
      viteServer,
      mountFilePath: this.mountFilePath,
    })

    const parts = await ssr.render({ pathname, isProd, runVars })

    let { htmlBody, headTags, bodyTags } = parts
    const { htmlAttrs, bodyAttrs, bodyTagsOpen } = parts

    if (!template)
      throw new Error('html template required')

    headTags = await runHooks({ list: this.fictionApp.hooks, hook: 'headTags', args: [headTags, { pathname }] })
    htmlBody = await runHooks({ list: this.fictionApp.hooks, hook: 'htmlBody', args: [htmlBody, { pathname }] })

    const debuggingInfo = `<!--${JSON.stringify({ renderedPathname: pathname, isProd })}-->`

    const bodyCloseTags = `${bodyTags}\n${debuggingInfo}`

    const headHtml = [headTags, `<meta name="generator" content="Fiction ${version}" />`].join(`\n`)

    const html = template
      .replace(`<!--head-->`, `\n${headHtml}\n`)
      .replace(`<!--app-->`, `\n${htmlBody}\n`)
      .replace(/<body([^>]*)>/i, `<body$1 ${bodyAttrs}>`)
      .replace(/<html([^>]*)>/i, `<html$1 ${htmlAttrs}>`)
      .replace(/<body([^>]*)>/i, `<body$1>\n${bodyTagsOpen}\n`)
      .replace(/<\/body>/i, `\n${bodyCloseTags}\n</body>`)

    return minify(html, { continueOnParseError: true, collapseWhitespace: isProd })
  }

  async buildApp(options: {
    render?: boolean
    serve?: boolean
    minify?: boolean
  }): Promise<void> {
    if (this.isApp.value)
      return

    const { render = true, serve = false, minify = false } = options

    if (!this.fictionApp.appUrl)
      throw new Error('appUrl is required')

    const distFolder = this.distFolder
    const distFolderClient = this.distFolderClient
    const distFolderServer = this.distFolderServer

    const html = this.indexHtml.getBuildIndexHtml()
    const templates = { main: { html } }

    this.log.info(`building fiction app (${this.fictionApp.appInstanceId})`, {
      data: {
        isNode: this.utils.isNode(),
        indexFiles: Object.values(templates).length,
      },
    })

    try {
      const viteConfigServer = await this.getViteConfig({ isProd: true, isServerBuild: true })
      const viteConfigClient = await this.getViteConfig({ isProd: true, isServerBuild: true })

      fs.ensureDirSync(distFolder)

      // rollup input option
      // https://vitejs.dev/guide/build.html#multi-page-app
      const input: Record<string, string> = {}
      Object.entries(templates).forEach(([key, v]) => {
        const fileName = key === 'main' ? `index.html` : `${key}.html`

        if (v.html) {
          const f = path.join(distFolder, fileName)
          this.log.info('writing file to dist', { data: f })
          fs.writeFileSync(f, v.html)
        }

        input[key] = path.resolve(distFolder, fileName)
      })

      /**
       * root should be where index.html is, all manifest.json paths
       * are written relative to this
       */
      const root = distFolder
      const clientBuildOptions: vite.InlineConfig = this.utils.deepMergeAll([
        viteConfigClient,
        {
          root,
          build: {
            outDir: distFolderClient,
            emptyOutDir: true,
            ssrManifest: true,
            rollupOptions: { input },
            minify, // easier debug
          },
        },
      ])

      const serverBuildOptions: vite.InlineConfig = this.utils.deepMergeAll([
        viteConfigServer,
        {
          root,
          build: {
            emptyOutDir: true,
            outDir: distFolderServer,
            ssr: true,
            minify, // easier debug
            rollupOptions: {
              preserveEntrySignatures: 'allow-extension', // not required
              input: path.join(safeDirname(import.meta.url), './mount.ts'),
              output: { format: 'es' },
            },
          },
        },
      ])

      this.log.info('[start:build] starting builds')

      await Promise.all([
        vite.build(clientBuildOptions),
        vite.build(serverBuildOptions),
      ])

      this.log.info(`[done:build] build completed successfully (${this.fictionApp.appInstanceId})`)

      const sitemaps = await Promise.all(
        this.fictionApp.sitemaps.map(async (s) => {
          const r = await s()
          return r
        }),
      )
      await this.fictionSitemap?.generateSitemap({
        appUrl: this.fictionApp.appUrl.value,
        sitemaps,
        distClient: distFolderClient,
      })

      if (render)
        await this.preRender({ serve })
    }
    catch (error) {
      this.log.error('[error] failed to build application', { error })
      throw error
    }
  }

  preRenderPages = async (): Promise<void> => {
    const distFolderClient = this.distFolderClient
    const distFolderStatic = this.distFolderStatic
    const isProd = true
    const sitemaps = await Promise.all(
      this.fictionApp.sitemaps.map(async (s) => {
        const r = await s()
        return r
      }),
    )

    const template = await this.indexHtml.getRenderedIndexHtml()

    const urls
      = (await this.fictionSitemap?.getSitemapPaths({
        sitemaps,
      })) || []

    fs.ensureDirSync(distFolderStatic)
    fs.emptyDirSync(distFolderStatic)
    fs.copySync(distFolderClient, distFolderStatic)

    if (!this.fictionEnv.isProd?.value) {
      this.log.warn(
        'pre-rendering in development mode (should be prod in most cases)',
      )
    }

    this.log.info('pre-render URLS', { data: { sitemaps, urls } })

    /**
     * @important pre-render in series
     * if pre-rendering isn't in series than parallel builds can interfere with one-another
     */
    const _asyncFunctions = urls.map((pathname: string) => {
      return async (): Promise<string> => {
        const filePath = `${pathname === '/' ? '/index' : pathname}.html`
        this.log.info(`pre-rendering [${filePath}]`)

        const runVars: Partial<RunVars> = {
          ...this.fictionEnv.getRenderedEnvVars(),
          PATHNAME: pathname,
        }

        const html = await this.serverRenderHtml({
          template,
          isProd,
          pathname,
          runVars,
        })

        const writePath = path.join(this.distFolderStatic, filePath)
        fs.ensureDirSync(path.dirname(writePath))
        fs.writeFileSync(writePath, html)

        this.log.info(`done [${filePath}]`)
        return filePath
      }
    })
    // run in series
    for (const fn of _asyncFunctions)
      await fn()

    this.log.info(`[done:render]`)
  }

  getRunVars = (args: { request: Request }): Record<string, string> => {
    const { request } = args
    return {
      ...this.fictionEnv.getRenderedEnvVars(),
      APP_INSTANCE: this.fictionApp.appInstanceId,
      ...getRequestVars({ request }),
    }
  }

  addRunVarsToHtml(args: { html: string, runVars?: Record<string, string> }): string {
    const { html, runVars } = args
    const stringifiedVars = JSON.stringify(runVars)
    const tag = `<script id="fictionRun" type="application/json">${stringifiedVars}</script>`
    const out = html.replace(/<\/body>/i, `${tag}\n</body>`)
    return out
  }

  async getStaticHtmlFile(filePath: string, request: Request): Promise<string | undefined> {
    try {
      const html = await fs.readFile(filePath)
      const runVars = this.getRunVars({ request })
      return this.addRunVarsToHtml({ html: html.toString(), runVars })
    }
    catch { }
  }

  createExpressApp = async (config: {
    isProd: boolean
    expressApp?: Express
  }): Promise<Express | undefined> => {
    if (this.isApp.value)
      return

    const { isProd, expressApp } = config

    const eApp = expressApp || this.utils.express()

    // allow additional forwarded info
    // https://stackoverflow.com/questions/23413401/what-does-trust-proxy-actually-do-in-express-js-and-do-i-need-to-use-it
    eApp.set('trust proxy', true)

    try {
      let viteServer: vite.ViteDevServer | undefined

      let template: string
      if (isProd) {
        eApp.use(compression())
        eApp.use(serveStatic(this.distFolderClient, { index: false }))
        template = await this.indexHtml.getRenderedIndexHtml()
      }
      else {
        viteServer = await this.getViteServer({ isProd })
        eApp.use(viteServer.middlewares)
        template = await this.indexHtml.getDevIndexHtml({ viteServer, pathname: '/' })
      }

      // server side rendering
      eApp.use('*', async (req, res) => {
        const pathname = req.originalUrl

        // This is the page catch all loader,
        // If a file request falls through to this its 404
        // make sure false triggers don't occur
        const rawPath = pathname.split('?')[0]
        if (rawPath.includes('.') && rawPath.split('.').pop() !== 'html') {
          res.status(404).end()
          return
        }

        try {
          const runVars = this.getRunVars({ request: req })
          const html = await this.serverRenderHtml({ template, pathname, isProd, runVars })

          const outputHtml = this.addRunVarsToHtml({ html, runVars })

          res.status(200).set({ 'Content-Type': 'text/html' }).end(outputHtml)
        }
        catch (error: unknown) {
          const e = error as Error
          viteServer && viteServer.ssrFixStacktrace(e)

          this.log.error('ssr error', { error })
          res.status(500).end(e.stack)
        }
      })
      return eApp
    }
    catch (error) {
      const e = error as Error
      this.log.error(`express creation error: ${e.message}`, { error: e })

      return eApp
    }
  }

  serveStaticApp = async (): Promise<http.Server | undefined> => {
    if (this.isApp.value)
      return

    const distFolderStatic = this.distFolderStatic

    const app = this.utils.createExpressApp({
      // in dev these cause images/scripts to fail locally
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      xFrameOptions: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })

    app.use(async (req, res, next) => {
      let pathname = req.originalUrl.split('?')[0]

      if (!pathname.includes('.') || pathname.includes('.html')) {
        pathname = pathname.at(-1) === '/' ? `${pathname}index.html` : pathname

        const rel = pathname.includes('.html') ? pathname : `${pathname}.html`
        const filePath = path.join(distFolderStatic, rel)
        const fileHtml = await this.getStaticHtmlFile(filePath, req)
        const html = fileHtml || await this.getStaticHtmlFile(path.join(distFolderStatic, 'index.html'), req)

        res.setHeader('content-type', 'text/html').send(html).end()
      }
      else {
        next()
      }
    })
    app.use(serveStatic(distFolderStatic, { index: false }))

    app.use('*', (req, res) => {
      this.log.error(`404 Request ${req.url}`, {
        data: { url: req.url, originalUrl: req.originalUrl, method: req.method, accept: req.headers.accept },
      })
      res.status(404).end()
    })

    await new Promise<void>((resolve) => {
      this.staticServer = app?.listen(this.fictionApp.port, () => resolve())
    })

    this.fictionApp.logReady({ serveMode: 'static' })

    return this.staticServer
  }

  preRender = async (opts?: { serve: boolean }): Promise<void> => {
    const { serve = false } = opts || {}

    this.log.info('page render starting')

    await this.preRenderPages()

    this.log.info('page render complete')

    if (serve) {
      this.log.info('serving...')
      await this.serveStaticApp()
    }
  }
}
