import { applyFilters } from "@factor/api"
import { logger } from "@factor/server-utils/serverLogger"
import { EndpointConfig, PrivateUser, UserConfigServer } from "@factor/types"
import express from "express"
import cors from "cors"
import compression from "compression"
import bodyParser from "body-parser"
import helmet from "helmet"
import { Server } from "http"
import { decodeClientToken } from "./serverJwt"
import { findOneUser } from "./user/serverUser"
// import getPort from "get-port"
/**
 * Takes authorization header with bearer token and converts it into a user for subsequent endpoint operations
 * @param bearerToken - JWT token sent from client in authorization header
 *
 * @category server
 */
export const setAuthorizedUser = async (
  request: express.Request,
): Promise<express.Request> => {
  const bearerToken = request.headers.authorization

  if (bearerToken && bearerToken.startsWith("Bearer ")) {
    const token = bearerToken.split("Bearer ")[1]
    request.bearerToken = token
    if (request.bearerToken) {
      const { email } = decodeClientToken(request.bearerToken)

      const user = await findOneUser<PrivateUser>({ email, select: ["*"] })

      if (user) {
        request.bearer = user
        request.bearer.token = token
      } else {
        request.bearer = undefined
      }
    }
  }

  return request
}

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
  app.use(async (request, response, next) => {
    if (request.path === "/favicon.ico") return

    const {
      headers: { authorization },
    } = request

    try {
      request = await setAuthorizedUser(request)
      next()
    } catch (error) {
      logger({
        level: "error",
        context: "endpoint",
        description: `endpoint setup error (${authorization ?? ""})`,
        data: error,
      })

      response
        .status(200)
        .send({
          status: "error",
          message: "authorization error",
          code: "TOKEN_ERROR",
        })
        .end()
    }
  })

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
  /**
   * Add endpoint routes
   */
  const allEndpoints = applyFilters("endpoints", endpoints)

  allEndpoints.forEach(({ route, handler }) => {
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

    logger({
      level: "info",
      context: "endpoint",
      description: `endpoint server @app:${appName} @port:${port}`,
    })
  })

  return server
}
