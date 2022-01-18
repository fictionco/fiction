import { DataProcessor, UserConfigApp, UserConfigServer } from "@factor/types"
import { deepMergeAll } from "./utils"
import { omit } from "@factor/api"
export type AppPlugin = {
  install: (options: Record<string, any>) => void | Promise<void>
}

// type OptionType<T> = T extends {
//   install: (option: infer R) => void | Promise<void>
// }
//   ? R
//   : Record<string, any>

/**
 * Install a Factor application plugin
 */
// export const installPlugin = <T extends AppPlugin = AppPlugin>(
//   plugin: T,
//   options: Partial<OptionType<T>> = {},
// ): void => {
//   plugin.install(options)
// }

type UserConfig = UserConfigApp | UserConfigServer
export const setupPlugins = async (
  userConfig: UserConfig,
): Promise<UserConfig> => {
  const { plugins = [] } = userConfig
  const config: UserConfig[] = [userConfig]
  if (plugins.length > 0) {
    for (const plugin of plugins) {
      const pluginConfig = (await plugin) ?? {}

      const c = omit(pluginConfig, "setup", "name")

      config.push(c)

      try {
        if (pluginConfig.setup) {
          const r = await pluginConfig.setup<UserConfig>()

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

  return r
}

export const runProcessors = async <T = unknown>(
  processors: DataProcessor<T>[],
  initial: T,
  meta: Record<string, any>,
): Promise<T> => {
  const callbacks = processors.map((_) => _.handler)

  let result = initial
  if (callbacks.length > 0) {
    for (const cb of callbacks) {
      result = await cb(result, meta)
    }
  }

  return result
}
