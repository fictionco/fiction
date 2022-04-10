import { setupRouter } from "../router"
import { MainFile, UserConfig } from "../types"
import { runHooks } from "./hook"
import { setUserConfig } from "./plugins"

export const setupApp = async (userConfig: UserConfig): Promise<UserConfig> => {
  userConfig = await setUserConfig(userConfig, { isServer: false })

  if (userConfig.routes) {
    setupRouter(userConfig.routes)
  }

  await runHooks("afterAppSetup", userConfig)

  return userConfig
}

export const setupAppFromMainFile = async (params: {
  mainFile?: MainFile
}): Promise<UserConfig> => {
  const { mainFile = {} } = params

  let userConfig: UserConfig = {}
  // run the app main file
  if (mainFile.setup) {
    userConfig = await mainFile.setup()
  }

  return await setupApp(userConfig)
}
