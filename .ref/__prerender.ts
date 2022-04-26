import path from "path"
import compression from "compression"
import express from "express"
import fs from "fs-extra"
import serveStatic from "serve-static"
import { onEvent } from "../utils/event"
import { log } from "../logger"

import { RunConfig } from "../cli/utils"
//import { getRequestHtml, htmlGenerators } from "./__serveve"
import { getSitemapPaths } from "./sitemap"

export const preRenderPages = async (params: RunConfig): Promise<void> => {
  const { distStatic, distClient } = params

  if (!distStatic || !distClient) {
    throw new Error("distStatic and distClient required for prerender")
  }

  const generators = await htmlGenerators(params)

  const urls = await getSitemapPaths()

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
      log.info("preRenderPages", `pre-rendering: ${filePath}`)

      const html = await getRequestHtml({ ...generators, pathname })

      const writePath = path.join(distStatic, filePath)
      fs.ensureDirSync(path.dirname(writePath))
      fs.writeFileSync(writePath, html)

      log.info("preRenderPages", `pre-rendered: ${filePath}`)
      return filePath
    }
  })
  // run in series
  for (const fn of _asyncFunctions) {
    await fn()
  }

  return
}

export const serveStaticApp = async (options: RunConfig): Promise<void> => {
  const { distStatic } = options

  if (!distStatic) throw new Error("distStatic required for serveStaticApp")

  const app = express()

  app.use(compression())
  app.use((req, res, next) => {
    if (!req.path.includes(".")) {
      req.url = `${req.url.replace(/\/$/, "")}.html`
    }

    log.log({
      level: "info",
      context: "server",
      description: `request at ${req.url}`,
    })
    next()
  })
  app.use(serveStatic(distStatic, { extensions: ["html"] }))

  app.use("*", (req, res) => {
    log.info("serveStaticApp", `serving fallback index.html at ${req.baseUrl}`)
    res.sendFile(path.join(distStatic, "/index.html"))
  })
  const port = process.env.PORT || process.env.FACTOR_APP_PORT || 3000

  const server = app.listen(port, () => {
    log.log({
      level: "info",
      context: "server",
      description: `serving static app [ready]`,
      data: { port },
    })
  })

  onEvent("shutdown", () => server.close())
}

export const preRender = async (options: RunConfig): Promise<void> => {
  log.log({
    level: "info",
    context: "prerender",
    description: "prerender starting",
  })
  const { serve } = options
  await preRenderPages(options)

  log.log({
    level: "info",
    context: "prerender",
    description: "prerender complete",
  })

  if (serve) {
    log.log({
      level: "info",
      context: "prerender:serve",
      description: "serving...",
    })
    await serveStaticApp(options)
  }
}
