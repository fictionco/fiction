import { UserConfigServer } from "@factor/types"
import { dotSetting, setupPlugins } from "@factor/api"
import { logger } from "@factor/server-utils/serverLogger"

let __serverConfig: UserConfigServer | undefined

export const setServerConfig = async (
  config: UserConfigServer,
): Promise<UserConfigServer> => {
  if (config.plugins) {
    try {
      config = await setupPlugins(config)
    } catch (error: unknown) {
      const e = error as Error
      logger({
        level: "error",
        description: e.message,
        context: "server",
        data: error,
      })
    }
  }

  __serverConfig = config

  return config
}

export const getServerConfig = (): UserConfigServer | undefined => {
  return __serverConfig
}

export const serverConfigSetting = <T extends keyof UserConfigServer>(
  key: T,
): UserConfigServer[T] => {
  return dotSetting({ key, settings: getServerConfig() ?? {} })
}
