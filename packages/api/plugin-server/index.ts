import http from "http"
import bodyParser from "body-parser"
import { ServiceConfig, FactorEnv } from "@factor/api/plugin-env"
import { HookType, EndpointServer } from "@factor/api/utils"
import type { Endpoint } from "@factor/api/utils"
import { FactorPlugin } from "@factor/api/plugin"

export type FactorServerHookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorServerSettings = {
  port?: number
  hooks?: HookType<FactorServerHookDictionary>[]
  endpoints?: Endpoint[]
  serverUrl?: string
  factorEnv?: FactorEnv<string>
  onCommands?: string[]
}

export class FactorServer extends FactorPlugin<FactorServerSettings> {
  public hooks: HookType<FactorServerHookDictionary>[]
  port?: number
  endpoints: Endpoint[]
  serverUrl: string
  factorEnv?: FactorEnv<string>
  onCommands: string[]
  constructor(settings: FactorServerSettings) {
    super(settings)

    this.hooks = settings.hooks ?? []
    this.port = settings.port
    this.serverUrl = settings.serverUrl ?? `http://localhost:${this.port}`
    this.endpoints = settings.endpoints ?? []
    this.factorEnv = settings.factorEnv

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
        hook: "runCommand",
        callback: async (command: string) => {
          if (new Set(this.onCommands).has(command)) {
            await this.createServer()
          }
        },
      })

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

  async setup(): Promise<ServiceConfig> {
    return {
      name: this.constructor.name,
    }
  }

  createServer = async (): Promise<http.Server | undefined> => {
    await this.utils.runHooks({
      list: this.hooks,
      hook: "afterServerSetup",
    })

    const server = await this.createEndpointServer()

    await this.utils.runHooks({
      list: this.hooks,
      hook: "afterServerCreated",
    })

    return server
  }

  createEndpointServer = async (): Promise<http.Server | undefined> => {
    if (!this.port) throw new Error("port not defined")
    try {
      const factorEndpointServer = new EndpointServer({
        name: "factor",
        port: this.port,
        endpoints: this.endpoints,
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
