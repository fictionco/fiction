/** server-only-file */
import http from "http"
import express from "express"
import bodyParser from "body-parser"
import compression from "compression"
import helmet from "helmet"
import cors from "cors"
import { decodeClientToken } from "@factor/server/serverJwt"
import { ErrorConfig, EndpointResponse, PrivateUser } from "@factor/types"
import { logger, _stop } from "@factor/api"
import { Endpoint } from "./endpoint"
import { findOneUser } from "@factor/server"

type CustomServerHandler = (
  app: express.Express,
) => Promise<http.Server> | http.Server

type MiddlewareHandler = (app: express.Express) => Promise<void> | void

export type EndpointServerOptions = {
  port: string
  endpoints: Endpoint[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
}

export class EndpointServer {
  port: string
  endpoints: Endpoint[]
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
      app.use(
        `${endpoint.basePath}/${endpoint.methodName}`,
        this.endpointAuthorization,
      )
      app.use(
        `${endpoint.basePath}/${endpoint.methodName}`,
        async (request, response) => {
          const { params } = this.processEndpointRequest(request)
          const result = await endpoint.serveRequest(params)

          response.status(200).send(result).end()
        },
      )
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

  processEndpointRequest = <
    T extends Record<string, any> = Record<string, any>,
  >(
    request: express.Request,
  ): {
    params: T & {
      userId?: string
      bearer?: PrivateUser
    }
    _method?: string
    url: string
  } => {
    const _method = request.params._method as string | undefined
    const params = request.body as T & {
      userId?: string
      bearer?: PrivateUser
    }
    const { userId } = request.bearer ?? {}

    params.userId = userId
    params.bearer = request.bearer

    return { _method: String(_method), params, url: request.url }
  }

  endpointErrorResponse = (
    error: ErrorConfig,
    request: express.Request,
  ): EndpointResponse => {
    const details = this.processEndpointRequest(request)
    logger.log({
      level: "error",
      context: "endpointErrorResponse",
      description: `error: ${details.url}`,
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
