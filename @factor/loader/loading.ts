import { resolve } from "path"
import express from "express"
import serveStatic from "serve-static"
import fs from "fs-extra"
import { json } from "node-res"
import { localhostUrl } from "@factor/api/url"
import { BuildTypes } from "@factor/cli/types"
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
  app.use("/sse", (req: express.Request, res: express.Response) =>
    sse.subscribe(req, res)
  )

  // Serve state with JSON
  app.use("/json", (req: express.Request, res: express.Response) =>
    json(req, res, loaderState)
  )

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

  loaderState.allDone = progress == 100 ? true : false

  broadcastState()
}
