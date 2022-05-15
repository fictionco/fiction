import http from "http"
import path from "path"
import compression from "compression"
import serveFavicon from "serve-favicon"
import serveStatic from "serve-static"
import fs from "fs-extra"
import { minify } from "html-minifier"
import { Express } from "express"
import vite from "vite"
import { renderToString } from "@vue/server-renderer"
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
} from "@factor/api/utils"
import { ServiceConfig, FactorEnv } from "@factor/api/plugin-env"
import { FactorPlugin } from "@factor/api/plugin"
import type tailwindcss from "tailwindcss"
import { FactorBuild } from "@factor/api/plugin-build"
import { FactorServer } from "@factor/api/plugin-server"
import { FactorRouter } from "@factor/api/plugin-router"
import { version } from "../package.json"
import { ServerModuleDef } from "../plugin-build/types"
import { FactorDevRestart } from "../plugin-env/restart"
import * as types from "./types"
import { renderPreloadLinks, getFaviconPath } from "./utils"
import { FactorSitemap } from "./sitemap"

type HookDictionary = {
  afterAppSetup: { args: [{ serviceConfig: ServiceConfig }] }
  viteConfig: { args: [vite.InlineConfig[]] }
}

export type FactorAppSettings = {
  hooks?: HookType<HookDictionary>[]
  mode?: "production" | "development"
  appName: string
  appEmail: string
  appUrl?: string
  port: number
  factorServer: FactorServer
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

  rootComponent = this.settings.rootComponent
  factorBuild?: FactorBuild
  factorDevRestart?: FactorDevRestart
  factorSitemap?: FactorSitemap
  factorServer = this.settings.factorServer
  factorEnv = this.settings.factorEnv
  appName = this.settings.appName
  appEmail = this.settings.appEmail
  sitemaps = this.settings.sitemaps ?? []
  standardPaths = this.factorEnv.standardPaths
  port = this.settings.port || 3000
  appUrl =
    this.settings.appUrl && this.utils.mode() == "production"
      ? this.settings.appUrl
      : `http://localhost:${this.port}`
  vars: Record<string, string | boolean | number> = {
    MODE: this.utils.mode(),
    IS_TEST: this.utils.isTest(),
    IS_VITE: "true",
    FACTOR_SERVER_URL: this.factorServer.serverUrl,
    FACTOR_APP_URL: this.appUrl,
  }
  constructor(settings: FactorAppSettings) {
    super(settings)

    const cwd = this.standardPaths?.cwd
    /**
     * node application init
     */
    if (cwd && !this.utils.isApp() && this.factorEnv) {
      this.factorBuild = new FactorBuild({
        factorEnv: this.factorEnv,
      })
      this.factorSitemap = new FactorSitemap({
        factorRouter: this.factorRouter,
      })

      this.factorDevRestart = new FactorDevRestart({
        factorEnv: this.factorEnv,
        nodemonConfigPath: path.join(cwd, "./.nodemon.json"),
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

  addVars(vars: Record<string, string>) {
    this.vars = { ...this.vars, ...vars }
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
  }): Promise<types.FactorAppEntry> => {
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

    if (renderUrl) await router.replace({ path: renderUrl })

    await router.isReady()

    const meta = getMeta()
    app.use(meta)

    return { app, meta, router }
  }

  mountApp = async (params: {
    id?: string
    renderUrl?: string
    serviceConfig: ServiceConfig
  }): Promise<types.FactorAppEntry> => {
    const { id = "#app" } = params

    const entry = await this.createVueApp(params)

    if (!this.utils.isNode()) {
      initializeResetUi(this.factorRouter).catch(console.error)

      entry.app.mount(id)
      document.querySelector(id)?.classList.add("loaded")
      document.querySelector(".styles-loading")?.remove()
    }

    return entry
  }

  getViteServer = async (): Promise<vite.ViteDevServer> => {
    if (!this.viteDevServer) {
      const config = await this.getViteConfig()

      const serverConfig = this.utils.deepMergeAll([
        config,
        {
          server: { middlewareMode: "ssr" },
        },
      ])

      this.viteDevServer = await vite.createServer(serverConfig)
    }

    return this.viteDevServer
  }

  getIndexHtml = async (params?: { pathname: string }): Promise<string> => {
    const { pathname = "/" } = params || {}
    const { dist, sourceDir, mountFilePath } = this.standardPaths || {}

    if (!dist) throw new Error("dist is required")
    if (!sourceDir) throw new Error("sourceDir is required")

    const srcHtml = path.join(sourceDir, "index.html")

    if (!fs.existsSync(srcHtml)) {
      throw new Error(`no index.html in app (${srcHtml})`)
    }

    const rawTemplate = fs.readFileSync(srcHtml, "utf8")

    // alias is need for vite/rollup to handle correctly
    const clientTemplatePath =
      this.utils.mode() == "production"
        ? `@MOUNT_FILE_ALIAS`
        : `/@fs${mountFilePath}`

    let template = rawTemplate.replace(
      "</body>",
      `<script type="module" src="${clientTemplatePath}"></script>
    </body>`,
    )

    if (this.utils.mode() !== "production" && pathname) {
      const srv = await this.getViteServer()
      template = await srv.transformIndexHtml(pathname, template)
    }

    if (this.utils.mode() == "production") {
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
  htmlGenerators = async (): Promise<types.RenderConfig> => {
    const { distClient } = this.standardPaths || {}

    if (!distClient) throw new Error("dist is required")

    const out: types.RenderConfig = { template: "", manifest: {} }

    if (this.utils.mode() == "production") {
      fs.ensureDirSync(distClient)
      const indexHtmlPath = path.resolve(distClient, "./index.html")
      out.template = fs.readFileSync(indexHtmlPath, "utf8")
      const manifestPath = path.resolve(distClient, "./ssr-manifest.json")
      out.manifest = (await import(/* @vite-ignore */ manifestPath)) as Record<
        string,
        any
      >
    } else {
      out.template = await this.getIndexHtml({ pathname: "/" })
    }

    return out
  }

  renderParts = async (
    params: types.RenderConfig,
  ): Promise<types.RenderedHtmlParts> => {
    const { pathname, manifest } = params
    const { distServerEntry } = this.standardPaths || {}
    const prod = this.utils.mode() == "production" ? true : false

    if (!distServerEntry) throw new Error("distServerEntry is missing")

    const out = {
      appHtml: "",
      preloadLinks: "",
      headTags: "",
      htmlAttrs: "",
      bodyAttrs: "",
    }

    let entryModule: Record<string, any>

    if (prod) {
      /**
       * Use pre-build server module in Production
       * otherwise use Vite's special module loader
       *
       */
      if (prod) {
        entryModule = (await import(
          /* @vite-ignore */ path.join(distServerEntry)
        )) as Record<string, any>
      } else {
        const srv = await this.getViteServer()
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

      const ctx: { modules?: string[] } = {}
      out.appHtml = await renderToString(app, ctx)

      /**
       * SSR manifest maps assets which allows us to render preload links for performance
       */
      if (manifest) {
        out.preloadLinks = renderPreloadLinks(ctx?.modules ?? [], manifest)
      }
      /**
       * Meta/Head Rendering
       */
      const { headTags, htmlAttrs, bodyAttrs } = renderMeta(meta)
      out.headTags = headTags
      out.htmlAttrs = htmlAttrs
      out.bodyAttrs = bodyAttrs
    }

    return out
  }

  getRequestHtml = async (params: types.RenderConfig): Promise<string> => {
    const { pathname, manifest, template } = params

    const { appHtml, preloadLinks, headTags, htmlAttrs, bodyAttrs } =
      await this.renderParts({ template, pathname, manifest })

    // In development, get the index.html each request
    if (this.utils.mode() != "production") {
      // template = await getIndexHtml(mode, url)
    }

    if (!template) throw new Error("html template required")

    const canonicalUrl = [this.appUrl || "", pathname || ""]
      .map((_: string) => _.replace(/\/$/, ""))
      .join("")

    const html = template
      .replace(
        `<!--app-debug-->`,
        `<!-- ${JSON.stringify({ pathname }, null, 1)} -->`,
      )
      .replace(
        `<!--app-head-->`,
        [
          headTags,
          preloadLinks,
          `<link href="${canonicalUrl}" rel="canonical">`,
          `<meta name="generator" content="FactorJS ${version}" />`,
        ].join(`\n`),
      )
      .replace(`<!--app-body-->`, appHtml)
      .replace(/<body([^>]*)>/i, `<body$1 ${bodyAttrs}>`)
      .replace(/<html([^>]*)>/i, `<html$1 ${htmlAttrs}>`)

    return minify(html, { continueOnParseError: true })
  }

  expressApp = async (): Promise<Express> => {
    const { distClient, sourceDir } = this.standardPaths || {}

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

      const { manifest, template } = await this.htmlGenerators()

      if (this.utils.mode() != "production") {
        viteServer = await this.getViteServer()
        app.use(viteServer.middlewares)
      } else {
        app.use(compression())
        app.use(serveStatic(distClient, { index: false }))
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

  logReady(): void {
    const name = this.appName || "Unnamed App"
    const port = `[ ${this.port} ]`
    const url = this.appUrl
    const mode = this.utils.mode()

    this.log.info(`serving app [ready]`, {
      data: { name, port, url, mode },
    })
  }

  serveApp = async (): Promise<void> => {
    const app = await this.expressApp()

    let server: http.Server

    await new Promise<void>((resolve) => {
      server = app.listen(this.port, () => resolve())
    })

    this.logReady()

    this.utils.onEvent("shutdown", () => server.close())
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

  async getViteConfig(): Promise<vite.InlineConfig> {
    const { sourceDir, publicDir } = this.standardPaths || {}

    if (!sourceDir) throw new Error("sourceDir is required")
    if (!publicDir) throw new Error("publicDir is required")

    const define = Object.fromEntries(
      Object.entries(this.vars).map(([key, value]) => {
        return [`process.env.${key}`, JSON.stringify(value)]
      }),
    )

    this.log.info(
      `transfer variables (${Object.keys(this.vars).length} total)`,
      {
        data: this.vars,
        disableOnRestart: true,
      },
    )

    const pluginMarkdown = await import("vite-plugin-markdown")
    const { getMarkdownUtility } = await import("../utils/markdown")

    const commonVite = await this.factorBuild?.getCommonViteConfig()

    const appViteConfigFile = await this.getAppViteConfigFile()

    const twPlugin = getRequire()("tailwindcss") as typeof tailwindcss
    const twConfig = (await this.tailwindConfig()) as Parameters<
      typeof twPlugin
    >[0]

    let merge: vite.InlineConfig[] = [
      commonVite || {},
      {
        css: {
          postcss: {
            plugins: [twPlugin(twConfig), getRequire()("autoprefixer")],
          },
        },
        server: {},
        define,
        plugins: [
          pluginMarkdown.plugin({
            mode: [pluginMarkdown.Mode.VUE, pluginMarkdown.Mode.HTML],
            markdownIt: getMarkdownUtility({ html: true }),
          }),
        ],
      },
      appViteConfigFile || {},
    ]

    merge = await this.utils.runHooks({
      list: this.hooks,
      hook: "viteConfig",
      args: [merge],
    })

    const vite = this.utils.deepMergeAll(merge)

    return vite
  }

  buildApp = async (options: {
    prerender?: boolean
    serve?: boolean
  }): Promise<void> => {
    const { prerender = true, serve = false } = options
    const { dist, distClient, distServer } = this.factorEnv?.standardPaths || {}

    if (!dist || !distClient || !distServer) {
      throw new Error("dist paths are missing")
    }

    if (!this.appUrl) throw new Error("appUrl is required")

    this.log.info("building application", {
      data: { isNode: this.utils.isNode() },
    })

    try {
      const vc = await this.getViteConfig()

      // build index to dist
      await this.getIndexHtml()

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

      this.log.info("[done] application built successfully")

      await this.factorSitemap?.generateSitemap({
        appUrl: this.appUrl,
        sitemaps: this.sitemaps,
        distClient,
      })

      if (prerender) {
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

    const generators = await this.htmlGenerators()

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
        this.log.info("preRenderPages", `pre-rendering: ${filePath}`)

        const html = await this.getRequestHtml({ ...generators, pathname })

        const writePath = path.join(distStatic, filePath)
        fs.ensureDirSync(path.dirname(writePath))
        fs.writeFileSync(writePath, html)

        this.log.info("preRenderPages", `pre-rendered: ${filePath}`)
        return filePath
      }
    })
    // run in series
    for (const fn of _asyncFunctions) {
      await fn()
    }

    return
  }

  serveStaticApp = async (): Promise<void> => {
    const { distStatic } = this.standardPaths || {}

    if (!distStatic) throw new Error("distStatic required for serveStaticApp")

    const app = this.utils.express()

    app.use(compression())
    app.use((req, res, next) => {
      if (!req.path.includes(".")) {
        req.url = `${req.url.replace(/\/$/, "")}.html`
      }

      this.log.info(`request at ${req.url}`)
      next()
    })
    app.use(serveStatic(distStatic, { extensions: ["html"] }))

    app.use("*", (req, res) => {
      this.log.info(`serving fallback index.html at ${req.baseUrl}`)
      res.sendFile(path.join(distStatic, "/index.html"))
    })

    const server = app.listen(this.port, () => {
      this.logReady()
    })

    this.utils.onEvent("shutdown", () => server.close())
  }

  preRender = async (opts?: { serve: boolean }): Promise<void> => {
    const { serve = false } = opts || {}

    this.log.info("prerender starting")

    await this.preRenderPages()

    this.log.info("prerender complete")

    if (serve) {
      this.log.info("serving...")
      await this.serveStaticApp()
    }
  }
}
