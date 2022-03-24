import { UserConfig } from "@factor/types"
import { dotSetting, logger, storeItem, stored } from "@factor/api"
import { installPlugins } from "@factor/engine/plugins"

export const setServerConfig = async (
  config: UserConfig,
): Promise<UserConfig> => {
  if (config.plugins) {
    try {
      config = await installPlugins({ userConfig: config, isServer: true })
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

export const getServerConfig = (): UserConfig | undefined => {
  return stored("serverConfig")
}

export const serverConfigSetting = <T extends keyof UserConfig>(
  key: T,
): UserConfig[T] => {
  return dotSetting({ key, settings: getServerConfig() ?? {} })
}
