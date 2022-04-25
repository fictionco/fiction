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
import { Component } from "vue"
import type { RunConfig } from "../cli/utils"
import { UserConfig } from "../config/types"
import { HookType } from "../utils/hook"
import { FactorPlugin } from "../config"
import { renderMeta } from "../utils/meta"
import { version } from "../package.json"
import { FactorBuild } from "../plugin-build"
import { importIfExists } from "../engine/nodeUtils"
import { FactorServer } from "../plugin-server"
import * as types from "./types"
import { renderPreloadLinks, getFaviconPath } from "./utils"

import { FactorSitemap } from "./sitemap"
export type HookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorAppSettings = {
  hooks?: HookType<HookDictionary>[]
  mode?: "production" | "development"
  appName: string
  appUrl?: string
  portApp: number
  factorServer: FactorServer
  rootComponent: Component
}

export class FactorApp extends FactorPlugin<FactorAppSettings> {
  types = types
  viteDevServer?: vite.ViteDevServer
  public hooks: HookType<HookDictionary>[]
  rootComponent: Component
  factorBuild?: FactorBuild
  factorSitemap?: FactorSitemap
  factorServer: FactorServer
  appName: string
  appUrl: string
  portApp: number
  mode: "production" | "development"
  constructor(settings: FactorAppSettings) {
    super(settings)
    this.mode = settings.mode ?? "production"
    this.hooks = settings.hooks ?? []
    this.appName = settings.appName
    this.portApp = settings.portApp ?? 3000
    this.appUrl =
      settings.appUrl && this.mode == "production"
        ? settings.appUrl
        : `http://localhost:${this.portApp}`

    if (!this.utils.isApp()) {
      this.factorBuild = new FactorBuild()
      this.factorSitemap = new FactorSitemap()
    }
    this.rootComponent = settings.rootComponent
    this.factorServer = settings.factorServer
  }

  async setup(): Promise<UserConfig> {
    return {
      hooks: [
        {
          hook: "run",
          callback: async (runConfig: RunConfig) => {
            const { command } = runConfig

            if (command == "rdev") {
              await this.serveApp(runConfig)
            } else if (command == "build") {
              await this.buildApp(runConfig)
            } else if (command == "prerender") {
              await this.buildApp({ ...runConfig, prerender: true })
            }
          },
        },
      ],
      serverOnlyImports: [
        { id: "compression" },
        { id: "serve-favicon" },
        { id: "html-minifier" },
        { id: "serve-static" },
        { id: "fs-extra" },
        { id: "stream" },
        { id: "vite" },
        { id: "@vue/server-renderer" },
      ],
    }
  }

  getViteServer = async (
    params: types.RenderConfig,
  ): Promise<vite.ViteDevServer> => {
    if (!this.viteDevServer) {
      params = this.utils.deepMergeAll([
        params,
        { userConfig: { vite: { server: { middlewareMode: "ssr" } } } },
      ])
      const config = await this.factorBuild?.getViteConfig(params)

      this.viteDevServer = await vite.createServer(config)
    }

    return this.viteDevServer
  }

  getIndexHtml = async (params: RunConfig): Promise<string> => {
    const { mode = "production", pathname, dist, sourceDir } = params

    if (!dist) throw new Error("dist is required")
    if (!sourceDir) throw new Error("sourceDir is required")

    const srcHtml = path.join(sourceDir, "index.html")

    if (!fs.existsSync(srcHtml)) {
      throw new Error(`no index.html in app (${srcHtml})`)
    }

    const rawTemplate = fs.readFileSync(srcHtml, "utf8")

    // alias is need for vite/rollup to handle correctly
    const clientTemplatePath =
      mode == "production"
        ? `@MOUNT_FILE_ALIAS`
        : `/@fs${require.resolve("./mount.ts")}`

    let template = rawTemplate.replace(
      "</body>",
      `<script type="module" src="${clientTemplatePath}"></script>
    </body>`,
    )

    if (mode !== "production" && pathname) {
      const srv = await this.getViteServer(params)
      template = await srv.transformIndexHtml(pathname, template)
    }

    if (mode == "production") {
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
  htmlGenerators = async (params: RunConfig): Promise<types.RenderConfig> => {
    const { distClient } = params

    if (!distClient) throw new Error("dist is required")

    const mode = params.mode || "production"
    const out: types.RenderConfig = { ...params, template: "", manifest: {} }

    if (mode == "production") {
      fs.ensureDirSync(distClient)
      out.template = fs.readFileSync(
        path.resolve(distClient, "./index.html"),
        "utf8",
      )
      out.manifest = require(path.resolve(
        distClient,
        "./ssr-manifest.json",
      )) as Record<string, any>
    } else {
      out.template = await this.getIndexHtml(params)
    }

    return out
  }

  renderParts = async (
    params: types.RenderConfig,
  ): Promise<types.RenderedHtmlParts> => {
    const mode = params.mode || "production"
    const { pathname, manifest, distServerEntry } = params
    const prod = mode == "production" ? true : false

    if (!distServerEntry) throw new Error("distServerEntry is required")

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
        entryModule = (await import(path.join(distServerEntry))) as Record<
          string,
          any
        >
      } else {
        const srv = await this.getViteServer(params)
        entryModule = await srv.ssrLoadModule("./mount.ts")
      }

      const { runApp } = entryModule as types.EntryModuleExports

      const factorAppEntry = await runApp({
        renderUrl: pathname,
      })

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
    const mode = params.mode || "production"
    const { pathname, manifest, template, userConfig } = params

    const { appHtml, preloadLinks, headTags, htmlAttrs, bodyAttrs } =
      await this.renderParts({ ...params, pathname, manifest })

    // In development, get the index.html each request
    if (mode != "production") {
      // template = await getIndexHtml(mode, url)
    }

    if (!template) throw new Error("html template required")

    const canonicalUrl = [userConfig?.appUrl || "", pathname || ""]
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

  expressApp = async (runConfig: RunConfig): Promise<Express> => {
    const { distClient, sourceDir, mode } = runConfig

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

      const { manifest, template } = await this.htmlGenerators(runConfig)

      if (mode != "production") {
        viteServer = await this.getViteServer(runConfig)
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
            ...runConfig,
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

  serveApp = async (options: RunConfig): Promise<void> => {
    const app = await this.expressApp(options)

    let server: http.Server

    await new Promise<void>((resolve) => {
      server = app.listen(this.portApp, () => resolve())
    })

    const name = this.appName || "Unnamed App"
    const port = `[ ${this.portApp} ]`
    const url = this.appUrl

    this.log.info(`serving factor app [ready]`, {
      data: { name, port, url },
    })

    this.utils.onEvent("shutdown", () => server.close())
  }

  getStaticPathAliases = (runConfig: RunConfig): Record<string, string> => {
    return {
      "~/": `${runConfig.sourceDir}/`,
      "@MAIN_FILE_ALIAS": runConfig.mainFilePath,
      "@ROOT_COMPONENT_ALIAS": runConfig.rootComponentPath,
      "@MOUNT_FILE_ALIAS": runConfig.mountFilePath,
    }
  }

  tailwindConfig = async (
    options: RunConfig,
  ): Promise<Record<string, any> | undefined> => {
    const { cwd } = options

    if (!cwd) throw new Error("cwd is required")

    const baseTailwindConfig = await import("../plugin-build/tailwind.config")

    const c: Record<string, any>[] = [baseTailwindConfig.default]

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

  getAppViteConfig = async (
    options: RunConfig,
  ): Promise<vite.InlineConfig | undefined> => {
    const { cwd } = options

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

  async getViteConfig(runConfig: RunConfig): Promise<vite.InlineConfig> {
    const {
      userConfig = {},
      sourceDir,
      publicDir,
      mainFilePath,
      rootComponentPath,
    } = runConfig

    if (!sourceDir) throw new Error("sourceDir is required")
    if (!publicDir) throw new Error("publicDir is required")

    const { variables } = userConfig
    const vars = {
      ...variables,
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

    const twConfig = await this.tailwindConfig(runConfig)

    const twPlugin = require("tailwindcss") as (
      c?: Record<string, any>,
    ) => vite.PluginOption

    const pluginMarkdown = await import("vite-plugin-markdown")
    const { getMarkdownUtility } = await import("../utils/markdown")

    const merge: vite.InlineConfig[] = [
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
          alias: { ...this.getStaticPathAliases(runConfig) },
        },
        define,
        plugins: [
          pluginMarkdown.plugin({
            mode: [pluginMarkdown.Mode.VUE, pluginMarkdown.Mode.HTML],
            markdownIt: getMarkdownUtility(),
          }),
        ],
      },
    ]

    // If the app has a vite config, merge it
    const appViteConfig = await this.getAppViteConfig(runConfig)

    if (appViteConfig) {
      merge.push(appViteConfig ?? {})
    }

    const vite = this.utils.deepMergeAll(merge)

    const fullConfig = this.utils.deepMergeAll([
      runConfig,
      { userConfig: { vite } },
    ])

    const vc = await this.factorBuild?.getViteConfig(fullConfig)

    if (!vc) throw new Error("no vite config")

    return vc
  }

  buildApp = async (runConfig: RunConfig): Promise<void> => {
    const { prerender, dist, distClient, distServer } = runConfig

    this.log.info("building application", {
      data: { ...runConfig, isNode: this.utils.isNode() },
    })

    try {
      const vc = await this.getViteConfig(runConfig)

      // build index to dist
      await this.getIndexHtml(runConfig)

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

      await this.factorSitemap?.generateSitemap(runConfig)

      if (prerender) {
        await this.preRender(runConfig)
      }
    } catch (error) {
      this.log.error("[error] failed to build application", { error })
    }

    return
  }

  preRenderPages = async (runConfig: RunConfig): Promise<void> => {
    const { distStatic, distClient } = runConfig

    if (!distStatic || !distClient) {
      throw new Error("distStatic and distClient required for prerender")
    }

    const generators = await this.htmlGenerators(runConfig)

    const urls = (await this.factorSitemap?.getSitemapPaths(runConfig)) || []

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

  serveStaticApp = async (runConfig: RunConfig): Promise<void> => {
    const { distStatic } = runConfig

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

  preRender = async (runConfig: RunConfig): Promise<void> => {
    this.log.info("prerender starting")
    const { serve } = runConfig
    await this.preRenderPages(runConfig)

    this.log.info("prerender complete")

    if (serve) {
      this.log.info("serving...")
      await this.serveStaticApp(runConfig)
    }
  }
}
