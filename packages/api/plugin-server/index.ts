import http from "http"
import bodyParser from "body-parser"
import { UserConfig } from "../config/types"
import { HookType } from "../utils/hook"
import type { RunConfig } from "../cli/utils"

import { EndpointServer } from "../engine/endpointServer"
import { FactorPlugin } from "../config"
import * as types from "./types"

/**
 * Set up all config variables on server
 */

/**
 * Run the Factor server
 */

export class FactorServer extends FactorPlugin<types.FactorServerSettings> {
  types = types
  public hooks: HookType<types.HookDictionary>[]
  constructor(settings: types.FactorServerSettings) {
    super(settings)
    this.hooks = settings.hooks ?? []
  }

  async setup(): Promise<UserConfig> {
    return {
      hooks: [
        {
          hook: "afterConfigCreated",
          callback: async (userConfig: UserConfig) => {
            await this.createServer({ userConfig })
          },
        },
      ],
      service: [
        {
          key: "server",
          run: async (runConfig: RunConfig) => {
            await this.createServer({ userConfig: runConfig.userConfig })
          },
        },
      ],
    }
  }

  createServer = async (params: {
    userConfig?: UserConfig
  }): Promise<UserConfig> => {
    const { userConfig = {} } = params

    await this.utils.runHooks({
      list: this.hooks,
      hook: "afterServerSetup",
    })

    await this.createEndpointServer(userConfig)

    await this.utils.runHooks({
      list: this.hooks,
      hook: "afterServerCreated",
    })

    return userConfig
  }

  createEndpointServer = async (
    userConfig: UserConfig,
  ): Promise<http.Server | undefined> => {
    const { endpoints = [], port } = userConfig

    if (!port) throw new Error("port is required")

    try {
      const factorEndpointServer = new EndpointServer({
        name: "factor",
        port,
        endpoints,
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
