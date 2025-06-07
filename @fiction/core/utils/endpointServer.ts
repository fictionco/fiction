import type { HelmetOptions } from 'helmet'
import type http from 'node:http'

import type { FictionEnv } from '../plugin-env'
import type { FictionUser } from '../plugin-user'
import type { Query } from '../query'
import type { EndpointResponse } from '../types'
import type { Endpoint } from './endpoint'
import type { ErrorConfig } from './error'
import express from 'express'
import { log } from '../plugin-log'
import { decodeUserToken } from './jwt'
import { getAccessLevel } from './priv'
import { addExpressHealthCheck } from './serverHealth'

type CustomServerHandler = (app: express.Express,) => Promise<http.Server> | http.Server
type MiddlewareHandler = (app: express.Express) => Promise<void> | void

export interface EndpointServerOptions {
  port: number
  serverName: string
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler
  fictionUser?: FictionUser
  fictionEnv: FictionEnv
  liveUrl?: string
  url?: string
}

export async function createExpressApp(opts: HelmetOptions & { noHelmet?: boolean, id: string }): Promise<express.Express> {
  const { noHelmet, id } = opts
  const app = express()

  const { default: helmet } = await import('helmet')
  const { default: cors } = await import('cors')
  const { default: bodyParser } = await import('body-parser')
  const { default: compression } = await import('compression')
  const { default: cookieParser } = await import('cookie-parser')

  // prevent bots looking for exposed .env files
  app.use('*.env', (req, res) => { res.status(404).end() })

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
  app.use(cookieParser())

  addExpressHealthCheck({ expressApp: app, basePath: '/api/health', id })

  return app
}

export async function setAuthorizedUser(args: { fictionUser: FictionUser, request: express.Request, serverName?: string }): Promise<express.Request> {
  const { fictionUser, request, serverName = 'Unknown' } = args
  if (!fictionUser) {
    throw new Error(`no fictionUser instance for endpoint authorization (${serverName})`)
  }

  let userId: string | undefined
  request.bearer = undefined
  request.bearerToken = undefined
  request.anonymousId = request.headers['x-anonymous-id'] as string | undefined

  let token: string | undefined
  const bearerToken = request.headers.authorization

  if (bearerToken && bearerToken.startsWith('Bearer ')) {
    token = bearerToken.split('Bearer ')[1]
  }
  else if (request.headers['x-access-token']) {
    token = request.headers['x-access-token'] as string
  }

  if (token) {
    request.bearerToken = token

    const r = decodeUserToken({ token, tokenSecret: fictionUser.settings.tokenSecret }) ?? {}

    userId = r.userId
  }

  if (userId) {
    const { data: user } = await fictionUser.queries.ManageUser.serve(
      { where: { userId }, _action: 'retrieve' },
      { server: true },
    )

    if (user) {
      const params = request.body as Record<string, any>
      const o = params.orgId

      const relation = user.orgs?.find(org => org.orgId === o)?.relation

      if (relation)
        relation.accessLevel = getAccessLevel(relation?.access)

      user.relation = relation

      request.bearer = user
    }
  }

  return request
}

export class EndpointServer {
  fictionEnv: FictionEnv
  serverName: string
  port: number
  endpoints: Endpoint<Query>[]
  customServer?: CustomServerHandler
  middleware?: MiddlewareHandler

  fictionUser?: FictionUser
  log = log.contextLogger(this.constructor.name)
  url: string
  server?: http.Server
  expressApp?: express.Express
  constructor(settings: EndpointServerOptions) {
    const { port, endpoints, customServer, serverName } = settings

    this.serverName = serverName
    this.port = port
    this.endpoints = endpoints
    this.customServer = customServer
    this.fictionUser = settings.fictionUser
    this.fictionEnv = settings.fictionEnv
    this.url = settings.url || `http://localhost:${port}`
  }

  async getApp(): Promise<express.Express> {
    if (!this.expressApp) {
      this.expressApp = await createExpressApp({ noHelmet: true, id: this.serverName })
    }

    return this.expressApp
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
    const app = await this.getApp()

    this.endpoints.forEach((endpoint) => {
      const pathMiddleware: express.RequestHandler[] = endpoint.middleware()

      app.use(
        endpoint.pathname(),
        ...pathMiddleware,
        this.endpointAuthorization, // should come after middleware, as multer, etc have to parse it first
        async (request: express.Request, response, next) => {
          // error handling is done via "Query" class
          const result = (await endpoint.serveRequest(request, response, next)) as EndpointResponse

          delete result?.internal

          if (result?.status)
            response.status(200).send(result).end()
        },
      )
    })

    if (this.middleware)
      await this.middleware(app)

    app.use('/api/ok', (req, res) => { res.status(200).send('ok').end() })
  }

  async run(args: { port?: number, isRestart?: boolean } = {}) {
    const { port = this.port, isRestart = false } = args

    if (this.server) {
      this.server.close()
    }

    const app = await this.getApp()

    this.server = await new Promise(async (resolve) => {
      let s: http.Server
      if (this.customServer) {
        s = await this.customServer(app)
        s.listen(port, () => resolve(s))
      }
      else {
        s = app.listen(port, () => resolve(s))
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

    if (!isRestart) {
      this.fictionEnv.events.on('restartServers', async () => this.run({ ...args, isRestart: true }))
      this.fictionEnv.events.on('shutdown', () => this.server?.close())
    }
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
      if (this.fictionUser) {
        request = await setAuthorizedUser({ request, fictionUser: this.fictionUser, serverName: this.serverName })
      }

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
