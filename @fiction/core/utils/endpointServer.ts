/** server-only-file */
import type http from 'node:http'
import process from 'node:process'
import express from 'express'

import bodyParser from 'body-parser'
import compression from 'compression'
import type { HelmetOptions } from 'helmet'
import helmet from 'helmet'
import cors from 'cors'
import type { EndpointResponse } from '../types'
import { log } from '../plugin-log'
import { onEvent } from '../utils/event'
import type { FictionUser } from '../plugin-user'
import type { Query } from '../query'
import type { ErrorConfig } from './error'
import type { Endpoint } from './endpoint'
import { getCommit, getVersion } from './vars'
import { getAccessLevel } from './priv'
import { decodeUserToken } from './jwt'

type CustomServerHandler = (app: express.Express,) => Promise<http.Server> | http.Server
type MiddlewareHandler = (app: express.Express) => Promise<void> | void

export interface EndpointServerOptions {
  port: number
  serverName: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
  fictionUser?: FictionUser
  liveUrl?: string
  url?: string
}

export interface ServiceHealthCheckResult {
  status: 'success' | 'error'
  message: 'ok' | ''
  version?: string
  duration: number
  timestamp: number
  commit?: string
}

export function createExpressApp(opts: HelmetOptions & { noHelmet?: boolean } = {}): express.Express {
  const { noHelmet } = opts
  const app = express()

  // prevent bots looking for exposed .env files
  app.use('*.env', (req, res) => res.status(404).end())

  if (!noHelmet) {
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginOpenerPolicy: { policy: 'unsafe-none' },
        ...opts,
      }),
    )
  }
  app.use(cors())
  app.use(bodyParser.json({ limit: '10mb' }))
  app.use(bodyParser.text({ limit: '10mb' }))
  app.use(compression())

  app.use('/api/health', (request, response) => {
    const healthData: ServiceHealthCheckResult = {
      status: 'success',
      message: 'ok',
      version: getVersion(),
      duration: process.uptime(),
      timestamp: Date.now(),
      commit: getCommit(),
    }

    log.info('expressApp', 'health check request', { data: healthData })

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

  fictionUser?: FictionUser
  log = log.contextLogger(this.constructor.name)
  url: string
  server?: http.Server
  expressApp: express.Express
  constructor(settings: EndpointServerOptions) {
    const { port, endpoints, customServer, serverName } = settings

    this.serverName = serverName
    this.port = port
    this.endpoints = endpoints
    this.customServer = customServer
    this.fictionUser = settings.fictionUser
    this.url = settings.url || `http://localhost:${port}`
    this.expressApp = createExpressApp({ noHelmet: true })
  }

  async runServer(): Promise<http.Server | undefined> {
    try {
      await this.run()

      return this.server
    }
    catch (error) {
      this.log.error('server creation error', { error })
    }
  }

  async configure() {
    this.endpoints.forEach((endpoint) => {
      const pathMiddleware: express.RequestHandler[] = endpoint.middleware()

      this.expressApp.use(
        endpoint.pathname(),
        ...pathMiddleware,
        this.endpointAuthorization, // should come after middleware, as multer, etc have to parse it first
        async (request: express.Request, response) => {
          // error handling is done via "Query" class
          const result = await endpoint.serveRequest(request, response)
          delete result?.internal

          if (result)
            response.status(200).send(result).end()
        },
      )
    })

    if (this.middleware)
      await this.middleware(this.expressApp)

    this.expressApp.use('/api/ok', (req, res) => res.status(200).send('ok').end())
  }

  async run(args: { port?: number } = {}) {
    const { port = this.port } = args

    this.server = await new Promise(async (resolve) => {
      let s: http.Server
      if (this.customServer) {
        s = await this.customServer(this.expressApp)
        s.listen(port, () => resolve(s))
      }
      else {
        s = this.expressApp.listen(port, () => resolve(s))
      }
    })

    const endpoints = this.endpoints.map(
      (ep) => {
        const out = [ep.pathname()]
        const middlewaresApplied = ep.middleware.length

        if (middlewaresApplied)
          out.push(`(${ep.middleware.length})`)

        return out.join(' ')
      },
    )

    this.log.info(`[start] Endpoint Server`, {
      data: {
        baseUrl: this.url,
        serverName: this.serverName,
        auth: this.fictionUser ? 'enabled' : 'disabled',
        port: `[ ${port} ]`,
        endpoints,
        health: `${this.url}/api/health`,
      },
    })

    onEvent('shutdown', () => this.server?.close())
  }

  /**
   * Takes authorization header with bearer token and converts it into a user for subsequent endpoint operations
   *
   * @category server
   */
  setAuthorizedUser = async (
    request: express.Request,
  ): Promise<express.Request> => {
    if (!this.fictionUser) {
      this.log.error(`no fictionUser instance for endpoint authorization (${this.serverName})`)
      return request
    }

    let userId: string | undefined
    request.bearer = undefined
    request.bearerToken = undefined

    const bearerToken = request.headers.authorization

    if (bearerToken && bearerToken.startsWith('Bearer ')) {
      const token = bearerToken.split('Bearer ')[1]

      request.bearerToken = token

      const r = decodeUserToken({ token, tokenSecret: this.fictionUser.settings.tokenSecret }) ?? {}

      userId = r.userId
    }

    if (userId) {
      const { data: user } = await this.fictionUser.queries.ManageUser.serve(
        { where: { userId }, _action: 'retrieve' },
        { server: true },
      )

      if (user) {
        const params = request.body as Record<string, any>
        const o = params.orgId

        const relation = user.orgs?.find(
          org => org.orgId === o,
        )?.relation

        if (relation)
          relation.accessLevel = getAccessLevel(relation?.memberAccess)

        user.relation = relation

        request.bearer = user
      }
    }

    return request
  }

  endpointAuthorization = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    if (request.path === '/favicon.ico')
      return

    const { headers: { authorization } } = request

    try {
      request = await this.setAuthorizedUser(request)
      next()
    }
    catch (error) {
      this.log.error(`endpoint setup error (${authorization ?? ''})`, { error })

      response
        .status(200)
        .send({ status: 'error', message: 'authorization error', code: 'TOKEN_ERROR' })
        .end()
    }
  }

  endpointErrorResponse = (
    error: ErrorConfig,
    request: express.Request,
  ): EndpointResponse => {
    const details = request.body as Record<string, any>
    this.log.error(`endpoint error: ${request.url}`, { data: details, error })

    const { code, expose, message = '' } = error
    return { status: 'error', message, code, expose }
  }
}
