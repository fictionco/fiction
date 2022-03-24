import { UserConfig } from "@factor/types"
import { deepMergeAll, omit } from "@factor/api"

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
