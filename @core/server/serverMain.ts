import { runHooks, deepMergeAll } from "@factor/api"

import { importServerEntry } from "@factor/server-utils/serverPaths"
import { setAppGlobals } from "@factor/server-utils/serverGlobals"

import { initializeDb } from "./serverDb"
import { createEndpointServer } from "./serverEndpoint"
import { userEndpoint } from "./user/serverUser"
import { setServerConfig } from "./serverConfig"
import { UserConfigServer } from "@factor/types"

/**
 * Set up all config variables on server
 */
export const setupEnvironment = async (
  entryServerConfig: UserConfigServer,
): Promise<void> => {
  /**
   * Set initial globals (this will run again after extension)
   */
  await setAppGlobals()

  /**
   * Sets config for access throughout app
   */
  const serverConfig = await setServerConfig(entryServerConfig)
  /**
   * Set globals again with any plugin stuff
   */
  await setAppGlobals(serverConfig)
  /**
   * Load libraries
   */
  await initializeDb()
  /**
   * Allow hooks
   */
  await runHooks({
    hook: "afterServerSetup",
    config: serverConfig,
    args: [],
  })
  /**
   * Create the server
   */
  if (serverConfig.endpointPort) {
    await createEndpointServer(serverConfig)
  }
  /**
   * Allow hooks
   */
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
  const merge: UserConfigServer[] = [
    { endpoints: [userEndpoint], endpointPort: 3210 },
  ]

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
