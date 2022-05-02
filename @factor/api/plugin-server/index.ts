import http from "http"
import bodyParser from "body-parser"
import { FactorEnv } from "@factor/api/plugin-env"
import { HookType, EndpointServer } from "@factor/api/utils"
import type { Endpoint } from "@factor/api/utils"
import { FactorPlugin } from "@factor/api/plugin"
import { FactorUser } from "../plugin-user"

export type FactorServerHookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorServerSettings = {
  serverName: string
  port?: number
  hooks?: HookType<FactorServerHookDictionary>[]
  endpoints?: Endpoint[]
  serverUrl?: string
  factorEnv?: FactorEnv<string>
  factorUser?: FactorUser
  onCommands?: string[]
}

export class FactorServer extends FactorPlugin<FactorServerSettings> {
  public hooks: HookType<FactorServerHookDictionary>[]
  port?: number
  endpoints: Endpoint[]
  serverUrl: string
  factorEnv?: FactorEnv<string>
  factorUser?: FactorUser
  onCommands: string[]
  serverName: string
  constructor(settings: FactorServerSettings) {
    super(settings)
    this.serverName = settings.serverName
    this.hooks = settings.hooks ?? []
    this.port = settings.port
    this.serverUrl = settings.serverUrl ?? `http://localhost:${this.port}`
    this.endpoints = settings.endpoints ?? []
    this.factorEnv = settings.factorEnv
    this.factorUser = settings.factorUser

    this.onCommands = settings.onCommands || [
      "bundle",
      "build",
      "server",
      "dev",
      "prerender",
    ]
    this.addToCli()
  }

  addToCli() {
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

      return await factorEndpointServer.runServer()
    } catch (error) {
      this.log.error(`endpoint start`, { error })
    }

    return
  }
}
