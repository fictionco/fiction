import http from "http"
import bodyParser from "body-parser"
import { UserConfig } from "../config/types"
import { HookType } from "../utils/hook"
import type { RunConfig } from "../cli/utils"
import { EndpointServer } from "../engine/endpointServer"
import { FactorPlugin } from "../config"
import type { Endpoint } from "../engine"
import * as types from "./types"

export class FactorServer extends FactorPlugin<types.FactorServerSettings> {
  types = types
  public hooks: HookType<types.HookDictionary>[]
  readonly port: number
  endpoints: Endpoint[]
  serverUrl: string
  constructor(settings: types.FactorServerSettings) {
    super(settings)
    this.hooks = settings.hooks ?? []
    this.port = settings.port ?? 3333
    this.serverUrl = settings.serverUrl ?? `http://localhost:${this.port}`
    this.endpoints = settings.endpoints ?? []
  }

  addEndpoints(endpoints: Endpoint[]) {
    this.endpoints = [...this.endpoints, ...endpoints]
  }

  async setup(): Promise<UserConfig> {
    return {
      hooks: [
        {
          hook: "run",
          callback: async (runConfig: RunConfig) => {
            const commands = new Set(["bundle", "build", "serve", "rdev"])
            if (commands.has(runConfig.command ?? "")) {
              await this.createServer()
            }
          },
        },
      ],
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
