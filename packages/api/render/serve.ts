import http from "http"
import compression from "compression"
import express, { Express } from "express"
import serveFavicon from "serve-favicon"
import serveStatic from "serve-static"
import * as vite from "vite"
import type { CliOptions } from "../cli/utils"
import { RenderMode, RenderOptions } from "../types"
import { logger, onEvent } from ".."
import { getFaviconPath, resolveDist } from "../engine/nodeUtils"
import { getRequestHtml, htmlGenerators } from "./render"
import { getViteServer } from "./vite"

export const expressApp = async (
  options: Partial<RenderOptions> = {},
): Promise<Express> => {
  const app = express()
  try {
    const { mode = "production", renderMode = RenderMode.SSR } = options

    const faviconFile = getFaviconPath()
    if (faviconFile) {
      app.use(serveFavicon(faviconFile))
    }

    let viteServer: vite.ViteDevServer | undefined = undefined

    const { manifest, template } = await htmlGenerators(mode)

    if (mode != "production") {
      viteServer = await getViteServer(options)
      app.use(viteServer.middlewares)
    } else {
      app.use(compression())
      app.use(serveStatic(resolveDist("./client"), { index: false }))
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
        const html = await getRequestHtml({
          template,
          mode,
          renderMode,
          url,
          manifest,
        })

        res.status(200).set({ "Content-Type": "text/html" }).end(html)
      } catch (error: unknown) {
        const e = error as Error
        viteServer && viteServer.ssrFixStacktrace(e)

        logger.log({
          level: "error",
          context: "server",
          description: "ssr error",
          data: error,
        })
        res.status(500).end(e.stack)
      }
    })
    return app
  } catch (error) {
    logger.log({
      level: "error",
      context: "server",
      description: "issue creating factor express app",
      data: error,
    })
    return app
  }
}
/**
 * Serves a built app from [cwd]/dist
 */
export const serveApp = async (options: CliOptions = {}): Promise<void> => {
  const { NODE_ENV } = options

  // use PORT if in production mode since app can run in a dedicated service
  const port =
    NODE_ENV == "production" && process.env.PORT
      ? process.env.PORT
      : process.env.FACTOR_APP_PORT || "3000"

  const appName = process.env.FACTOR_APP_NAME || "app"

  const mode = NODE_ENV

  const app = await expressApp({ mode })

  let server: http.Server

  await new Promise<void>((resolve) => {
    server = app.listen(port, () => resolve())
  })

  logger.log({
    level: "info",
    context: "serveApp",
    description: `serving factor app [ready]`,
    data: {
      name: appName,
      port: `[${port}]`,
      url: `http://localhost:${port}`,
    },
  })

  onEvent("shutdown", () => server.close())
}
