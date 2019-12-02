import { Server } from "http"
import { addCallback, runCallbacks, applyFilters, setting } from "@factor/tools"
import {
  createBundleRenderer,
  BundleRenderer,
  BundleRendererOptions
} from "vue-server-renderer"
import { getPath } from "@factor/tools/paths"
import destroyer from "destroyer"
import express from "express"
import fs from "fs-extra"
import log from "@factor/tools/logger"
import LRU from "lru-cache"

import { developmentServer } from "./server-dev"
import { handleServerError, getServerInfo, logServerReady } from "./util"
import { loadMiddleware } from "./middleware"
import { RendererComponents } from "./types"
let __listening: Server | undefined
let __renderer: BundleRenderer
let __application
addCallback("create-server", () => createRenderServer())
addCallback("close-server", () => closeServer())

export async function createRenderServer(options = {}): Promise<void> {
  await new Promise(resolve => {
    if (process.env.NODE_ENV == "development") {
      developmentServer(renderConfig => {
        htmlRenderer(renderConfig)

        if (!__listening) createServer(options)

        resolve()
      })
    } else {
      htmlRenderer({
        template: fs.readFileSync(setting("app.templatePath"), "utf-8"),
        bundle: require(getPath("server-bundle")),
        clientManifest: require(getPath("client-manifest"))
      })

      createServer(options)

      resolve()
    }
  })

  return
}

export function createServer(options: { port?: string }): void {
  const { port } = options || {}

  process.env.PORT = port || process.env.PORT || "3000"

  __application = express()

  loadMiddleware(__application)

  __application.get("*", (request, response) => renderRequest(request, response))

  __listening = __application.listen(process.env.PORT, () => logServerReady())

  prepareListener()

  addCallback("restart-server", async () => {
    log.server("restarting server", { color: "yellow" })
    if (__listening) {
      __listening.destroy()
    }
    await runCallbacks("rebuild-server-app")

    createServer(options)
  })
}

function htmlRenderer({ bundle, template, clientManifest }: RendererComponents): void {
  // Allow for changing default options when rendering
  // particularly important for testing
  const options: BundleRendererOptions = applyFilters("server-renderer-options", {
    cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
    runInNewContext: false,
    directives: applyFilters("server-directives", {}),
    template,
    clientManifest
  })

  __renderer = createBundleRenderer(bundle, options)
}

export async function renderRequest(
  request: express.Request,
  response: express.Response
): Promise<void> {
  response.setHeader("Content-Type", "text/html")
  response.setHeader("Server", getServerInfo())

  try {
    const html = await renderRoute(request.url)
    response.send(html)
  } catch (error) {
    handleServerError(request, response, error)
  }
}

// SSR - Renders a route (url) to HTML.
export async function renderRoute(url = ""): Promise<string> {
  if (!__renderer) return "no renderer"

  return await __renderer.renderToString({ url })
}

function prepareListener(): void {
  if (__listening) {
    __listening.destroy = destroyer(__listening)
  }
}

export async function closeServer(): Promise<void> {
  if (__listening) {
    __listening.destroy()
  }
}
