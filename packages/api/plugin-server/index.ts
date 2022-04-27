import http from "http"
import bodyParser from "body-parser"
import { UserConfig, FactorEnv, CliOptions } from "@factor/api/plugin-env"
import { HookType, EndpointServer } from "@factor/api/utils"
import type { Endpoint } from "@factor/api/utils"
import { FactorPlugin } from "@factor/api/plugin"

export type HookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

export type FactorServerSettings = {
  port: number
  hooks?: HookType<HookDictionary>[]
  endpoints?: Endpoint[]
  serverUrl?: string
  factorEnv?: FactorEnv<string>
}

export class FactorServer extends FactorPlugin<FactorServerSettings> {
  public hooks: HookType<HookDictionary>[]
  port: number
  endpoints: Endpoint[]
  serverUrl: string
  factorEnv?: FactorEnv<string>
  constructor(settings: FactorServerSettings) {
    super(settings)
    this.hooks = settings.hooks ?? []
    this.port = settings.port ?? 3333
    this.serverUrl = settings.serverUrl ?? `http://localhost:${this.port}`
    this.endpoints = settings.endpoints ?? []
    this.factorEnv = settings.factorEnv

    this.addToCli()
  }

  addToCli() {
    if (this.factorEnv) {
      this.factorEnv.addHook({
        hook: "runCommand",
        callback: async (command: string, opts: CliOptions) => {
          if (opts.serverPort) {
            this.port = opts.serverPort
          }

          if (
            new Set(["bundle", "build", "server", "dev", "prerender"]).has(
              command,
            )
          ) {
            await this.createServer()
          }
        },
      })

      this.factorEnv.addHook({
        hook: "staticSchema",
        callback: async () => {
          const keys = this.endpoints
            ?.map((_) => _.key)
            .filter(Boolean)
            .sort() ?? [""]

          return {
            routes: { enum: keys, type: "string" },
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

  async setup(): Promise<UserConfig> {
    return {
      name: this.constructor.name,
      serverOnlyImports: [{ id: "http" }, { id: "body-parser" }],
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
    try {
      const factorEndpointServer = new EndpointServer({
        name: "factor",
        port: String(this.port),
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
