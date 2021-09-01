import { UserConfigServer } from "@factor/types"
import { dotSetting, setupPlugins } from "@factor/api"
import { logger } from "@factor/server-utils"
let __serverConfig: UserConfigServer
export const setServerConfig = async (
  config: UserConfigServer,
): Promise<UserConfigServer> => {
  if (config.plugins) {
    try {
      config = await setupPlugins(config)
    } catch (error: any) {
      logger({
        level: "error",
        description: error.message,
        context: "server",
        data: error,
      })
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
