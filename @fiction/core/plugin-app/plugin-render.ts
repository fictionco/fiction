/* server-only-file */
import path from 'node:path'
import type http from 'node:http'
import process from 'node:process'
import * as vite from 'vite'
import fs from 'fs-extra'
import compression from 'compression'
import serveFavicon from 'serve-favicon'
import serveStatic from 'serve-static'
import { minify } from 'html-minifier'
import type { Express, Request } from 'express'
import unocss from 'unocss/vite'
import presetIcons from '@unocss/preset-icons'
import { renderToString } from '@vue/server-renderer'
import type tailwindcss from 'tailwindcss'
import { renderSSRHead } from '@unhead/ssr'
import { JSDOM } from 'jsdom'
import { getRequire, importIfExists, requireIfExists, runHooks, safeDirname } from '../utils'
import type { FictionEnv } from '../plugin-env'
import type { FictionRouter } from '../plugin-router'
import { FictionBuild } from '../plugin-build'
import { FictionPlugin } from '../plugin'
import { version } from '../package.json'
import { populateGlobal } from '../utils/globalUtils'
import { getFaviconPath, renderPreloadLinks } from './utils'
import type * as types from './types'
import { FictionSitemap } from './sitemap'
import { getMarkdownPlugins } from './utils/vitePluginMarkdown'
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

  constructor(settings: FictionRenderSettings) {
    super('FictionRender', settings)

    if (this.isApp.value)
      throw new Error('render is server only')

    this.fictionBuild = new FictionBuild({ fictionEnv: this.fictionEnv })
    this.fictionSitemap = new FictionSitemap({ fictionRouter: this.fictionRouter, fictionEnv: this.fictionEnv })
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

  getIndexHtmlTemplates = async (params: {
    pathname?: string
    isProd: boolean
  }): Promise<types.IndexTemplates> => {
    const { pathname = '/', isProd } = params

    const promises = Object.entries(this.indexTemplates).map(
      async ([key, v]) => {
        if (!fs.existsSync(v.location))
          throw new Error(`no index.html at location (${v.location})`)

        const rawTemplate = fs.readFileSync(v.location, 'utf8')

        // alias is need for vite/rollup to handle correctly
        const clientTemplatePath = isProd ? `@MOUNT_FILE_ALIAS` : `/@fs${this.mountFilePath}`

        const template = rawTemplate.replace(
          '</body>',
          `<script type="module" src="${clientTemplatePath}"></script>
    </body>`,
        )

        if (!isProd && pathname) {
          const srv = await this.getViteServer({ isProd })
          v.html = await srv.transformIndexHtml(pathname, template)
        }
        else {
          v.html = template
        }

        return [key, v]
      },
    )

    const result = await Promise.all(promises)

    return Object.fromEntries(result) as types.IndexTemplates
  }

  getStaticPathAliases = (opts: { mainFilePath?: string }): { find: string, replacement: string }[] => {
    const { mainFilePath } = opts
    const blankModule = path.join(this.root, './blank.ts')

    const mainFileExists = mainFilePath && fs.existsSync(mainFilePath)
    if (mainFilePath && !mainFileExists)
      this.log.warn(`mainFilePath does not exist: ${mainFilePath}`)

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
          pluginVue(),
          ...getMarkdownPlugins({ isProd, distClient: this.distFolderClient }),
          unocss({
            presets: [presetIcons()],
            safelist: [],
          }),
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

  serverRenderApp = async (
    args: types.RenderConfig,
  ): Promise<types.RenderedHtmlParts> => {
    const { pathname, manifest, isProd, runVars = {} } = args

    let out: types.RenderedHtmlParts = { bodyAttrs: '', preloadLinks: '', headTags: '', htmlAttrs: '', bodyTags: '', bodyTagsOpen: '', htmlBody: '' }

    let entryModule: Record<string, any>

    // set flag used to determine if app code is running in vite
    process.env.IS_VITE = 'yes'

    const ssrDev = true

    if (isProd || ssrDev) {
      let revertGlobal
      try {
        // Simulate window object using jsdom
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: `${this.fictionApp.appUrl.value}${pathname}` })

        const r = populateGlobal(globalThis, dom.window, { bindFunctions: true })

        revertGlobal = r.revert
        /**
         * Use pre-build server module in Production
         * otherwise use Vite's special module loader
         */
        if (isProd) {
          entryModule = (await import(/* @vite-ignore */ path.join(this.distFolderServerMountFile))) as Record<string, any>
        }
        else {
          const srv = await this.getViteServer({ isProd })
          entryModule = await srv.ssrLoadModule(this.mountFilePath)
        }

        const { runAppEntry } = entryModule as types.EntryModuleExports

        const fictionAppEntry = await runAppEntry({ renderRoute: pathname, runVars })

        if (!fictionAppEntry)
          throw new Error('SSR Error: rendering failed')

        const { app, meta } = fictionAppEntry

        /**
         * Pass context for rendering (available useSSRContext())
         * vitejs/plugin-vue injects code in component setup() that registers the component
         * on the context. Allowing us to orchestrate based on this.
         */

        const ctx: { modules?: string[] } = {}
        out.htmlBody = await renderToString(app, ctx)

        /**
         * SSR manifest maps assets which allows us to render preload links for performance
         */
        if (manifest)
          out.preloadLinks = renderPreloadLinks(ctx?.modules ?? [], manifest)

        /**
         * Meta/Head Rendering
         */
        const head = await renderSSRHead(meta)
        out = { ...out, ...head }
      }
      catch (error) {
        this.log.error(`SSR Error (${pathname}) - ${(error as Error).message}`, { error })
        throw error
      }
      finally {
        delete process.env.IS_VITE
        // Ensure that revert is called even if an error occurs
        revertGlobal?.()
      }
    }

    // unset flag used to determine if app code is running in vite
    delete process.env.IS_VITE

    return out
  }

  /**
   * Gets file content needed to render HTML
   * @notes
   *  - in production takes from pre-generated client
   *  - in development, looks in SRC folder for index.html
   */
  htmlGenerators = async (config: {
    isProd: boolean
    distClient: string
  }): Promise<types.RenderConfig> => {
    const { isProd = false, distClient } = config

    if (!distClient)
      throw new Error('dist is required')

    const out: types.RenderConfig = { template: '', manifest: {}, isProd }

    if (isProd) {
      fs.ensureDirSync(distClient)
      const indexHtmlPath = path.resolve(distClient, './index.html')
      out.template = fs.readFileSync(indexHtmlPath, 'utf8')
      const manifestPath = path.resolve(distClient, './.vite/ssr-manifest.json')
      out.manifest = (await import(/* @vite-ignore */ manifestPath)) as Record< string, any >
    }
    else {
      const templates = await this.getIndexHtmlTemplates({ pathname: '/', isProd })

      out.template = templates.main.html
    }

    return out
  }

  serverRenderHtml = async (params: types.RenderConfig): Promise<string> => {
    const { pathname, manifest, template, isProd, runVars } = params

    const parts = await this.serverRenderApp({ pathname, manifest, isProd, runVars })
    let { htmlBody, headTags, bodyTags } = parts
    const { preloadLinks, htmlAttrs, bodyAttrs, bodyTagsOpen } = parts

    if (!template)
      throw new Error('html template required')

    headTags = await runHooks({ list: this.fictionApp.hooks, hook: 'headTags', args: [headTags, { pathname }] })
    htmlBody = await runHooks({ list: this.fictionApp.hooks, hook: 'htmlBody', args: [htmlBody, { pathname }] })

    const canonicalUrl = [this.fictionApp.appUrl.value || '', pathname || '']
      .map((_: string) => _.replace(/\/$/, ''))
      .join('')

    const replacementTags = { head: `<!--head-->`, app: `<!--app-->` }

    const debuggingInfo = `<!--${JSON.stringify({ renderedPathname: pathname, isProd })}-->`

    const bodyCloseTags = `${bodyTags}\n${debuggingInfo}`

    Object.entries(replacementTags).forEach(([key, value]) => {
      if (!template.includes(value))
        this.log.error(`template does not include ${key}-- ${value}`)
    })

    const headHtml = [
      headTags,
      preloadLinks,
      `<link href="${canonicalUrl}" rel="canonical">`,
      `<meta name="generator" content="FictionJS ${version}" />`,
    ].join(`\n`)

    const html = template
      .replace(replacementTags.head, `\n${headHtml}\n`)
      .replace(replacementTags.app, `\n${htmlBody}\n`)
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

    // build index to dist
    const templates = await this.getIndexHtmlTemplates({ isProd: true })

    this.log.info(`building fiction app (${this.fictionApp.appInstanceId})`, {
      data: {
        isNode: this.utils.isNode(),
        indexFiles: Object.values(templates).length,
      },
    })

    const distFolder = this.distFolder
    const distFolderClient = this.distFolderClient
    const distFolderServer = this.distFolderServer
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
    const generators = await this.htmlGenerators({ isProd: true, distClient: distFolderClient })

    const sitemaps = await Promise.all(
      this.fictionApp.sitemaps.map(async (s) => {
        const r = await s()
        return r
      }),
    )

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
        const html = await this.serverRenderHtml({
          ...generators,
          pathname,
          runVars: {
            ...this.fictionEnv.getRenderedEnvVars(),
            PATHNAME: pathname,
          },
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

  getRequestVars(args: { request: Request }): Record<string, string> {
    const { request } = args
    // Extracting protocol (HTTP vs HTTPS)
    const protocol = request?.protocol || 'http' // Defaults to 'http' if protocol is not available

    // Extracting subdomain
    const subdomains = request?.subdomains || []
    const subdomain = subdomains?.length > 0 ? subdomains.join('.') : ''

    // Extracting other relevant information
    const host = request?.get('host') // Hostname with port if applicable
    const ip = request?.ip // IP address of the request
    const userAgent = request?.get('User-Agent') // User-Agent header

    const add = { APP_INSTANCE: this.fictionApp.appInstanceId }

    const ORIGIN = `${protocol}://${host}`

    const requestVars = {
      ...this.fictionEnv.getRenderedEnvVars(),
      PROTOCOL: protocol,
      SUBDOMAIN: subdomain,
      HOST: host,
      IP_ADDRESS: ip,
      USER_AGENT: userAgent,
      HOSTNAME: request?.hostname,
      PATHNAME: request?.originalUrl,
      ORIGIN,
      URL: `${ORIGIN}${request?.originalUrl}`,
      ...add,
    }

    return requestVars as Record<string, string>
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
      const runVars = this.getRequestVars({ request })
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
      const faviconFile = getFaviconPath(this.srcFolder)
      if (faviconFile)
        eApp.use(serveFavicon(faviconFile))

      let viteServer: vite.ViteDevServer | undefined

      const { manifest, template } = await this.htmlGenerators({
        isProd,
        distClient: this.distFolderClient,
      })

      /**
       * Serve static files
       */
      if (isProd) {
        eApp.use(compression())
        eApp.use(serveStatic(this.distFolderClient, { index: false }))
      }
      else {
        viteServer = await this.getViteServer({ isProd })
        eApp.use(viteServer.middlewares)
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
          const runVars = this.getRequestVars({ request: req })
          const html = await this.serverRenderHtml({ template, pathname, manifest, isProd, runVars })

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
