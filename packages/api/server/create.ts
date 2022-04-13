import http from "http"
import bodyParser from "body-parser"
import { UserConfig } from "../types"
import { log } from "../logger"
import { EndpointServer } from "../engine"

export const createEndpointServer = async (
  port: string,
  config: UserConfig,
): Promise<http.Server | undefined> => {
  const { endpoints = [] } = config

  // Set this global to enable URL calc
  process.env.FACTOR_SERVER_PORT = port

  try {
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

    return await factorEndpointServer.runServer()
  } catch (error) {
    log.error("createEndpointServer", `error creating factor server`, { error })
  }

  return
}
