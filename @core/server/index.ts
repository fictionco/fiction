import { runHooks, deepMergeAll } from "@factor/api"

import { importServerEntry } from "@factor/engine/nodeUtils"
import { setAppGlobals, getFactorConfig } from "./globals"

import { initializeDb } from "@factor/engine/db"
import { createEndpointServer } from "./create"
import { endpoints } from "./endpoint"
import { setServerConfig } from "./config"
import { UserConfigServer } from "@factor/types"

export const setupServerEnv = async (
  entryServerConfig: UserConfigServer = {},
): Promise<UserConfigServer> => {
  /**
   * Set initial globals (this will run again after extension)
   */
  await setAppGlobals(entryServerConfig)

  /**
   * Sets config for access throughout app
   */
  const serverConfig = await setServerConfig(entryServerConfig)
  /**
   * Set globals again with any plugin stuff
   */
  await setAppGlobals(serverConfig)

  return serverConfig
}
/**
 * Set up all config variables on server
 */
export const setupEnvironment = async (
  entryServerConfig: UserConfigServer,
): Promise<void> => {
  const serverConfig = await setupServerEnv(entryServerConfig)

  await initializeDb()

  await runHooks({
    hook: "afterServerSetup",
    config: serverConfig,
    args: [],
  })

  if (serverConfig.endpointPort) {
    await createEndpointServer(serverConfig)
  }

  await runHooks({
    hook: "afterServerCreated",
    config: serverConfig,
    args: [],
  })
}
/**
 * Run the Factor server
 */
export const setup = async (): Promise<void> => {
  const appConfig = await getFactorConfig({
    endpoints,
    endpointPort: 3210,
  })

  const merge: UserConfigServer[] = [appConfig]

  /**
   * Require app server entry file if it exists
   */
  const entryServerConfig = await importServerEntry()

  if (entryServerConfig) {
    merge.unshift(entryServerConfig)
  }

  const mergedServerConfig: UserConfigServer = deepMergeAll(merge)

  await setupEnvironment(mergedServerConfig)

  return
}
