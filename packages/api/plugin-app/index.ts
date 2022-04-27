import http from "http"
import path from "path"
import * as mod from "module"
import compression from "compression"
import serveFavicon from "serve-favicon"
import serveStatic from "serve-static"
import fs from "fs-extra"
import { minify } from "html-minifier"
import { Express } from "express"
import vite from "vite"
import { renderToString } from "@vue/server-renderer"
import { Component, App as VueApp } from "vue"
import type { CliOptions, StandardPaths } from "../plugin-env/types"
import { UserConfig } from "../plugin-env"
import { HookType } from "../utils/hook"
import { FactorPlugin } from "../plugin"
import { getMeta, renderMeta } from "../utils/meta"
import { version } from "../package.json"
import { FactorBuild } from "../plugin-build"
import { importIfExists } from "../engine/nodeUtils"
import { FactorServer } from "../plugin-server"
import { initializeResetUi } from "../utils/ui"
import { AppRoute, getRouter, setupRouter } from "../utils"
import { ServerModuleDef } from "../plugin-build/types"
import { FactorEnv } from "../plugin-env"
import * as types from "./types"
import { renderPreloadLinks, getFaviconPath } from "./utils"
import { FactorSitemap } from "./sitemap"
import type { JSONSchema } from "json-schema-to-typescript"

type HookDictionary = {
  afterAppSetup: { args: [{ userConfig: UserConfig }] }
}

export type FactorAppSettings = {
  hooks?: HookType<HookDictionary>[]
  mode?: "production" | "development"
  appName: string
  appUrl?: string
  portApp: number
  factorServer: FactorServer
  factorEnv: FactorEnv<string>
  rootComponent: Component
  routes?: AppRoute<string>[]
  sitemaps?: types.SitemapConfig[]
  uiPaths?: string[]
  serverOnlyImports?: ServerModuleDef[]
}

export class FactorApp extends FactorPlugin<FactorAppSettings> {
  types = types
  viteDevServer?: vite.ViteDevServer
  hooks: HookType<HookDictionary>[]
  routes: AppRoute<string>[]
  uiPaths: string[]
  serverOnlyImports: ServerModuleDef[]
  rootComponent: Component
  factorBuild?: FactorBuild
  factorSitemap?: FactorSitemap
  factorServer: FactorServer
  factorEnv?: FactorEnv<string>
  appName: string
  appUrl: string
  portApp: number
  mode: "production" | "development"
  sitemaps: types.SitemapConfig[]
  standardPaths: StandardPaths
  constructor(settings: FactorAppSettings) {
    super(settings)
    this.mode = settings.mode ?? "production"
    this.hooks = settings.hooks ?? []
    this.routes = settings.routes ?? []
    this.sitemaps = settings.sitemaps ?? []
    this.uiPaths = settings.uiPaths ?? []
    this.serverOnlyImports = settings.serverOnlyImports ?? []
    this.appName = settings.appName
    this.portApp = settings.portApp ?? 3000
    this.appUrl =
      settings.appUrl && this.mode == "production"
        ? settings.appUrl
        : `http://localhost:${this.portApp}`

    this.rootComponent = settings.rootComponent
    this.factorServer = settings.factorServer
    this.factorEnv = settings.factorEnv
    this.standardPaths = this.factorEnv.standardPaths

    if (!this.utils.isApp()) {
      this.factorBuild = new FactorBuild({
        factorEnv: this.factorEnv,
        mode: this.mode,
      })
      this.factorSitemap = new FactorSitemap()
    }

    this.addToCli()
  }

  addToCli() {
    if (this.factorEnv) {
      this.factorEnv.addHook({
        hook: "runCommand",
        callback: async (command: string, opts: CliOptions) => {
          const { serve, prerender } = opts
          if (command == "dev") {
            await this.serveApp()
          } else if (command == "build") {
            await this.buildApp({ serve, prerender })
          } else if (command == "prerender") {
            await this.buildApp({ serve, prerender })
          }
        },
      })

      this.factorEnv.addHook({
        hook: "staticSchema",
        callback: async (existing) => {
          const keys = this.routes
            ?.map((_) => _.name)
            .filter(Boolean)
            .sort() ?? [""]

          return {
            ...existing,
            routes: { enum: keys, type: "string" },
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
            routes: this.routes?.sort(),
          }
        },
      })
    }
  }

  setup(): UserConfig {
    return {
      name: this.constructor.name,
    }
  }

  addRoutes(routes: AppRoute<string>[]) {
    this.routes = [...this.routes, ...routes]
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

  createVueApp = async (params: {
    renderUrl?: string
    userConfig: UserConfig
  }): Promise<types.FactorAppEntry> => {
    const { renderUrl, userConfig } = params

    setupRouter(this.routes)

    await this.utils.runHooks<HookDictionary, "afterAppSetup">({
      list: this.hooks,
      hook: "afterAppSetup",
      args: [{ userConfig }],
    })

    const app: VueApp = renderUrl
      ? this.vue.createSSRApp(this.rootComponent)
      : this.vue.createApp(this.rootComponent)

    // add router and store
    const router = getRouter()

    app.use(router)

    if (renderUrl) {
      await router.replace({ path: renderUrl })
    }

    await router.isReady()

    const meta = getMeta()
    app.use(meta)

    return { app, meta, router }
  }

  mountApp = async (params: {
    id?: string
    renderUrl?: string
    userConfig: UserConfig
  }): Promise<types.FactorAppEntry> => {
    const { id = "#app" } = params

    const entry = await this.createVueApp(params)

    if (!this.utils.isNode()) {
      initializeResetUi().catch(console.error)

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
      this.mode == "production" ? `@MOUNT_FILE_ALIAS` : `/@fs${mountFilePath}`

    let template = rawTemplate.replace(
      "</body>",
      `<script type="module" src="${clientTemplatePath}"></script>
    </body>`,
    )

    if (this.mode !== "production" && pathname) {
      const srv = await this.getViteServer()
      template = await srv.transformIndexHtml(pathname, template)
    }

    if (this.mode == "production") {
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

    if (this.mode == "production") {
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
    const prod = this.mode == "production" ? true : false

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
    if (this.mode != "production") {
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

      if (this.mode != "production") {
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

  serveApp = async (): Promise<void> => {
    const app = await this.expressApp()

    let server: http.Server

    await new Promise<void>((resolve) => {
      server = app.listen(this.portApp, () => resolve())
    })

    const name = this.appName || "Unnamed App"
    const port = `[ ${this.portApp} ]`
    const url = this.appUrl
    const mode = this.mode

    this.log.info(`serving factor app [ready]`, {
      data: { name, port, url, mode },
    })

    this.utils.onEvent("shutdown", () => server.close())
  }

  getStaticPathAliases = (): Record<string, string> => {
    const { mainFilePath, mountFilePath } = this.standardPaths || {}

    return {
      "@MAIN_FILE_ALIAS": mainFilePath,
      "@MOUNT_FILE_ALIAS": mountFilePath,
    }
  }

  tailwindConfig = async (): Promise<Record<string, any> | undefined> => {
    const cwd = this.standardPaths.cwd

    if (!cwd) throw new Error("cwd is required")

    const fullUiPaths = this.uiPaths.map((p) => p.replace("~", cwd))
    const c: Record<string, any>[] = [
      {
        mode: "jit",
        content: fullUiPaths,
      },
    ]

    const { requireIfExists } = await import("../engine/nodeUtils")

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
    const cwd = this.standardPaths.cwd

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
    const { sourceDir, publicDir, mainFilePath, rootComponentPath } =
      this.standardPaths || {}

    if (!sourceDir) throw new Error("sourceDir is required")
    if (!publicDir) throw new Error("publicDir is required")

    const vars = {
      IS_VITE: "true",
      FACTOR_SERVER_URL: this.factorServer.serverUrl,
      FACTOR_APP_URL: this.appUrl,
      MAIN_FILE: mainFilePath,
      ROOT_COMPONENT: rootComponentPath,
    }

    const define = Object.fromEntries(
      Object.entries(vars).map(([key, value]) => {
        return [`process.env.${key}`, JSON.stringify(value)]
      }),
    )

    this.log.info(`build variables (${Object.keys(vars).length} total)`, {
      data: vars,
      disableOnRestart: true,
    })

    const twConfig = await this.tailwindConfig()

    const require = mod.Module.createRequire(import.meta.url)

    const twPlugin = require("tailwindcss") as (
      c?: Record<string, any>,
    ) => vite.PluginOption

    const pluginMarkdown = await import("vite-plugin-markdown")
    const { getMarkdownUtility } = await import("../utils/markdown")

    const commonVite = await this.factorBuild?.getCommonViteConfig()

    const appViteConfigFile = await this.getAppViteConfigFile()

    const merge: vite.InlineConfig[] = [
      commonVite || {},
      {
        css: {
          postcss: {
            plugins: [twPlugin(twConfig), require("autoprefixer")],
          },
        },
        server: {
          port: this.portApp,
        },
        resolve: {
          alias: this.getStaticPathAliases(),
        },
        define,
        plugins: [
          pluginMarkdown.plugin({
            mode: [pluginMarkdown.Mode.VUE, pluginMarkdown.Mode.HTML],
            markdownIt: getMarkdownUtility(),
          }),
        ],
      },
      appViteConfigFile || {},
    ]

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
            input: require.resolve("./mount.ts"),
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
        routes: this.routes,
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
        routes: this.routes,
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

    const server = app.listen(this.portApp, () => {
      this.log.info(`serving static app [ready]`, {
        data: { port: this.portApp },
      })
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
