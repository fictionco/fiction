import { setupRouter } from "../router"
import { MainFile, UserConfig } from "../types"
import { runHooks } from "./hook"
import { setUserConfig } from "./plugins"

export const setupApp = async (params: {
  userConfig: UserConfig
  isSSR?: boolean
}): Promise<UserConfig> => {
  const { isSSR } = params

  const userConfig = await setUserConfig(params.userConfig, { isServer: false })

  if (userConfig.routes) {
    setupRouter(userConfig.routes)
  }

  await runHooks("afterAppSetup", { userConfig, isSSR })

  return userConfig
}

export const setupAppFromMainFile = async (params: {
  mainFile?: MainFile
  isSSR?: boolean
}): Promise<UserConfig> => {
  const { mainFile = {}, isSSR } = params

  let userConfig: UserConfig = {}
  // run the app main file
  if (mainFile.setup) {
    userConfig = await mainFile.setup()
  }

  return await setupApp({ userConfig, isSSR })
}
