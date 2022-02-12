import { UserConfigServer } from "@factor/types"
import {
  dotSetting,
  setupPlugins,
  logger,
  storeItem,
  stored,
} from "@factor/api"

export const setServerConfig = async (
  config: UserConfigServer,
): Promise<UserConfigServer> => {
  if (config.plugins) {
    try {
      config = await setupPlugins(config)
    } catch (error: unknown) {
      const e = error as Error
      logger.log({
        level: "error",
        description: e.message,
        context: "server",
        data: error,
      })
    }
  }

  storeItem("serverConfig", config)

  return config
}

export const getServerConfig = (): UserConfigServer | undefined => {
  return stored("serverConfig")
}

export const serverConfigSetting = <T extends keyof UserConfigServer>(
  key: T,
): UserConfigServer[T] => {
  return dotSetting({ key, settings: getServerConfig() ?? {} })
}
