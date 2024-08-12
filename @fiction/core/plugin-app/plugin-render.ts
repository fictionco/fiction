/* server-only-file */
import path from 'node:path'
import type http from 'node:http'
import * as vite from 'vite'
import fs from 'fs-extra'
import compression from 'compression'
import serveStatic from 'serve-static'
import { minify } from 'html-minifier'
import type { Express, Request } from 'express'
import type tailwindcss from 'tailwindcss'
import { iconsPlugin } from '@egoist/tailwindcss-icons'
import express from 'express'
import { glob } from 'glob'
import chokidar from 'chokidar'
import { createExpressApp, debounce, deepMergeAll, getRequire, importIfExists, isNode, requireIfExists, safeDirname } from '../utils/index.js'
import type { FictionEnv } from '../plugin-env/index.js'
import type { FictionRouter } from '../plugin-router/index.js'
import { FictionBuild } from '../plugin-build/index.js'
import { FictionPlugin } from '../plugin.js'
import { version } from '../package.json'
import type { RunVars } from '../inject.js'
import type * as types from './types.js'
import { getMarkdownPlugins } from './utils/vitePluginMarkdown.js'
import { IndexHtml, getRequestVars } from './render/utils.js'
import { SSR } from './render/ssr.js'
import type { FictionApp } from './index.js'

export type FictionRenderSettings = {
  fictionEnv: FictionEnv
  fictionRouter: FictionRouter
  fictionApp: FictionApp
}

export class FictionRender extends FictionPlugin<FictionRenderSettings> {
  fictionApp = this.settings.fictionApp
  fictionRouter = this.settings.fictionRouter
  fictionBuild: FictionBuild

  isApp = this.settings.fictionEnv.isApp
  distFolder = path.join(this.settings.fictionEnv.distFolder, this.fictionApp.appInstanceId)
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

    this.fictionBuild = new FictionBuild(this.settings)
  }

  getViteServer = async (config: { mode: 'dev' | 'prod' | 'test' }): Promise<vite.ViteDevServer> => {
    const { mode } = config
    if (!this.viteDevServer) {
      const viteConfig = await this.getViteConfig({ mode })

      const serverConfig = deepMergeAll<vite.InlineConfig>([
        viteConfig,
        {
          appType: 'custom',
          server: { middlewareMode: true },
          // optimizeDeps: { holdUntilCrawlEnd: true },
        },
      ])

      this.viteDevServer = await vite.createServer(serverConfig)
    }

    return this.viteDevServer
  }

  getAppViteConfigFile = async (): Promise<vite.InlineConfig | undefined> => {
    const _module = await importIfExists<{
      default: vite.InlineConfig | (() => Promise<vite.InlineConfig>)
    }>(path.join(this.settings.fictionEnv.cwd, 'vite.config.ts'))

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
    const baseUiPaths = [...Array.from(this.settings.fictionEnv.uiPaths)]
    const fullUiPaths = baseUiPaths.map(p => path.normalize(p))

    const c: Record<string, any>[] = [
      {
        mode: 'jit',
        content: fullUiPaths,
        safelist: ['italic', 'lowercase', 'font-bold'],
        plugins: [iconsPlugin()],
      },
      ...this.fictionApp.tailwindConfig,
    ]

    const userTailwindConfig = await requireIfExists(
      path.join(this.settings.fictionEnv.cwd, 'tailwind.config.cjs'),
    )

    if (userTailwindConfig) {
      const userConf = userTailwindConfig as Record<string, any>
      c.push(userConf)
    }

    const config = deepMergeAll<Record<string, any>>(
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

  async getViteConfig(config: { mode: 'dev' | 'prod' | 'test' }): Promise<vite.InlineConfig> {
    const { mode } = config

    const { default: pluginVue } = await import('@vitejs/plugin-vue')

    const commonVite = await this.fictionBuild?.getFictionViteConfig({
      mode,
      root: this.settings.fictionEnv.cwd,
      mainFilePath: this.settings.fictionEnv.mainFilePath,
    })

    const isProd = mode === 'prod'

    const appViteConfigFile = await this.getAppViteConfigFile()

    const twPlugin = getRequire()('tailwindcss') as typeof tailwindcss

    const twConfig = (await this.getTailwindConfig()) as Parameters<typeof twPlugin>[0]

    const plugins = [
      pluginVue(),
      ...getMarkdownPlugins({ isProd, distClient: this.distFolderClient }),
    ]

    if (isProd) {
      const { visualizer } = await import('rollup-plugin-visualizer')
      plugins.unshift(visualizer({ filename: `stats.html`, emitFile: true }))
    }

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
        plugins,
        resolve: {
          alias: [
            ...this.getStaticPathAliases({ mainFilePath: this.settings.fictionEnv.mainFilePath }),
          ],
        },
      },
      appViteConfigFile || {},
    ]

    merge = await this.settings.fictionEnv.runHooks('viteConfig', merge)

    const viteConfig = deepMergeAll(merge)

    return viteConfig
  }

  serverRenderHtml = async (params: types.RenderConfig): Promise<string> => {
    const { template, runVars = {}, ssr } = params

    const parts = await ssr.render({ runVars })

    let { htmlBody, headTags, bodyTags } = parts
    const { htmlAttrs, bodyAttrs, bodyTagsOpen } = parts

    const mode = runVars.RUN_MODE || 'prod'
    const pathname = runVars.PATHNAME || '/'

    if (!template)
      throw new Error('html template required')

    headTags = await this.settings.fictionEnv.runHooks('headTags', headTags, { pathname })
    htmlBody = await this.settings.fictionEnv.runHooks('htmlBody', htmlBody, { pathname })

    const debuggingInfo = `<!--${JSON.stringify({ renderedPathname: pathname, mode })}-->`

    const bodyCloseTags = `${bodyTags}\n${debuggingInfo}`

    const headHtml = [headTags, `<meta name="generator" content="Fiction ${version}" />`].join(`\n`)

    const html = template
      .replace(`<!--head-->`, `\n${headHtml}\n`)
      .replace(`<!--app-->`, `\n${htmlBody}\n`)
      .replace(/<body([^>]*)>/i, `<body$1 ${bodyAttrs}>`)
      .replace(/<html([^>]*)>/i, `<html$1 ${htmlAttrs}>`)
      .replace(/<body([^>]*)>/i, `<body$1>\n${bodyTagsOpen}\n`)
      .replace(/<\/body>/i, `\n${bodyCloseTags}\n</body>`)

    return minify(html, { continueOnParseError: true, collapseWhitespace: mode === 'prod' })
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
      data: { isNode: isNode(), indexFiles: Object.values(templates).length },
    })

    try {
      const viteConfigServer = await this.getViteConfig({ mode: 'prod' })
      const viteConfigClient = await this.getViteConfig({ mode: 'prod' })

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
      const clientBuildOptions: vite.InlineConfig = deepMergeAll([
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

      const serverBuildOptions: vite.InlineConfig = deepMergeAll([
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

      this.log.info(`[start:build] starting builds (${this.fictionApp.appInstanceId})`)

      await Promise.all([
        vite.build(clientBuildOptions),
        vite.build(serverBuildOptions),
      ])

      this.log.info(`[done:build] build completed successfully (${this.fictionApp.appInstanceId})`)

      if (render)
        await this.preRender({ serve })

      this.log.info(`[done:build] done building (${this.fictionApp.appInstanceId})`)
    }
    catch (error) {
      this.log.error('[error] failed to build application', { error })
      throw error
    }
  }

  getSSR = async (mode: 'prod' | 'dev' | 'test'): Promise<SSR> => {
    const ssr = new SSR({
      appUrl: this.fictionApp.appUrl.value,
      distFolderServerMountFile: this.distFolderServerMountFile,
      viteServer: mode !== 'prod' ? await this.getViteServer({ mode }) : undefined,
      mountFilePath: this.mountFilePath,
      mainFilePath: this.settings.fictionEnv.mainFilePath,
    })
    return ssr
  }

  preRenderPages = async (): Promise<void> => {
    const distFolderClient = this.distFolderClient
    const distFolderStatic = this.distFolderStatic
    const mode = 'prod'
    const ssr = await this.getSSR(mode)

    const template = await this.indexHtml.getRenderedIndexHtml()

    const urls = (await this.fictionApp.fictionSitemap?.getSitemapPaths({ runVars: {
      HOSTNAME: this.fictionEnv?.meta.app?.url || '',
    } })) || []

    fs.ensureDirSync(distFolderStatic)
    fs.emptyDirSync(distFolderStatic)
    fs.copySync(distFolderClient, distFolderStatic)

    if (!this.settings.fictionEnv.isProd?.value) {
      this.log.warn(
        'pre-rendering in development mode (should be prod in most cases)',
      )
    }

    this.log.info('pre-render URLS', { data: { urls, instanceId: this.fictionApp.settings.appInstanceId } })

    /**
     * @important pre-render in series
     * if pre-rendering isn't in series than parallel builds can interfere with one-another
     */
    const _asyncFunctions = urls.map((pathname: string) => {
      return async (): Promise<string> => {
        const filePath = `${pathname === '/' ? '/index' : pathname}.html`
        this.log.info(`pre-rendering path [${filePath}]`)

        const runVars: Partial<RunVars> = {
          ...this.settings.fictionEnv.getRenderedEnvVars(),
          PATHNAME: pathname,
          RUN_MODE: 'prod',
        }

        const html = await this.serverRenderHtml({ template, runVars, ssr })

        const writePath = path.join(this.distFolderStatic, filePath)
        fs.ensureDirSync(path.dirname(writePath))
        fs.writeFileSync(writePath, html)

        this.log.info(`done rendering path [${filePath}]`)
        return filePath
      }
    })
    // run in series
    for (const fn of _asyncFunctions)
      await fn()

    this.log.info(`[done:render]`)
  }

  getRunVars = (args: { request: Request, mode: 'dev' | 'prod' | 'test' }): Partial<RunVars> & Record<string, string> => {
    const { request, mode } = args
    const runVars = {
      ...this.settings.fictionEnv.getRenderedEnvVars(),
      RUN_MODE: mode,
      APP_INSTANCE: this.fictionApp.appInstanceId,
      ...getRequestVars({ request }),
    }

    return runVars
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
      const runVars = this.getRunVars({ request, mode: 'prod' })
      return this.addRunVarsToHtml({ html: html.toString(), runVars })
    }
    catch { }
  }

  getAndWatchStaticFolders(): string[] {
    const patterns = Array.from(this.fictionEnv.staticPaths)
    const folders = patterns.flatMap(pattern => glob.sync(pattern))

    const onChange = () => this.fictionEnv.events.emit('restartServers', { reason: 'staticFile' })
    const throttledOnChange = debounce(onChange, 500)

    if (!this.fictionEnv.isTest.value && !this.fictionEnv.isProd.value) {
      const watcher = chokidar.watch(folders, { ignoreInitial: true })
      watcher.on('add', throttledOnChange)
      watcher.on('unlink', throttledOnChange)

      this.fictionEnv.events.on('shutdown', () => watcher.close())
    }

    return folders
  }

  createExpressApp = async (config: {
    mode: 'dev' | 'prod' | 'test'
    expressApp?: Express
  }): Promise<Express | undefined> => {
    if (this.isApp.value)
      return

    const { mode } = config

    const expressApp = config.expressApp || express()

    // allow additional forwarded info
    // https://stackoverflow.com/questions/23413401/what-does-trust-proxy-actually-do-in-express-js-and-do-i-need-to-use-it
    expressApp.set('trust proxy', true)

    try {
      let viteServer: vite.ViteDevServer | undefined

      let template: string
      if (mode === 'prod') {
        expressApp.use(compression())
        expressApp.use(serveStatic(this.distFolderClient, { index: false }))
        template = await this.indexHtml.getRenderedIndexHtml()
      }
      else {
        viteServer = await this.getViteServer({ mode })
        expressApp.use(viteServer.middlewares)
        template = await this.indexHtml.getDevIndexHtml({ viteServer, pathname: '/' })
      }
      const staticFolders = this.getAndWatchStaticFolders()
      staticFolders.forEach(folder => expressApp.use('/__static', serveStatic(folder, { index: false })))

      await this.fictionEnv?.runHooks('expressApp', { expressApp, mode })

      const ssr = await this.getSSR(mode)

      // server side rendering
      expressApp.use('*', async (req, res) => {
        const pathname = req.originalUrl

        try {
          const runVars = this.getRunVars({ request: req, mode })

          if (pathname === '/sitemap.xml') {
            const sitemap = await this.fictionApp.fictionSitemap?.generateSitemap({ runVars })
            res.status(200).set({ 'Content-Type': 'text/xml' }).end(sitemap)
            return
          }
          else if (pathname === '/sitemap.xsl') {
            const xslFile = await this.fictionApp.fictionSitemap?.getXslContent()
            res.status(200).set({ 'Content-Type': 'text/xml' }).end(xslFile)
            return
          }

          // This is the page catch all loader,
          // If a file request falls through to this its 404
          // make sure false triggers don't occur
          const rawPath = pathname.split('?')[0]
          if (rawPath.includes('.') && rawPath.split('.').pop() !== 'html') {
            res.status(404).end()
            return
          }

          const html = await this.serverRenderHtml({ template, runVars, ssr })

          const outputHtml = this.addRunVarsToHtml({ html, runVars })

          res.status(200).set({ 'Content-Type': 'text/html' }).end(outputHtml)
        }
        catch (error: unknown) {
          const e = error as Error

          if (viteServer)
            viteServer.ssrFixStacktrace(e)

          this.log.error('ssr error', { error })
          res.status(500).end(e.stack)
        }
      })
      return expressApp
    }
    catch (error) {
      const e = error as Error
      this.log.error(`express creation error: ${e.message}`, { error: e })

      return expressApp
    }
  }

  serveStaticApp = async (): Promise<http.Server | undefined> => {
    if (this.isApp.value)
      return

    const distFolderStatic = this.distFolderStatic

    const app = createExpressApp({
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

    this.log.info('[render:start] page render starting')

    await this.preRenderPages()

    this.log.info('[render:done] page render complete')

    if (serve) {
      this.log.info('serving...')
      await this.serveStaticApp()
    }
  }
}
