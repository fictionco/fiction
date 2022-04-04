import {
  deepMergeAll,
  omit,
  dotSetting,
  logger,
  storeItem,
  stored,
} from "@factor/api"

import { UserConfig } from "@factor/types"

export const installPlugins = async (params: {
  userConfig: UserConfig
  isServer: boolean
}): Promise<UserConfig> => {
  const { userConfig, isServer } = params
  const { plugins = [] } = userConfig
  const config: UserConfig[] = [userConfig]
  if (plugins.length > 0) {
    for (const plugin of plugins) {
      const pluginConfig = (await plugin) ?? {}

      const c = omit(pluginConfig, "server", "name")

      config.push(c)

      try {
        if (isServer && pluginConfig.server) {
          const r = await pluginConfig.server()

          if (r) config.push(r)
        }
      } catch (error: unknown) {
        const e = error as Error
        e.message = `plugin setup error (${pluginConfig.name ?? "unknown"}): ${
          e.message
        }`
        throw e
      }
    }
  }

  const r = deepMergeAll<UserConfig>(config)

  delete r.plugins
  delete r.server

  return r
}

export const setUserConfig = async (
  config: UserConfig,
  options?: { isServer?: boolean },
): Promise<UserConfig> => {
  const { isServer = false } = options || {}
  if (config.plugins) {
    try {
      config = await installPlugins({ userConfig: config, isServer })
    } catch (error: unknown) {
      const e = error as Error
      logger.log({
        level: "error",
        description: e.message,
        context: "setUserConfig",
        error,
      })
    }
  }

  config = {
    port: process.env.FACTOR_SERVER_PORT || process.env.PORT,
    portApp: process.env.FACTOR_APP_PORT || process.env.PORT_APP,
    ...config,
  }

  storeItem("userConfig", config)

  return config
}

export const getUserConfig = (): UserConfig | undefined => {
  return stored("userConfig")
}

export const userConfigSetting = <T extends keyof UserConfig>(
  key: T,
): UserConfig[T] => {
  return dotSetting({ key, settings: getUserConfig() ?? {} })
}
