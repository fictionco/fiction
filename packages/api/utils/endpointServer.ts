/** server-only-file */
import http from "http"
import express from "express"

import { ErrorConfig, EndpointResponse } from "../types"
import { contextLogger } from "../logger"
import { _stop } from "../utils/error"
import { onEvent } from "../utils/event"
import type { FactorUser } from "../plugin-user"
import type { Query } from "../query"
import { Endpoint } from "./endpoint"
import { createExpressApp } from "./nodeUtils"

type CustomServerHandler = (
  app: express.Express,
) => Promise<http.Server> | http.Server

type MiddlewareHandler = (app: express.Express) => Promise<void> | void

export type EndpointServerOptions = {
  port: string
  name: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
  factorUser?: FactorUser
}

export class EndpointServer {
  name: string
  port: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
  server?: http.Server
  factorUser?: FactorUser
  log = contextLogger(this.constructor.name)
  constructor(options: EndpointServerOptions) {
    const { port, endpoints, customServer, name } = options

    this.name = name
    this.port = port
    this.endpoints = endpoints
    this.customServer = customServer
    this.factorUser = options.factorUser
  }

  async runServer(): Promise<http.Server | undefined> {
    try {
      const app = createExpressApp()

      this.endpoints.forEach((endpoint) => {
        if (this.factorUser) {
          app.use(endpoint.pathname(), this.endpointAuthorization)
        }

        app.use(endpoint.pathname(), async (request, response) => {
          const result = await endpoint.serveRequest(request)
          delete result.internal
          response.status(200).send(result).end()
        })
      })

      app.use("/health", (request, response) => {
        response.status(200).send({ status: "success", message: "ok" }).end()
      })

      if (this.middleware) {
        await this.middleware(app)
      }

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
          name: this.name,
          port: `[ ${this.port} ]`,
          endpoints: this.endpoints.map((ep) => ep.pathname()),
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
