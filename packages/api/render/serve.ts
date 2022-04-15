import http from "http"
import path from "path"
import { createRequire } from "module"
import compression from "compression"
import express, { Express } from "express"
import serveFavicon from "serve-favicon"
import serveStatic from "serve-static"
import * as vite from "vite"
import { renderToString } from "@vue/server-renderer"
import fs from "fs-extra"
import { minify } from "html-minifier"
import type { RunConfig } from "../cli/utils"
import { logger, onEvent } from ".."
import { getFaviconPath } from "../engine/nodeUtils"
import { deepMergeAll } from "../utils"
import { currentUrl } from "../engine/url"
import { EntryModuleExports } from "../config/types"
import { renderMeta } from "../meta"
import { version } from "../package.json"
import { getViteConfig } from "./vite.config"
import { RenderMode } from "./types"
import { renderPreloadLinks } from "./preload"

export type RenderConfig = {
  url?: string
  manifest?: Record<string, any>
  renderMode?: RenderMode
  template?: string
} & RunConfig

const require = createRequire(import.meta.url)
export type HtmlGenerateParts = HtmlBuildingBlocks & {
  url: string
}

export interface HtmlBuildingBlocks {
  template: string
  mode: "production" | "development"
  renderMode?: RenderMode
  manifest: Record<string, any>
}

interface RenderedHtmlParts {
  appHtml: string
  preloadLinks: string
  headTags: string
  htmlAttrs: string
  bodyAttrs: string
}

let __viteDevServer: vite.ViteDevServer
export const getViteServer = async (
  params: RenderConfig,
): Promise<vite.ViteDevServer> => {
  if (!__viteDevServer) {
    params = deepMergeAll([
      params,
      { viteConfig: { server: { middlewareMode: "ssr" } } },
    ])
    const config = await getViteConfig(params)

    __viteDevServer = await vite.createServer(config)
  }

  return __viteDevServer
}

export const getIndexHtml = async (params: RunConfig): Promise<string> => {
  const { mode = "production", url, dist, sourceDir } = params

  if (!dist) throw new Error("dist is required")
  if (!sourceDir) throw new Error("sourceDir is required")

  const srcHtml = path.join(sourceDir, "index.html")

  if (!fs.existsSync(srcHtml)) {
    throw new Error(`no index.html in app (${srcHtml})`)
  }

  const rawTemplate = fs.readFileSync(srcHtml, "utf8")

  const clientTemplatePath =
    mode == "production"
      ? `@entry/mount.ts`
      : `/@fs${require.resolve("@factor/api/entry/mount.ts")}`

  let template = rawTemplate.replace(
    "</body>",
    `<script type="module" src="${clientTemplatePath}"></script>
    </body>`,
  )

  if (mode !== "production" && url) {
    const srv = await getViteServer(params)
    template = await srv.transformIndexHtml(url, template)
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
export const htmlGenerators = async (
  params: RunConfig,
): Promise<RenderConfig> => {
  const { dist } = params

  if (!dist) throw new Error("dist is required")

  const mode = params.mode || "production"
  const out: RenderConfig = { ...params, template: "", manifest: {} }

  if (mode == "production") {
    fs.ensureDirSync(path.join(dist, "client"))
    out.template = fs.readFileSync(
      path.resolve(dist, "./client/index.html"),
      "utf8",
    )
    out.manifest = require(path.resolve(
      dist,
      "./client/ssr-manifest.json",
    )) as Record<string, any>
  } else {
    out.template = await getIndexHtml(params)
  }

  return out
}

export const renderParts = async (
  params: RenderConfig,
): Promise<RenderedHtmlParts> => {
  const mode = params.mode || "production"
  const { url, manifest, distServerEntry } = params
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
      const srv = await getViteServer(params)
      entryModule = await srv.ssrLoadModule("@factor/api/entry/mount.ts")
    }

    const { runApp } = entryModule as EntryModuleExports

    const factorAppEntry = await runApp({
      renderUrl: url,
      isSSR: true,
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

export const canonicalTag = (pathname?: string): string => {
  if (!pathname) return ""

  const parts = [currentUrl(), pathname]
    .map((_) => _.replace(/\/$/, ""))
    .join("")

  return `<link href="${parts}" rel="canonical">`
}

export const getRequestHtml = async (params: RenderConfig): Promise<string> => {
  const mode = params.mode || "production"
  const { url, manifest, renderMode, template } = params

  const { appHtml, preloadLinks, headTags, htmlAttrs, bodyAttrs } =
    await renderParts({ ...params, url, manifest, renderMode })

  // In development, get the index.html each request
  if (mode != "production") {
    // template = await getIndexHtml(mode, url)
  }

  if (!template) throw new Error("html template required")

  const html = template
    .replace(`<!--app-debug-->`, `<!-- ${JSON.stringify({ url }, null, 1)} -->`)
    .replace(
      `<!--app-head-->`,
      [
        headTags,
        preloadLinks,
        canonicalTag(url),
        `<meta name="generator" content="FactorJS ${version}" />`,
      ].join(`\n`),
    )
    .replace(`<!--app-body-->`, appHtml)
    .replace(/<body([^>]*)>/i, `<body$1 ${bodyAttrs}>`)
    .replace(/<html([^>]*)>/i, `<html$1 ${htmlAttrs}>`)

  return minify(html, { continueOnParseError: true })
}

export const expressApp = async (params: RunConfig): Promise<Express> => {
  const { distClient, sourceDir, mode } = params

  if (!distClient || !sourceDir) {
    throw new Error("distClient && sourceDir are required")
  }

  const app = express()

  try {
    const faviconFile = getFaviconPath(sourceDir)
    if (faviconFile) {
      app.use(serveFavicon(faviconFile))
    }

    let viteServer: vite.ViteDevServer | undefined = undefined

    const { manifest, template } = await htmlGenerators(params)

    if (mode != "production") {
      viteServer = await getViteServer(params)
      app.use(viteServer.middlewares)
    } else {
      app.use(compression())
      app.use(serveStatic(distClient, { index: false }))
    }

    // server side rendering
    app.use("*", async (req, res) => {
      const url = req.originalUrl

      // This is the page catch all loader,
      // If a file request falls through to this its 404
      // make sure false triggers don't occur
      const rawPath = url.split("?")[0]
      if (rawPath.includes(".") && rawPath.split(".").pop() != "html") {
        res.status(404).end()
        return
      }

      try {
        const renderMode = RenderMode.SSR

        const html = await getRequestHtml({
          ...params,
          template,
          renderMode,
          url,
          manifest,
        })

        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (error: unknown) {
        const e = error as Error
        viteServer && viteServer.ssrFixStacktrace(e)

        logger.error("server", "ssr error", { error })
        res.status(500).end(e.stack)
      }
    })
    return app
  } catch (error) {
    logger.error("server", "issue creating factor express app", { error })

    return app
  }
}
/**
 * Serves a built app from [cwd]/dist
 */
export const serveApp = async (options: RunConfig): Promise<void> => {
  const { NODE_ENV, portApp } = options

  // use PORT if in production mode since app can run in a dedicated service
  const listenPort =
    NODE_ENV == "production" && process.env.PORT ? process.env.PORT : portApp

  const appName = process.env.FACTOR_APP_NAME || "app"

  const app = await expressApp(options)

  let server: http.Server

  await new Promise<void>((resolve) => {
    server = app.listen(listenPort, () => resolve())
  })

  logger.info("serveApp", `serving factor app [ready]`, {
    data: {
      name: appName,
      port: `[ ${listenPort} ]`,
      url: `http://localhost:${listenPort}`,
    },
  })

  onEvent("shutdown", () => server.close())
}
