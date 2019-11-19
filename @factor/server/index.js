import { addCallback, runCallbacks, applyFilters, setting } from "@factor/tools"
import { getPath } from "@factor/tools/paths"
import destroyer from "destroyer"
import express from "express"
import fs from "fs-extra"
import log from "@factor/tools/logger"
import LRU from "lru-cache"
import { createBundleRenderer } from "vue-server-renderer"

import "./server-dev"
import { handleServerError, getPort, getServerInfo, logServerReady } from "./util"
import { loadMiddleware } from "./middleware"

let _listening
let renderer
let _application
addCallback("create-server", _ => createServer(_))
addCallback("close-server", () => closeServer())

export function createServer({ port }) {
  process.env.PORT = getPort(port)

  if (process.env.NODE_ENV == "development") {
    startServerDevelopment()
  } else {
    startServerProduction()
  }

  return
}

export function createMiddlewareServer({ port }) {
  createExpressApplication({ port })

  // Set Express routine for all fallthrough paths
  _application.get("*", (request, response) => renderRequest(request, response))

  _listening = _application.listen(process.env.PORT)

  prepareListener()
}

function createExpressApplication({ port = null } = {}) {
  process.env.PORT = getPort(port)

  _application = express()

  loadMiddleware(_application)
}

export async function startServerProduction() {
  createExpressApplication()

  const { template, bundle, clientManifest } = productionFiles()

  renderer = createRenderer(bundle, { template, clientManifest })

  // Set Express routine for all fallthrough paths
  _application.get("*", (request, response) => renderRequest(request, response))

  _listening = _application.listen(process.env.PORT, () =>
    log.success(`:: listening on port :: ${process.env.PORT}`)
  )
}

// In production we have static files to work with
// In development these are pulled from memory (MFS)
function productionFiles() {
  return {
    template: fs.readFileSync(setting("app.templatePath"), "utf-8"),
    bundle: require(getPath("server-bundle")),
    clientManifest: require(getPath("client-manifest"))
  }
}

export function startServerDevelopment() {
  runCallbacks("development-server", ({ bundle, template, clientManifest }) => {
    renderer = createRenderer(bundle, { template, clientManifest })

    if (!_listening) startDevelopmentListener()
  })
}

function createRenderer(bundle, options) {
  // Allow for changing default options when rendering
  // particularly important for testing
  options = applyFilters("server-renderer-options", options)
  return createBundleRenderer(bundle, {
    cache: new LRU({ max: 1000, maxAge: 1000 * 60 * 15 }),
    runInNewContext: false,
    directives: applyFilters("server-directives", {}),
    ...options
  })
}

export async function renderRequest(request, response) {
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
export async function renderRoute(url = "") {
  return await renderer.renderToString({ url })
}

function startDevelopmentListener() {
  createExpressApplication()

  // Set Express routine for all fallthrough paths
  _application.get("*", (request, response) => renderRequest(request, response))

  _listening = _application.listen(process.env.PORT, () => logServerReady())

  prepareListener()
  addCallback("restart-server", async () => {
    log.server("restarting server", { color: "yellow" })
    _listening.destroy()
    await runCallbacks("rebuild-server-app")
    startDevelopmentListener()
  })
}

function prepareListener() {
  _listening.destroy = destroyer(_listening)
}

export async function closeServer() {
  if (_listening) _listening.destroy()
}
