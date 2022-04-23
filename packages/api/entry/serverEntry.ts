import http from "http"
import bodyParser from "body-parser"
import { UserConfig } from "../config/types"
import { HookType, runHooks } from "../utils/hook"
import type { RunConfig } from "../cli/utils"

import { log } from "../logger"
import { EndpointServer } from "../engine/endpointServer"
import { FactorPlugin } from "../config"

export const createEndpointServer = async (
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
    log.error("createEndpointServer", `error creating factor server`, { error })
  }

  return
}

/**
 * Set up all config variables on server
 */
export const createServer = async (params: {
  userConfig: UserConfig
}): Promise<UserConfig> => {
  const { userConfig } = params

  await runHooks({ list: userConfig.hooks, hook: "afterServerSetup" })

  await createEndpointServer(userConfig)

  await runHooks({ list: userConfig.hooks, hook: "afterServerCreated" })

  return params.userConfig
}
/**
 * Run the Factor server
 */
export const setup = async (options: RunConfig): Promise<UserConfig> => {
  return await createServer({ userConfig: options.userConfig ?? {} })
}

export type HookDictionary = {
  afterServerSetup: { args: [] }
  afterServerCreated: { args: [] }
}

type FactorServerSettings = {
  hooks: HookType<HookDictionary>
}

export class FactorServer extends FactorPlugin<FactorServerSettings> {
  public hooks: HookType<types.HookDictionary>[]
  constructor(settings: FactorServerSettings) {
    super(settings)
  }
}
