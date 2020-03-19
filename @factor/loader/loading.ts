import { resolve } from "path"
import express from "express"
import serveStatic from "serve-static"
import fs from "fs-extra"
import { json } from "node-res"
import { localhostUrl } from "@factor/api/url"
import { BuildTypes } from "@factor/cli/types"
import { installedExtensions } from "@factor/cli/extension-loader"
import { parse } from "qs"
import { emitEvent } from "@factor/api/events"
import { deepMerge } from "@factor/api"
import { getSettings } from "@factor/api/settings"
import { configSettings } from "@factor/api/config"
import { parseStack } from "./utils/error"
import { SSE } from "./sse"

const distPath = resolve(__dirname, "app-dist")
const indexPath = resolve(distPath, "index.html")
const template = fs.readFileSync(indexPath, "utf-8")

let app: express.Express
let sse: SSE

interface State {
  build?: BuildTypes;
  progress?: number;
  message?: string;
  hasErrors?: boolean;
  allDone?: boolean;
  lastBroadCast?: number;
  error?: { description: string; stack: string };
  redirect?: string;
  settings?: Record<string, any>;
}

let loaderState: State = {}

export const serveIndex = (): string => {
  return template
    .replace('"STATE"', JSON.stringify(loaderState))
    .replace(/{BASE_URL}/g, localhostUrl() + "/")
}

export const initializeLoading = (): express.Express => {
  app = express()
  sse = new SSE()
  // Subscribe to SSR channel
  app.use("/sse", (request: express.Request, response: express.Response) =>
    sse.subscribe(request, response)
  )

  // Serve state with JSON
  app.use("/json", (request: express.Request, response: express.Response) =>
    json(request, response, loaderState)
  )

  app.use("/event", (request: express.Request) => {
    const { query, body } = request

    const data = { ...body, ...parse(query) }

    if (data.redirected) {
      delete loaderState.redirect
    }

    emitEvent("loaderEvent", data)
  })

  // Serve dist
  app.use("/", serveStatic(distPath))

  // Serve index.html
  app.use("/", serveIndex)

  return app
}

export const broadcastState = (): void => {
  const now = new Date().getTime()
  const last = loaderState.lastBroadCast ?? 0

  if (now - last > 500 || loaderState.allDone || loaderState.hasErrors) {
    sse.broadcast("state", loaderState)

    loaderState.lastBroadCast = now
  }
}

export const setLoadingError = (error: Error): void => {
  loaderState = {}
  loaderState.error = {
    description: error.toString(),
    stack: parseStack(error.stack ?? "").join("\n")
  }
  loaderState.hasErrors = true

  broadcastState()
}

export const clearError = (): void => {
  loaderState.error = undefined
  loaderState.hasErrors = false
}

/**
 * IMPORTANT This should never load in production mode
 * It makes private settings available at an endpoint, used for setup
 */
export const setShowInstall = (): void => {
  if (process.env.NODE_ENV == "development") {
    loaderState.redirect = "/setup"
    const config = configSettings()
    const extensions = installedExtensions(config.package, { shallow: true })

    loaderState.settings = deepMerge([config, extensions, getSettings()])
    sse.broadcast("state", loaderState)
  }
}

export const setLoadingStates = (
  build: BuildTypes,
  {
    progress,
    message
  }: {
    progress: number;
    message: string;
  }
): void => {
  clearError()
  loaderState.build = build
  loaderState.progress = progress
  loaderState.message = message

  loaderState.allDone = build == "bundle" && progress == 100 ? true : false

  broadcastState()
}
