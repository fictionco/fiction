// import path from "path"
// import { createRequire } from "module"
// import { renderToString } from "@vue/server-renderer"
// import fs from "fs-extra"
// import { minify } from "html-minifier"
// import {
//   distFolder,
//   distServerEntry,
//   resolveDist,
//   sourceFolder,
// } from "../engine/nodeUtils"
// import { currentUrl } from "../engine/url"
// import { EntryModuleExports } from "../config/types"
// import { renderMeta } from "../meta"
// import { version } from "../package.json"
// import { RenderMode } from "./types"
// import { renderPreloadLinks } from "./preload"
// import { getViteServer, RenderConfig } from "./serve"

// const require = createRequire(import.meta.url)
// export type HtmlGenerateParts = HtmlBuildingBlocks & {
//   url: string
// }

// export interface HtmlBuildingBlocks {
//   template: string
//   mode: "production" | "development"
//   renderMode?: RenderMode
//   manifest: Record<string, any>
// }

// interface RenderedHtmlParts {
//   appHtml: string
//   preloadLinks: string
//   headTags: string
//   htmlAttrs: string
//   bodyAttrs: string
// }

// export const getIndexHtml = async (params: RenderConfig): Promise<string> => {
//   const { viteConfig, url } = params
//   const mode = viteConfig?.mode || "production"
//   const srcHtml = path.join(sourceFolder(), "index.html")

//   if (!fs.existsSync(srcHtml)) {
//     throw new Error(`no index.html in app (${srcHtml})`)
//   }

//   const rawTemplate = fs.readFileSync(srcHtml, "utf8")

//   const clientTemplatePath =
//     mode == "production"
//       ? `@entry/mount.ts`
//       : `/@fs${require.resolve("@factor/api/entry/mount.ts")}`

//   let template = rawTemplate.replace(
//     "</body>",
//     `<script type="module" src="${clientTemplatePath}"></script>
//     </body>`,
//   )

//   if (mode !== "production" && url) {
//     const srv = await getViteServer(params)
//     template = await srv.transformIndexHtml(url, template)
//   }

//   if (mode == "production") {
//     fs.ensureDirSync(distFolder())
//     fs.writeFileSync(path.join(distFolder(), "index.html"), template)
//   }

//   return template
// }

// /**
//  * Gets file content needed to render HTML
//  * @notes
//  *  - in production takes from pre-generated client
//  *  - in development, looks in SRC folder for index.html
//  */
// export const htmlGenerators = async (
//   params: RenderConfig,
// ): Promise<RenderConfig> => {
//   const { viteConfig } = params
//   const mode = viteConfig?.mode || "production"
//   const out: RenderConfig = { ...params, template: "", manifest: {} }

//   if (mode == "production") {
//     fs.ensureDirSync(path.join(distFolder(), "client"))
//     out.template = fs.readFileSync(resolveDist("./client/index.html"), "utf8")
//     out.manifest = require(resolveDist("./client/ssr-manifest.json")) as Record<
//       string,
//       any
//     >
//   } else {
//     out.template = await getIndexHtml(params)
//   }

//   return out
// }

// export const renderParts = async (
//   params: RenderConfig,
// ): Promise<RenderedHtmlParts> => {
//   const mode = params.viteConfig?.mode || "production"
//   const { url, manifest } = params
//   const prod = mode == "production" ? true : false

//   const out = {
//     appHtml: "",
//     preloadLinks: "",
//     headTags: "",
//     htmlAttrs: "",
//     bodyAttrs: "",
//   }

//   let entryModule: Record<string, any>

//   if (prod) {
//     /**
//      * Use pre-build server module in Production
//      * otherwise use Vite's special module loader
//      *
//      */
//     if (prod) {
//       entryModule = (await import(path.join(distServerEntry()))) as Record<
//         string,
//         any
//       >
//     } else {
//       const srv = await getViteServer(params)
//       entryModule = await srv.ssrLoadModule("@factor/api/entry/mount.ts")
//     }

//     const { runApp } = entryModule as EntryModuleExports

//     const factorAppEntry = await runApp({
//       renderUrl: url,
//       isSSR: true,
//     })

//     const { app, meta } = factorAppEntry

//     /**
//      * Pass context for rendering (available useSSRContext())
//      * vitejs/plugin-vue injects code in component setup() that registers the component
//      * on the context. Allowing us to orchestrate based on this.
//      */

//     const ctx: { modules?: string[] } = {}
//     out.appHtml = await renderToString(app, ctx)

//     /**
//      * SSR manifest maps assets which allows us to render preload links for performance
//      */
//     if (manifest) {
//       out.preloadLinks = renderPreloadLinks(ctx?.modules ?? [], manifest)
//     }
//     /**
//      * Meta/Head Rendering
//      */
//     const { headTags, htmlAttrs, bodyAttrs } = renderMeta(meta)
//     out.headTags = headTags
//     out.htmlAttrs = htmlAttrs
//     out.bodyAttrs = bodyAttrs
//   }

//   return out
// }

// export const canonicalTag = (pathname?: string): string => {
//   if (!pathname) return ""

//   const parts = [currentUrl(), pathname]
//     .map((_) => _.replace(/\/$/, ""))
//     .join("")

//   return `<link href="${parts}" rel="canonical">`
// }

// export const getRequestHtml = async (params: RenderConfig): Promise<string> => {
//   const mode = params.viteConfig?.mode || "production"
//   const { url, manifest, renderMode, template } = params

//   const { appHtml, preloadLinks, headTags, htmlAttrs, bodyAttrs } =
//     await renderParts({ ...params, url, manifest, renderMode })

//   // In development, get the index.html each request
//   if (mode != "production") {
//     // template = await getIndexHtml(mode, url)
//   }

//   if (!template) throw new Error("html template required")

//   const html = template
//     .replace(`<!--app-debug-->`, `<!-- ${JSON.stringify({ url }, null, 1)} -->`)
//     .replace(
//       `<!--app-head-->`,
//       [
//         headTags,
//         preloadLinks,
//         canonicalTag(url),
//         `<meta name="generator" content="FactorJS ${version}" />`,
//       ].join(`\n`),
//     )
//     .replace(`<!--app-body-->`, appHtml)
//     .replace(/<body([^>]*)>/i, `<body$1 ${bodyAttrs}>`)
//     .replace(/<html([^>]*)>/i, `<html$1 ${htmlAttrs}>`)

//   return minify(html, { continueOnParseError: true })
// }
