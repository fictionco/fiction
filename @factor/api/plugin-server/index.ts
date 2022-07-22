import http from "http"
import bodyParser from "body-parser"
import { FactorEnv } from "../plugin-env"
import { HookType, EndpointServer } from "../utils"
import type { Endpoint } from "../utils"
import { FactorPlugin } from "../plugin"
import { FactorUser } from "../plugin-user"

export type FactorServerHookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorServerSettings = {
  serverName: string
  port: number
  hooks?: HookType<FactorServerHookDictionary>[]
  endpoints?: Endpoint[]
  factorEnv?: FactorEnv
  factorUser?: FactorUser
  productionUrl?: string
  mode?: "production" | "development"
}

export class FactorServer extends FactorPlugin<FactorServerSettings> {
  public hooks = this.settings.hooks ?? []
  port = this.settings.port
  endpoints = this.settings.endpoints || []
  mode = this.settings.mode || this.utils.mode()
  localUrl = `http://localhost:${this.port}`
  productionUrl = this.settings.productionUrl || this.localUrl
  serverUrl = this.mode == "production" ? this.productionUrl : this.localUrl
  factorEnv? = this.settings.factorEnv
  factorUser? = this.settings.factorUser

  serverName = this.settings.serverName
  server?: http.Server
  constructor(settings: FactorServerSettings) {
    super(settings)

    this.addConfig()

    process.env.SERVER_PORT = this.port?.toString()
  }

  addConfig() {
    if (this.factorEnv) {
      this.factorEnv.addHook({
        hook: "staticSchema",
        callback: async (existing) => {
          const endpointKeys = this.endpoints
            ?.map((_) => _.key)
            .filter(Boolean)
            .sort()

          return {
            ...existing,
            endpoints: { enum: endpointKeys, type: "string" },
          }
        },
      })

      this.factorEnv.addHook({
        hook: "staticConfig",
        callback: (): Record<string, unknown> => {
          return {
            endpoints: this.endpoints?.map((ep) => ({
              key: ep.key,
              path: ep.pathname(),
            })),
          }
        },
      })
    }
  }

  addEndpoints(endpoints: Endpoint[]) {
    this.endpoints = [...this.endpoints, ...endpoints]
  }

  async setup() {}

  createServer = async (
    params: {
      factorUser?: FactorUser
    } = {},
  ): Promise<http.Server | undefined> => {
    if (this.utils.isApp()) return

    const { factorUser } = params
    if (!this.port) throw new Error("port not defined")
    try {
      const factorEndpointServer = new EndpointServer({
        serverName: this.serverName,
        port: this.port,
        endpoints: this.endpoints,
        factorUser,
        middleware: (app) => {
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
          return
        },
      })

      this.server = await factorEndpointServer.runServer()

      return this.server
    } catch (error) {
      this.log.error(`endpoint start`, { error })
    }

    return
  }

  close() {
    if (this.server) {
      this.server.close()
    }
  }
}
