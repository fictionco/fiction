import type http from 'node:http'
import process from 'node:process'
import bodyParser from 'body-parser'
import type { FactorEnv } from '../plugin-env'
import { EnvVar, vars } from '../plugin-env'
import { EndpointServer, vue } from '../utils'
import type { Endpoint, HookType } from '../utils'
import type { FactorPluginSettings } from '../plugin'
import { FactorPlugin } from '../plugin'
import type { FactorUser } from '../plugin-user'

vars.register(() => [
  new EnvVar({
    name: 'NGROK_AUTH_TOKEN',
    val: process.env.NGROK_AUTH_TOKEN,
    isOptional: true,
  }),
])

export type FactorServerHookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorServerSettings = {
  factorEnv?: FactorEnv
  serverName?: string
  port: number
  hooks?: HookType<FactorServerHookDictionary>[]
  endpoints?: Endpoint[]
  liveUrl?: string
  isLive?: vue.Ref<boolean>
} & FactorPluginSettings

export class FactorServer extends FactorPlugin<FactorServerSettings> {
  public hooks = this.settings.hooks ?? []
  port = vue.ref(this.settings.port)
  endpoints = this.settings.endpoints || []
  localUrl = vue.computed(() => {
    const currentUrl = new URL(!this.factorEnv?.isNode ? window.location.href : 'http://localhost')
    currentUrl.port = this.port.value.toString()

    return currentUrl.origin
  })

  liveUrl = vue.ref(this.settings.liveUrl)
  isLive = this.settings.isLive ?? this.settings.factorEnv?.isProd
  useLocal = vue.ref(false) // use same host
  serverUrl = vue.computed(() => {
    const isProd = this.isLive.value
    const liveUrl = this.liveUrl.value
    return !isProd || this.useLocal.value || !liveUrl ? this.localUrl.value : liveUrl
  })

  isInitialized = false
  serverName = this.settings.serverName || `${this.settings.factorEnv.appName} Server`
  server?: http.Server
  // factorUser added in factorUser module as the module depends on this one
  factorUser?: FactorUser
  constructor(settings: FactorServerSettings) {
    super('server', settings)

    this.addConfig()
  }

  addConfig() {
    if (this.factorEnv) {
      this.factorEnv.addHook({
        hook: 'staticSchema',
        callback: async (existing) => {
          return { ...existing, endpoints: { enum: this.endpoints?.map(_ => _.key).filter(Boolean).sort(), type: 'string' } }
        },
      })

      this.factorEnv.addHook({
        hook: 'staticConfig',
        callback: () => ({ endpoints: this.endpoints?.map(ep => ({ key: ep.key, path: ep.pathname() })) }),
      })
    }
  }

  addEndpoints(endpoints: Endpoint[]) {
    this.endpoints = [...this.endpoints, ...endpoints]
  }

  async initServer(args: { factorUser?: FactorUser, useLocal?: boolean, port?: number } = {}) {
    const { factorUser, useLocal = false, port } = args

    this.useLocal.value = useLocal
    if (port)
      this.port.value = port

    if (this.settings.factorEnv.isApp.value)
      return

    if (!this.port)
      throw new Error('port not defined')

    let endpointServer: EndpointServer | undefined
    try {
      endpointServer = new EndpointServer({
        serverName: this.serverName,
        port: this.port.value,
        endpoints: this.endpoints,
        factorUser,
        url: this.serverUrl.value,
        middleware: (app) => {
          app.use(
            bodyParser.json({
              limit: '10mb',
              verify: (req, res, buf) => {
                // only include raw body if 'hook' is in the request url
                // this has a performance hit
                if (req.url?.includes('hook'))
                  req.rawBody = buf
              },
            }),
          )
        },
      })

      await endpointServer.configure()
    }
    catch (error) {
      this.log.error(`endpoint start`, { error })
    }

    return endpointServer
  }

  async createServer(args: { factorUser?: FactorUser, useLocal?: boolean, port?: number } = {}): Promise<http.Server | undefined> {
    const { factorUser = this.factorUser, useLocal = false, port } = args

    if (this.settings.factorEnv.isApp.value)
      return

    if (this.isInitialized) {
      this.log.info('server initialized already')
      return
    }

    this.isInitialized = true

    const endpointServer = await this.initServer({ factorUser, useLocal, port })
    this.server = await endpointServer?.runServer()

    return this.server
  }

  close() {
    this.isInitialized = false
    if (this.server)
      this.server.close()
  }
}
