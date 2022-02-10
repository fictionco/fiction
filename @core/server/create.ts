import { UserConfigServer } from "@factor/types"

import bodyParser from "body-parser"
import { EndpointServer } from "@factor/engine"
import http from "http"

export const getAppPort = (
  config: UserConfigServer = {},
): string | undefined => {
  const port =
    config.portApp || process.env.PORT_APP || process.env.FACTOR_SERVER_PORT_APP

  return port
}
export const getServerPort = (
  config: UserConfigServer = {},
): string | undefined => {
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
  config: UserConfigServer,
): Promise<http.Server> => {
  const { endpoints = [] } = config

  // Set this global to enable URL calc
  process.env.FACTOR_SERVER_PORT = port

  const factorEndpointServer = new EndpointServer({
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
