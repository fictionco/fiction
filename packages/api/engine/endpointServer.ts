/** server-only-file */
import http from "http"
import express from "express"

import { ErrorConfig, EndpointResponse } from "../types"
import { log } from "../logger"
import { _stop } from "../error"
import { decodeClientToken } from "../jwt"
import { onEvent } from "../event"
import { Endpoint } from "./endpoint"
import { Query } from "./query"
import { createExpressApp } from "./nodeUtils"
import { FactorUser } from "../plugin-user"

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
  userPlugin?: FactorUser
}

export class EndpointServer {
  name: string
  port: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
  context = "endpointServer"
  server?: http.Server
  userPlugin?: FactorUser
  constructor(options: EndpointServerOptions) {
    const { port, endpoints, customServer, name } = options

    this.name = name
    this.port = port
    this.endpoints = endpoints
    this.customServer = customServer
    this.userPlugin = options.userPlugin
  }

  async runServer(): Promise<http.Server | undefined> {
    try {
      const app = createExpressApp()

      this.endpoints.forEach((endpoint) => {
        if (this.userPlugin) {
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

      log.info(this.context, `endpoint server`, {
        data: {
          name: this.name,
          port: `[ ${this.port} ]`,
          endpoints: this.endpoints.map((ep) => ep.pathname()),
        },
      })

      onEvent("shutdown", () => this.server?.close())

      return this.server
    } catch (error) {
      log.error(this.context, "server create err", { error })
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
    const bearerToken = request.headers.authorization

    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      const token = bearerToken.split("Bearer ")[1]
      request.bearerToken = token

      if (request.bearerToken) {
        const { email } = decodeClientToken(request.bearerToken)

        request.bearer = undefined

        if (email && this.userPlugin) {
          const { data: user } = await this.userPlugin.queries.ManageUser.serve(
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
      log.error(this.context, `endpoint setup error (${authorization ?? ""})`, {
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
    log.log({
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
