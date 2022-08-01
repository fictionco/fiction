import http from "http"
import path from "path"
import compression from "compression"
import serveFavicon from "serve-favicon"
import serveStatic from "serve-static"
import fs from "fs-extra"
import { minify } from "html-minifier"
import { Express } from "express"
import * as vite from "vite"
import unocss from "unocss/vite"
import presetIcons from "@unocss/preset-icons"
import { renderToString } from "@vue/server-renderer"
import type tailwindcss from "tailwindcss"
import {
  vue,
  importIfExists,
  initializeResetUi,
  getMeta,
  renderMeta,
  HookType,
  requireIfExists,
  getRequire,
  safeDirname,
} from "../utils"
import {
  ServiceConfig,
  FactorAppEntry,
  FactorEnv,
  StandardPaths,
} from "../plugin-env"
import { FactorPlugin } from "../plugin"
import { FactorBuild } from "../plugin-build"
import { FactorServer } from "../plugin-server"
import { FactorRouter } from "../plugin-router"
import { version } from "../package.json"
import { ServerModuleDef } from "../plugin-build/types"
import { FactorDevRestart } from "../plugin-env/restart"
import { getMarkdownPlugin } from "./utils/vitePluginMarkdown"
import * as types from "./types"
import { renderPreloadLinks, getFaviconPath } from "./utils"
import { FactorSitemap } from "./sitemap"

type HookDictionary = {
  appMounted: { args: [FactorAppEntry] }
  afterAppSetup: { args: [{ serviceConfig: ServiceConfig }] }
  viteConfig: { args: [vite.InlineConfig[]] }
  htmlHead: { args: [string, { pathname?: string }] }
  htmlBody: { args: [string, { pathname?: string }] }
}

export type FactorAppSettings = {
  hooks?: HookType<HookDictionary>[]
  mode?: "production" | "development"
  isTest?: boolean
  liveUrl?: string
  isLive?: vue.Ref<boolean>
  port: number
  factorServer?: FactorServer
  factorEnv: FactorEnv
  rootComponent: vue.Component
  factorRouter: FactorRouter
  sitemaps?: types.SitemapConfig[]
  uiPaths?: string[]
  serverOnlyImports?: ServerModuleDef[]
  ui?: Record<string, () => Promise<vue.Component>>
}

export class FactorApp extends FactorPlugin<FactorAppSettings> {
  types = types
  viteDevServer?: vite.ViteDevServer
  hooks = this.settings.hooks ?? []
  uiPaths = this.settings.uiPaths ?? []
  serverOnlyImports = this.settings.serverOnlyImports ?? []
  factorRouter = this.settings.factorRouter
  ui = this.settings.ui || {}
  isTest = this.settings.isTest || this.utils.isTest()
  rootComponent = this.settings.rootComponent
  factorBuild?: FactorBuild
  factorDevRestart?: FactorDevRestart
  factorSitemap?: FactorSitemap
  factorServer = this.settings.factorServer
  factorEnv = this.settings.factorEnv
  appName: string
  appEmail: string
  sitemaps = this.settings.sitemaps ?? []
  standardPaths?: StandardPaths = this.factorEnv.standardPaths
  port = this.settings.port || 3000
  appServer?: http.Server
  staticServer?: http.Server
  localUrl = `http://localhost:${this.port}`
  liveUrl = this.settings.liveUrl || this.localUrl
  appUrl = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive?.value ?? false
    return isLive ? this.liveUrl : this.localUrl
  })

  constructor(settings: FactorAppSettings) {
    super("app", settings)

    const cwd = this.factorEnv.standardPaths?.cwd

    this.appEmail = this.factorEnv.appEmail
    this.appName = this.factorEnv.appName
    /**
     * node application init
     */
    if (cwd && !this.utils.isApp() && this.factorEnv) {
      this.factorBuild = new FactorBuild({ factorEnv: this.factorEnv })
      this.factorSitemap = new FactorSitemap({
        factorRouter: this.factorRouter,
      })
    }

    this.addSchema()
  }

  async setup() {
    return {}
  }

  addSchema() {
    if (this.factorEnv) {
      this.factorEnv.addHook({
        hook: "staticSchema",
        callback: async (existing) => {
          const routeKeys = this.factorRouter.routes.value
            ?.map((_) => _.name)
            .filter(Boolean)
            .sort()

          const uiKeys = Object.keys(this.ui).sort()

          return {
            ...existing,
            routes: { enum: routeKeys, type: "string" },
            ui: { enum: uiKeys, type: "string" },
            menus: { enum: [""], type: "string" },
          }
        },
      })

      this.factorEnv.addHook({
        hook: "staticConfig",
        callback: (
          schema: Record<string, unknown>,
        ): Record<string, unknown> => {
          return {
            ...schema,
            routes: this.factorRouter.routes.value?.map((ep) => ({
              key: ep.name,
              path: ep.path,
            })),
          }
        },
      })
    }
  }

  public addHook(hook: HookType<HookDictionary>): void {
    this.hooks.push(hook)
  }

  addUi(components: Record<string, () => Promise<vue.Component>>) {
    this.ui = { ...this.ui, ...components }
  }

  addSitemaps(sitemaps: types.SitemapConfig[]) {
    this.sitemaps = [...this.sitemaps, ...sitemaps]
  }

  addUiPaths(uiPaths: string[]) {
    this.uiPaths = [...this.uiPaths, ...uiPaths]
  }

  addServerOnlyImports(serverOnlyImports: ServerModuleDef[]) {
    this.serverOnlyImports = [...this.serverOnlyImports, ...serverOnlyImports]
  }

  createUi = (ui: Record<string, () => Promise<vue.Component>>) => {
    return Object.fromEntries(
      Object.entries(ui).map(([key, component]) => {
        return [key, vue.defineAsyncComponent(component)]
      }),
    )
  }

  createVueApp = async (params: {
    renderUrl?: string
    serviceConfig: ServiceConfig
  }): Promise<FactorAppEntry> => {
    const { renderUrl, serviceConfig } = params

    const router = this.factorRouter.update()

    await this.utils.runHooks<HookDictionary, "afterAppSetup">({
      list: this.hooks,
      hook: "afterAppSetup",
      args: [{ serviceConfig }],
    })

    const { service = {} } = serviceConfig

    const app: vue.App = renderUrl
      ? vue.createSSRApp(this.rootComponent)
      : vue.createApp(this.rootComponent)

    app.provide("service", service)
    app.provide("ui", this.createUi(this.ui))
    app.use(router)

    if (renderUrl) {
      await this.factorRouter.replace(
        { path: renderUrl },
        { id: "createVueApp" },
      )
    }
    await router.isReady()

    const meta = getMeta()
    app.use(meta)
    return { app, meta, service }
  }

  mountApp = async (params: {
    selector?: string
    renderUrl?: string
    serviceConfig: ServiceConfig
  }): Promise<FactorAppEntry> => {
    const { selector = "#app" } = params

    const entry = await this.createVueApp(params)
    await this.factorEnv.crossRunCommand()
    if (typeof window != "undefined") {
      initializeResetUi(this.factorRouter).catch(console.error)
      entry.app.mount(selector)
      document.querySelector(selector)?.classList.add("loaded")
      document.querySelector(".styles-loading")?.remove()

      await this.utils.runHooks<HookDictionary, "appMounted">({
        list: this.hooks,
        hook: "appMounted",
        args: [entry],
      })
    }

    return entry
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
          appType: "custom",
          server: { middlewareMode: true },
        },
      ])

      this.viteDevServer = await vite.createServer(serverConfig)
    }

    return this.viteDevServer
  }

  getIndexHtml = async (params: {
    pathname?: string
    isProd: boolean
  }): Promise<string> => {
    const { pathname = "/", isProd } = params
    const { dist, sourceDir } = this.standardPaths || {}

    if (!dist) throw new Error("dist is required")
    if (!sourceDir) throw new Error("sourceDir is required")

    const srcHtml = path.join(sourceDir, "index.html")

    if (!fs.existsSync(srcHtml)) {
      throw new Error(`no index.html in app (${srcHtml})`)
    }

    const rawTemplate = fs.readFileSync(srcHtml, "utf8")

    // alias is need for vite/rollup to handle correctly
    const clientTemplatePath = isProd ? `@MOUNT_FILE_ALIAS` : "/@mount.ts" //`/@fs${mountFilePath}`

    let template = rawTemplate.replace(
      "</body>",
      `<script type="module" src="${clientTemplatePath}"></script>
    </body>`,
    )

    if (!isProd && pathname) {
      const srv = await this.getViteServer({ isProd })
      template = await srv.transformIndexHtml(pathname, template)
    }

    if (isProd) {
      fs.ensureDirSync(dist)
      fs.writeFileSync(path.join(dist, "index.html"), template)
    }

    return template
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

    if (!distClient) throw new Error("dist is required")

    const out: types.RenderConfig = { template: "", manifest: {}, isProd }

    if (isProd) {
      fs.ensureDirSync(distClient)
      const indexHtmlPath = path.resolve(distClient, "./index.html")
      out.template = fs.readFileSync(indexHtmlPath, "utf8")
      const manifestPath = path.resolve(distClient, "./ssr-manifest.json")
      out.manifest = (await import(/* @vite-ignore */ manifestPath)) as Record<
        string,
        any
      >
    } else {
      out.template = await this.getIndexHtml({ pathname: "/", isProd })
    }

    return out
  }

  renderParts = async (
    params: types.RenderConfig,
  ): Promise<types.RenderedHtmlParts> => {
    const { pathname, manifest, isProd } = params
    const { distServerEntry } = this.standardPaths || {}

    if (!distServerEntry) throw new Error("distServerEntry is missing")

    const out = {
      htmlBody: "",
      preloadLinks: "",
      htmlHead: "",
      htmlAttrs: "",
      bodyAttrs: "",
    }

    let entryModule: Record<string, any>

    process.env.IS_VITE = "yes"

    if (isProd) {
      /**
       * Use pre-build server module in Production
       * otherwise use Vite's special module loader
       *
       */
      if (isProd) {
        entryModule = (await import(
          /* @vite-ignore */ path.join(distServerEntry)
        )) as Record<string, any>
      } else {
        const srv = await this.getViteServer({ isProd })
        entryModule = await srv.ssrLoadModule("./mount.ts")
      }

      const { runViteApp } = entryModule as types.EntryModuleExports

      const factorAppEntry = await runViteApp({ renderUrl: pathname })

      const { app, meta } = factorAppEntry

      /**
       * Pass context for rendering (available useSSRContext())
       * vitejs/plugin-vue injects code in component setup() that registers the component
       * on the context. Allowing us to orchestrate based on this.
       */
      try {
        const ctx: { modules?: string[] } = {}
        out.htmlBody = await renderToString(app, ctx)

        /**
         * SSR manifest maps assets which allows us to render preload links for performance
         */
        if (manifest) {
          out.preloadLinks = renderPreloadLinks(ctx?.modules ?? [], manifest)
        }
      } catch (error) {
        this.log.error(`renderToString error ${pathname}`, { error })
      }

      /**
       * Meta/Head Rendering
       */
      const { headTags: htmlHead, htmlAttrs, bodyAttrs } = renderMeta(meta)
      out.htmlHead = htmlHead
      out.htmlAttrs = htmlAttrs
      out.bodyAttrs = bodyAttrs
    }

    delete process.env.IS_VITE

    return out
  }

  getRequestHtml = async (params: types.RenderConfig): Promise<string> => {
    const { pathname, manifest, template, isProd } = params

    const parts = await this.renderParts({
      template,
      pathname,
      manifest,
      isProd,
    })
    let { htmlBody, htmlHead } = parts
    const { preloadLinks, htmlAttrs, bodyAttrs } = parts

    if (!template) throw new Error("html template required")

    htmlHead = await this.utils.runHooks({
      list: this.hooks,
      hook: "htmlHead",
      args: [htmlHead, { pathname }],
    })

    htmlBody = await this.utils.runHooks({
      list: this.hooks,
      hook: "htmlBody",
      args: [htmlBody, { pathname }],
    })

    const canonicalUrl = [this.appUrl.value || "", pathname || ""]
      .map((_: string) => _.replace(/\/$/, ""))
      .join("")

    const html = template
      .replace(
        `<!--factor-debug-->`,
        `<!-- ${JSON.stringify({ pathname }, null, 1)} -->`,
      )
      .replace(
        `<!--factor-head-->`,
        [
          htmlHead,
          preloadLinks,
          `<link href="${canonicalUrl}" rel="canonical">`,
          `<meta name="generator" content="FactorJS ${version}" />`,
        ].join(`\n`),
      )
      .replace(`<!--factor-body-->`, htmlBody)
      .replace(/<body([^>]*)>/i, `<body$1 ${bodyAttrs}>`)
      .replace(/<html([^>]*)>/i, `<html$1 ${htmlAttrs}>`)

    return minify(html, { continueOnParseError: true })
  }

  expressApp = async (config: {
    isProd: boolean
  }): Promise<Express | undefined> => {
    if (this.utils.isApp()) return

    const { isProd } = config

    const { distClient, sourceDir, mountFilePath } = this.standardPaths || {}

    if (!distClient || !sourceDir) {
      throw new Error("distClient && sourceDir are required")
    }

    const app = this.utils.express()

    try {
      const faviconFile = getFaviconPath(sourceDir)
      if (faviconFile) {
        app.use(serveFavicon(faviconFile))
      }

      let viteServer: vite.ViteDevServer | undefined = undefined

      const { manifest, template } = await this.htmlGenerators({
        isProd,
        distClient,
      })

      if (!isProd) {
        viteServer = await this.getViteServer({ isProd })
        app.use(viteServer.middlewares)
      } else {
        app.use(compression())
        app.use(serveStatic(distClient, { index: false }))
      }

      const srv = await this.getViteServer({ isProd })
      const rawSource = await srv.transformRequest(
        path.join(safeDirname(import.meta.url), "./mount.ts"),
      )

      if (mountFilePath) {
        app.use("/@mount.ts", async (req, res) => {
          res
            .setHeader("Content-Type", "application/javascript")
            .send(rawSource?.code)
            .end()
        })
      }

      // server side rendering
      app.use("*", async (req, res) => {
        const pathname = req.originalUrl

        // This is the page catch all loader,
        // If a file request falls through to this its 404
        // make sure false triggers don't occur
        const rawPath = pathname.split("?")[0]
        if (rawPath.includes(".") && rawPath.split(".").pop() != "html") {
          res.status(404).end()
          return
        }

        try {
          const html = await this.getRequestHtml({
            template,
            pathname,
            manifest,
            isProd,
          })

          res.status(200).set({ "Content-Type": "text/html" }).end(html)
        } catch (error: unknown) {
          const e = error as Error
          viteServer && viteServer.ssrFixStacktrace(e)

          this.log.error("ssr error", { error })
          res.status(500).end(e.stack)
        }
      })
      return app
    } catch (error) {
      this.log.error("issue creating factor express app", { error })

      return app
    }
  }

  logReady(args: { serveMode: string }): void {
    const { serveMode } = args
    const name = this.appName || "Unnamed App"
    const port = `[ ${this.port} ]`

    this.log.info(`serving app [ready]`, {
      data: {
        name,
        port,
        liveUrl: this.liveUrl,
        localUrl: this.localUrl,
        serveMode,
        isLive: this.settings.isLive?.value ?? false,
      },
    })
  }

  serveDevApp = async (): Promise<void> => {
    if (this.utils.isApp()) return

    const app = await this.expressApp({ isProd: false })

    await new Promise<void>((resolve) => {
      this.appServer = app?.listen(this.port, () => resolve())
    })

    this.logReady({ serveMode: "dev" })
  }

  close(): void {
    this.log.info("close app")
    this.appServer?.close()
    this.staticServer?.close()
  }

  tailwindConfig = async (): Promise<Record<string, any> | undefined> => {
    const cwd = this.standardPaths?.cwd

    if (!cwd) throw new Error("cwd is required")

    const fullUiPaths = this.uiPaths.map((p) => path.normalize(p))

    const c: Record<string, any>[] = [
      {
        mode: "jit",
        content: fullUiPaths,
      },
    ]

    const userTailwindConfig = await requireIfExists(
      path.join(cwd, "tailwind.config.cjs"),
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

  getAppViteConfigFile = async (): Promise<vite.InlineConfig | undefined> => {
    const cwd = this.standardPaths?.cwd

    if (!cwd) throw new Error("cwd is required")
    const _module = await importIfExists<{
      default: vite.InlineConfig | (() => Promise<vite.InlineConfig>)
    }>(path.join(cwd, "vite.config.ts"))

    let config: vite.InlineConfig | undefined = undefined
    const result = _module?.default

    if (result) {
      if (typeof result == "function") {
        config = await result()
      } else {
        config = result
      }
    }

    return config
  }

  async getViteConfig(config: { isProd: boolean }): Promise<vite.InlineConfig> {
    const { isProd } = config
    const { cwd, sourceDir, publicDir, mainFile } = this.standardPaths || {}

    if (!cwd) throw new Error("cwd is required")
    if (!sourceDir) throw new Error("sourceDir is required")
    if (!publicDir) throw new Error("publicDir is required")

    const { default: pluginVue } = await import("@vitejs/plugin-vue")

    const commonVite = await this.factorBuild?.getCommonViteConfig({
      isProd,
      root: cwd,
      mainFile,
    })

    const appViteConfigFile = await this.getAppViteConfigFile()

    const twPlugin = getRequire()("tailwindcss") as typeof tailwindcss
    const twConfig = (await this.tailwindConfig()) as Parameters<
      typeof twPlugin
    >[0]

    let merge: vite.InlineConfig[] = [
      commonVite || {},
      {
        publicDir,
        css: {
          postcss: {
            plugins: [twPlugin(twConfig), getRequire()("autoprefixer")],
          },
        },
        server: {},
        plugins: [
          pluginVue(),
          getMarkdownPlugin(),
          unocss({ presets: [presetIcons()] }),
        ],
      },
      appViteConfigFile || {},
    ]

    merge = await this.utils.runHooks({
      list: this.hooks,
      hook: "viteConfig",
      args: [merge],
    })

    const viteConfig = this.utils.deepMergeAll(merge)

    return viteConfig
  }

  buildApp = async (options: {
    render?: boolean
    serve?: boolean
  }): Promise<void> => {
    if (this.utils.isApp()) return

    const { render = true, serve = false } = options
    const { dist, distClient, distServer } = this.factorEnv?.standardPaths || {}

    if (!dist || !distClient || !distServer) {
      throw new Error("dist paths are missing")
    }

    if (!this.appUrl) throw new Error("appUrl is required")

    this.log.info("building application", {
      data: { isNode: this.utils.isNode() },
    })

    try {
      const vc = await this.getViteConfig({ isProd: true })

      // build index to dist
      await this.getIndexHtml({ isProd: true })

      const clientBuildOptions: vite.InlineConfig = {
        ...vc,
        root: dist,
        build: {
          outDir: distClient,
          emptyOutDir: true,
          ssrManifest: true,
        },
      }

      const serverBuildOptions: vite.InlineConfig = {
        ...vc,
        build: {
          emptyOutDir: true,
          outDir: distServer,
          ssr: true,
          rollupOptions: {
            preserveEntrySignatures: "allow-extension", // not required
            input: path.join(safeDirname(import.meta.url), "./mount.ts"),
            output: { format: "es" },
          },
        },
      }

      await Promise.all([
        vite.build(clientBuildOptions),
        vite.build(serverBuildOptions),
      ])

      this.log.info("[done:build] application built successfully")

      await this.factorSitemap?.generateSitemap({
        appUrl: this.appUrl.value,
        sitemaps: this.sitemaps,
        distClient,
      })

      if (render) {
        await this.preRender({ serve })
      }
    } catch (error) {
      this.log.error("[error] failed to build application", { error })
    }

    return
  }

  preRenderPages = async (): Promise<void> => {
    const { distStatic, distClient } = this.standardPaths || {}

    if (!distStatic || !distClient) {
      throw new Error("distStatic and distClient required for prerender")
    }

    const generators = await this.htmlGenerators({ isProd: true, distClient })

    const urls =
      (await this.factorSitemap?.getSitemapPaths({
        sitemaps: this.sitemaps,
      })) || []

    fs.ensureDirSync(distStatic)
    fs.emptyDirSync(distStatic)
    fs.copySync(distClient, distStatic)

    /**
     * @important pre-render in series
     * if pre-rendering isn't in series than parallel builds can interfere with one-another
     */
    const _asyncFunctions = urls.map((pathname: string) => {
      return async (): Promise<string> => {
        const filePath = `${pathname === "/" ? "/index" : pathname}.html`
        this.log.info(`pre-rendering [${filePath}]`)

        const html = await this.getRequestHtml({ ...generators, pathname })

        const writePath = path.join(distStatic, filePath)
        fs.ensureDirSync(path.dirname(writePath))
        fs.writeFileSync(writePath, html)

        this.log.info(`done [${filePath}]`)
        return filePath
      }
    })
    // run in series
    for (const fn of _asyncFunctions) {
      await fn()
    }
    this.log.info(`[done:render]`)
    return
  }

  async getHtmlFile(filePath: string): Promise<string | undefined> {
    try {
      const html = await fs.readFile(filePath)
      const stringifiedVars = JSON.stringify(
        this.factorEnv.getViteRenderedVars(),
      )
      const tag = `<script id="factorRun" type="application/json">${stringifiedVars}</script>`
      const out = html.toString().replace(/<\/body>/i, `${tag}\n</body>`)
      return out
    } catch {
      return
    }
  }

  serveStaticApp = async (): Promise<void> => {
    if (this.utils.isApp()) return

    const { distStatic } = this.standardPaths || {}

    if (!distStatic) throw new Error("distStatic required for serveStaticApp")

    const app = this.utils.createExpressApp({
      // in dev these cause images/scripts to fail locally
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    })

    const fallbackIndex = await this.getHtmlFile(
      path.join(distStatic, "index.html"),
    )

    app.use(async (req, res, next) => {
      let pathname = req.originalUrl.split("?")[0]

      if (!pathname.includes(".") || pathname.includes(".html")) {
        pathname =
          pathname.charAt(pathname.length - 1) == "/"
            ? `${pathname}index.html`
            : pathname

        const rel = pathname.includes(".html") ? pathname : `${pathname}.html`
        const filePath = path.join(distStatic, rel)
        const fileHtml = await this.getHtmlFile(filePath)
        const html = fileHtml || fallbackIndex

        res.setHeader("content-type", "text/html").send(html).end()
      } else {
        next()
      }
    })
    app.use(serveStatic(distStatic, { index: false }))

    app.use("*", (req, res) => {
      this.log.error(`404 Request ${req.url}`, {
        data: {
          url: req.url,
          originalUrl: req.originalUrl,
          method: req.method,
          accept: req.headers["accept"],
        },
      })
      res.status(404).end()
    })

    this.staticServer = app.listen(this.port, () => {
      this.logReady({ serveMode: "static" })
    })
  }

  preRender = async (opts?: { serve: boolean }): Promise<void> => {
    const { serve = false } = opts || {}

    this.log.info("page render starting")

    await this.preRenderPages()

    this.log.info("page render complete")

    if (serve) {
      this.log.info("serving...")
      await this.serveStaticApp()
    }
  }
}
