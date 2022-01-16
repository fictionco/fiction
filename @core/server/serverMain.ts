import { runCallbacks, deepMergeAll } from "@factor/api"
import {
  importIfExists,
  sourceFolder,
  setAppGlobals,
} from "@factor/server-utils"
import path from "path"
import { initializeDb } from "./serverDb"
import { createEndpointServer } from "./serverEndpoint"
import { userEndpoint } from "./user/serverUser"
import { setServerConfig } from "./serverConfig"
import { UserConfigServer } from "@factor/types"

/**
 * Run the Factor server
 */
export const setup = async (): Promise<void> => {
  /**
   * Require app server entry file if it exists
   */
  const serverEntry = await importIfExists<{ setup?: () => UserConfigServer }>(
    path.join(sourceFolder(), "server.ts"),
  )

  const merge: UserConfigServer[] = [{ endpoints: [userEndpoint] }]

  if (serverEntry?.setup) {
    merge.unshift(serverEntry.setup())
  }

  const initialServerConfig: UserConfigServer = deepMergeAll(merge)

  /**
   * Sets config for access throughout app
   */
  const serverConfig = await setServerConfig(initialServerConfig)

  await setAppGlobals(serverConfig)

  /**
   * Load libraries
   */

  await initializeDb()

  /**
   * Allow hooks
   */
  await runCallbacks("afterServerSetup")
  /**
   * Create the server
   */
  await createEndpointServer(serverConfig)
  /**
   * Allow hooks
   */
  await runCallbacks("afterServerCreated")

  return
}
