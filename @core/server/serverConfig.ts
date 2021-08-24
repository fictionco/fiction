import { UserConfigServer } from "@factor/types"
import { dotSetting, setupPlugins } from "@factor/api"
import { nLog } from "@factor/server-utils"
let __serverConfig: UserConfigServer
export const setServerConfig = async (
  config: UserConfigServer,
): Promise<UserConfigServer> => {
  if (config.plugins) {
    try {
      config = await setupPlugins(config)
    } catch (error) {
      nLog("error", error.message, error)
    }
  }

  __serverConfig = config

  return config
}

export const getServerConfig = (): UserConfigServer => {
  return __serverConfig
}

export const serverConfigSetting = <T = unknown>(
  key: keyof UserConfigServer,
): T | undefined => {
  return dotSetting<T>({ key, settings: getServerConfig() ?? {} })
}
