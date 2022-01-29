import { logger } from "@factor/api"
import { EndpointConfig, UserConfigServer } from "@factor/types"
import express from "express"
import cors from "cors"
import compression from "compression"
import bodyParser from "body-parser"
import helmet from "helmet"
import { Server } from "http"
import { endpointAuthorization } from "./serverEndpointUtils"

/**
 * Creates the API endpoint server
 */
export const createEndpointServer = async (
  config: UserConfigServer = {},
): Promise<Server> => {
  const app = express()

  // comes first, basic security and cors headers
  app.use(helmet())
  app.use(cors({ origin: true }))

  /**
   * General entry point for server
   * @preprocess
   */
  app.use(endpointAuthorization)

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
  app.use(bodyParser.text())
  app.use(compression())

  /**
   * Standard and extended endpoints
   */
  const endpoints: EndpointConfig[] = config.endpoints ?? []

  endpoints.forEach(({ route, handler }) => {
    app.use(route, async (request, response) => {
      const result = await handler(request)

      response.status(200).send(result).end()
    })
  })

  /**
   * Send a health check response
   */
  app.use("/", (request, response) => {
    response.status(404).end()
  })

  /**
   * Set endpoint port, if PORT var is set use that (hosted envs)
   * otherwise, use 3210 or a random one if that is taken
   */

  const port =
    String(config.endpointPort) ||
    process.env.PORT ||
    process.env.FACTOR_SERVER_PORT ||
    "3210"

  // Set this global to enable URL calc
  process.env.FACTOR_SERVER_PORT = port

  const server = app.listen(port, () => {
    const appName = process.env.FACTOR_APP_NAME || "app"

    logger.log({
      level: "info",
      context: "endpoint",
      description: `endpoint server @app:${appName} @port:${port}`,
    })
  })

  return server
}
