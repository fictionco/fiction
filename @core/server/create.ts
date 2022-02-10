import { UserConfigServer } from "@factor/types"

import bodyParser from "body-parser"
import { EndpointServer } from "@factor/engine"
import http from "http"

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
