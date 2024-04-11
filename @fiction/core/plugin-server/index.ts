import type http from 'node:http'
import bodyParser from 'body-parser'
import type { FictionEnv } from '../plugin-env'
import { EndpointServer, vue } from '../utils'
import type { Endpoint } from '../utils'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import type { FictionUser } from '../plugin-user'

export type FictionServerSettings = {
  fictionEnv?: FictionEnv
  serverName?: string
  port: number
  endpoints?: Endpoint[]
  liveUrl?: string
  isLive?: vue.Ref<boolean>
  useLocal?: boolean
} & FictionPluginSettings

export class FictionServer extends FictionPlugin<FictionServerSettings> {
  port = vue.ref(this.settings.port)
  endpoints = this.settings.endpoints || []
  liveUrl = vue.ref(this.settings.liveUrl)
  isLive = this.settings.isLive ?? vue.ref(this.settings.fictionEnv?.isProd.value)
  useLocal = vue.ref(this.settings.useLocal || false) // use same host
  localUrl = vue.computed(() => {
    const isBrowser = !this.fictionEnv?.isNode
    const currentUrl = new URL(isBrowser ? window.location.href : 'http://localhost')

    if (!isBrowser || !this.isLive.value)
      currentUrl.port = this.port.value.toString()

    return currentUrl.origin
  })

  serverUrl = vue.computed(() => {
    const isProd = this.isLive.value
    const liveUrl = this.liveUrl.value
    const url = !isProd || this.useLocal.value || !liveUrl ? this.localUrl.value : liveUrl
    return url
  })

  isInitialized = false
  serverName = this.settings.serverName || `${this.settings.fictionEnv.meta.app?.name} Server`
  server?: http.Server
  // fictionUser added in fictionUser module as the module depends on this one
  fictionUser?: FictionUser
  constructor(settings: FictionServerSettings) {
    super('server', settings)

    this.addConfig()
  }

  addConfig() {
    if (this.fictionEnv) {
      this.fictionEnv.addHook({
        hook: 'staticSchema',
        callback: async (existing) => {
          return { ...existing, endpoints: { enum: this.endpoints?.map(_ => _.key).filter(Boolean).sort(), type: 'string' } }
        },
      })

      this.fictionEnv.addHook({
        hook: 'staticConfig',
        callback: () => ({ endpoints: this.endpoints?.map(ep => ({ key: ep.key, path: ep.pathname() })) }),
      })
    }
  }

  addEndpoints(endpoints: Endpoint[]) {
    this.endpoints = [...this.endpoints, ...endpoints]
  }

  async initServer(args: { fictionUser?: FictionUser, useLocal?: boolean, port?: number } = {}) {
    const { fictionUser, useLocal = false, port } = args

    this.useLocal.value = useLocal
    if (port)
      this.port.value = port

    if (this.settings.fictionEnv.isApp.value)
      return

    if (!this.port)
      throw new Error('port not defined')

    let endpointServer: EndpointServer | undefined
    try {
      endpointServer = new EndpointServer({
        serverName: this.serverName,
        port: this.port.value,
        endpoints: this.endpoints,
        fictionUser,
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

  async createServer(args: { fictionUser?: FictionUser, useLocal?: boolean, port?: number } = {}): Promise<http.Server | undefined> {
    const { fictionUser = this.fictionUser, useLocal = false, port } = args

    if (this.settings.fictionEnv.isApp.value)
      return

    if (this.isInitialized) {
      this.log.info('server initialized already')
      return
    }

    this.isInitialized = true

    const endpointServer = await this.initServer({ fictionUser, useLocal, port })
    this.server = await endpointServer?.runServer()

    return this.server
  }

  close() {
    this.isInitialized = false
    if (this.server)
      this.server.close()
  }
}
