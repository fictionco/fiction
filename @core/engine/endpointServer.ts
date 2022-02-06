/** server-only-file */
import http from "http"
import express from "express"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import { decodeClientToken } from "./jwt"
import { ErrorConfig, EndpointResponse } from "@factor/types"
import { logger, _stop } from "@factor/api"
import { Endpoint } from "./endpoint"
import { Queries } from "./user"
import { Query } from "./query"
type CustomServerHandler = (
  app: express.Express,
) => Promise<http.Server> | http.Server

type MiddlewareHandler = (app: express.Express) => Promise<void> | void

export type EndpointServerOptions = {
  port: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
}

export class EndpointServer {
  port: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler

  constructor(options: EndpointServerOptions) {
    const { port, endpoints, customServer } = options
    this.port = port
    this.endpoints = endpoints
    this.customServer = customServer
  }

  async serverCreate(): Promise<http.Server> {
    const app = express()

    app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }))
    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.text())
    app.use(compression())

    this.endpoints.forEach((endpoint) => {
      const { basePath, key } = endpoint
      app.use(`${basePath}/${key}`, this.endpointAuthorization)
      app.use(`${basePath}/${key}`, async (request, response) => {
        const result = await endpoint.serveRequest(request)

        response.status(200).send(result).end()
      })
    })

    app.use("/health", (request, response) => {
      response.status(200).send({ status: "success", message: "ok" }).end()
    })

    if (this.middleware) {
      await this.middleware(app)
    }

    let server: http.Server

    if (this.customServer) {
      server = await this.customServer(app)
      server.listen(this.port)
    } else {
      server = app.listen(this.port)
    }

    return server
  }
  /**
   * Takes authorization header with bearer token and converts it into a user for subsequent endpoint operations
   * @param bearerToken - JWT token sent from client in authorization header
   *
   * @category server
   */
  setAuthorizedUser = async (
    request: express.Request,
  ): Promise<express.Request> => {
    const bearerToken = request.headers.authorization

    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      const token = bearerToken.split("Bearer ")[1]
      request.bearerToken = token

      if (request.bearerToken) {
        const { email } = decodeClientToken(request.bearerToken)

        console.log("GET AUTH", request.url)
        const { data: user } = await Queries.ManageUser.run({
          email,
          _action: "getPrivate",
        })

        if (user) {
          request.bearer = user
          request.bearerToken = token
        } else {
          request.bearer = undefined
        }
      }
    }

    return request
  }

  endpointAuthorization = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    if (request.path === "/favicon.ico") return

    const {
      headers: { authorization },
    } = request

    try {
      request = await this.setAuthorizedUser(request)
      next()
    } catch (error) {
      logger.log({
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
  }

  endpointErrorResponse = (
    error: ErrorConfig,
    request: express.Request,
  ): EndpointResponse => {
    const details = request.body as Record<string, any>
    logger.log({
      level: "error",
      context: "endpointErrorResponse",
      description: `error: ${request.url}`,
      data: { error, ...details },
    })

    return {
      status: "error",
      message: error.expose ? error.message : "",
      code: error.code,
      expose: error.expose,
    }
  }
}
