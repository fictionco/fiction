import http from "http"
import bodyParser from "body-parser"
import { UserConfig } from "../config/types"
import { initializeDb } from "../plugin-db/db"
import { runHooks } from "../config/hook"
import type { RunConfig } from "../cli/utils"

import { log } from "../logger"
import { EndpointServer } from "../engine/endpointServer"

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
  await initializeDb()

  await runHooks("afterServerSetup")

  await createEndpointServer(userConfig)

  await runHooks("afterServerCreated")

  return params.userConfig
}
/**
 * Run the Factor server
 */
export const setup = async (options: RunConfig): Promise<UserConfig> => {
  return await createServer({ userConfig: options.userConfig ?? {} })
}
