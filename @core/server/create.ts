import { UserConfigServer } from "@factor/types"

import bodyParser from "body-parser"
import { EndpointServer } from "@factor/engine"
import http from "http"

export const createEndpointServer = async (
  config: UserConfigServer,
): Promise<http.Server> => {
  const { endpoints = [], endpointPort } = config

  const port =
    String(endpointPort) ||
    process.env.PORT ||
    process.env.FACTOR_SERVER_PORT ||
    "3210"

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
