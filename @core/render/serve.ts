import { getFaviconPath, nLog, resolveDist } from "@factor/server"
import { RenderMode, RenderOptions } from "@factor/types"
import compression from "compression"
import express, { Express } from "express"
import serveFavicon from "serve-favicon"
import serveStatic from "serve-static"
import * as vite from "vite"

import { getRequestHtml, htmlGenerators } from "./render"
import { getViteServer } from "./vite"

export const expressApp = async (
  options: Partial<RenderOptions> = {},
): Promise<Express> => {
  const app = express()
  try {
    const { mode = "production", renderMode = RenderMode.SSR } = options

    app.use(serveFavicon(getFaviconPath()))

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

      // if file is 404 then just send 404 response
      if (url.includes(".") && url.split(".").pop() != "html") {
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
      } catch (error: any) {
        viteServer && viteServer.ssrFixStacktrace(error)
        nLog("error", "ssr error", error)
        res.status(500).end(error.stack)
      }
    })
    return app
  } catch (error) {
    nLog("error", "issue creating factor express app", error)
    return app
  }
}
/**
 * Serves a built app from [cwd]/dist
 */
export const serveApp = async (
  options: Partial<RenderOptions> = {},
): Promise<void> => {
  const app = await expressApp(options)

  app.listen(process.env.PORT || 3000, () =>
    nLog("info", `app@http://localhost:3000`),
  )
}
