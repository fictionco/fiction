/** server-only-file */
import http from "http"
import express from "express"

import bodyParser from "body-parser"
import compression from "compression"
import helmet, { HelmetOptions } from "helmet"
import cors from "cors"
import { ErrorConfig, EndpointResponse } from "../types"
import { log } from "../plugin-log"
import { _stop } from "../utils/error"
import { onEvent } from "../utils/event"
import type { FactorUser } from "../plugin-user"
import type { Query } from "../query"
import { Endpoint } from "./endpoint"
import { getVersion, getCommit } from "./vars"

type CustomServerHandler = (
  app: express.Express,
) => Promise<http.Server> | http.Server

type MiddlewareHandler = (app: express.Express) => Promise<void> | void

export type EndpointServerOptions = {
  port: number
  serverName: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
  factorUser?: FactorUser
  liveUrl?: string
  url?: string
}

export type ServiceHealthCheckResult = {
  status: "success" | "error"
  message: "ok" | ""
  version?: string
  uptime: number
  timestamp: number
  commit?: string
}

export const createExpressApp = (
  opts: HelmetOptions & { noHelmet?: boolean } = {},
): express.Express => {
  const { noHelmet } = opts
  const app = express()

  // prevent bots looking for exposed .env files
  app.use("*.env", (req, res) => {
    res.status(404).end()
  })

  if (!noHelmet) {
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        ...opts,
      }),
    )
  }
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.text())
  app.use(compression())

  app.use("/health", (request, response) => {
    const healthData: ServiceHealthCheckResult = {
      status: "success",
      message: "ok",
      version: getVersion(),
      uptime: process.uptime(),
      timestamp: Date.now(),
      commit: getCommit(),
    }

    response.status(200).send(healthData).end()
  })

  return app
}

export class EndpointServer {
  serverName: string
  port: number
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
  server?: http.Server
  factorUser?: FactorUser
  log = log.contextLogger(this.constructor.name)
  url: string

  constructor(settings: EndpointServerOptions) {
    const { port, endpoints, customServer, serverName } = settings

    this.serverName = serverName
    this.port = port
    this.endpoints = endpoints
    this.customServer = customServer
    this.factorUser = settings.factorUser
    this.url = settings.url || `http://localhost:${port}`
  }

  async runServer(): Promise<http.Server | undefined> {
    try {
      const app = createExpressApp()

      this.endpoints.forEach((endpoint) => {
        if (this.factorUser) {
          app.use(endpoint.pathname(), this.endpointAuthorization)
        }

        const pathMiddleware: express.RequestHandler[] =
          endpoint.middleware || []

        app.use(
          endpoint.pathname(),
          ...pathMiddleware,
          async (request: express.Request, response) => {
            // error handling is done via "Query" class
            const result = await endpoint.serveRequest(request, response)
            delete result?.internal

            if (result) {
              response.status(200).send(result).end()
            }

            return
          },
        )
      })

      if (this.middleware) {
        await this.middleware(app)
      }

      app.use("/", (request, response) => {
        response.status(200).send("ok").end()
      })

      this.server = await new Promise(async (resolve) => {
        let s: http.Server
        if (this.customServer) {
          s = await this.customServer(app)
          s.listen(this.port, () => resolve(s))
        } else {
          s = app.listen(this.port, () => resolve(s))
        }
      })

      this.log.info(`started`, {
        data: {
          serverName: this.serverName,
          auth: this.factorUser ? "enabled" : "disabled",
          port: `[ ${this.port} ]`,
          endpoints: this.endpoints.map(
            (ep) => `${ep.pathname()} (${ep.middleware.length})`,
          ),
          health: `${this.url}/health`,
        },
      })

      onEvent("shutdown", () => this.server?.close())

      return this.server
    } catch (error) {
      this.log.error("creation error", { error })
    }
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
    if (!this.factorUser) return request

    const bearerToken = request.headers.authorization

    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      const token = bearerToken.split("Bearer ")[1]
      request.bearerToken = token

      if (request.bearerToken) {
        const { email } =
          this.factorUser.decodeClientToken(request.bearerToken) ?? {}

        request.bearer = undefined

        if (email && this.factorUser) {
          const { data: user } = await this.factorUser.queries.ManageUser.serve(
            {
              email,
              _action: "getPrivate",
            },
            { server: true },
          )

          if (user) {
            request.bearer = user
          }
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
      this.log.error(`endpoint setup error (${authorization ?? ""})`, {
        error,
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
    this.log.error(`error: ${request.url}`, { data: { error, ...details } })

    return {
      status: "error",
      message: error.expose ? error.message : "",
      code: error.code,
      expose: error.expose,
    }
  }
}
