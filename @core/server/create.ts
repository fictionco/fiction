import http from "http"
import { UserConfig } from "@factor/types"

import bodyParser from "body-parser"
import { EndpointServer } from "@factor/engine"

export const getAppPort = (config: UserConfig = {}): string | undefined => {
  const port =
    config.portApp || process.env.PORT_APP || process.env.FACTOR_APP_PORT

  return port
}
export const getServerPort = (config: UserConfig = {}): string | undefined => {
  const port = config.port || process.env.PORT || process.env.FACTOR_SERVER_PORT

  return port
}
export const serverUrl = (): string => {
  if (process.env.FACTOR_SERVER_URL) {
    return process.env.FACTOR_SERVER_URL
  } else {
    return `http://localhost:${getServerPort() || "3210"}`
  }
}

export const createEndpointServer = async (
  port: string,
  config: UserConfig,
): Promise<http.Server | undefined> => {
  const { endpoints = [] } = config

  // Set this global to enable URL calc
  process.env.FACTOR_SERVER_PORT = port

  const factorEndpointServer = new EndpointServer({
    name: "factor",
    port,
    endpoints,
    middleware: (app) => {
      app.use(
        bodyParser.json({
          verify: (req, res, buf) => {
            // only include raw body if 'hook' is in the request url
            // this has a performance hit
            if (req.url?.includes("hook")) {
              req.rawBody = buf
            }
          },
        }),
      )
      return
    },
  })

  return await factorEndpointServer.serverCreate()
}
