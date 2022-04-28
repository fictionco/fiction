import {
  getMainFilePath,
  deepMergeAll,
  storeItem,
  omit,
} from "@factor/api/utils"
import { log } from "../logger"
import { UserConfig, MainFile } from "./types"
import type { FactorEnv } from "."

type WhichModule = {
  moduleName?: string
  cwd?: string
  mainFilePath?: string
}

export const storeUserConfig = async (
  userConfig: UserConfig,
): Promise<UserConfig> => {
  storeItem("userConfig", userConfig)

  return userConfig
}

/**
 * Generate static files, note that this uses server-only utilities
 * @server
 */
const generateFiles = async (factorEnv: FactorEnv<string>): Promise<void> => {
  const { generateStaticConfig } = await import("./generate")

  await generateStaticConfig(factorEnv)
}

export const installPlugins = async (params: {
  userConfig: UserConfig
  isApp: boolean
}): Promise<UserConfig> => {
  const { userConfig, isApp } = params
  const { plugins = [] } = userConfig
  const config: UserConfig[] = [userConfig]
  if (plugins.length > 0) {
    for (const plugin of plugins) {
      const pluginConfig = await plugin.setup()

      const c = omit(pluginConfig, "server", "name")

      config.push(c)

      try {
        if (!isApp && pluginConfig.server) {
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

export const compileApplication = async (params: {
  mainFilePath?: string
  isApp: boolean
  userConfig?: UserConfig
}): Promise<{ userConfig: UserConfig; mainFile: MainFile }> => {
  let { userConfig } = params

  const { mainFilePath, isApp } = params

  let mainFile: MainFile | undefined = undefined

  /**
   * In the app, use aliased path so rollup/vite can analyze it
   * If not app, a dynamic path is fine, but tell vite to ignore or it will print a warning
   */
  if (isApp) {
    // @ts-ignore
    // eslint-disable-next-line import/no-unresolved
    mainFile = (await import("@MAIN_FILE_ALIAS")) as MainFile
  } else if (mainFilePath) {
    mainFile = (await import(/* @vite-ignore */ mainFilePath)) as MainFile
  }

  if (!mainFile) throw new Error("no mainFile")

  let entryConfig: UserConfig = {}
  if (mainFile) {
    // get universal setup
    entryConfig = mainFile?.setup ? await mainFile.setup(userConfig || {}) : {}
  }

  const merge = [userConfig, entryConfig]

  if (!isApp && entryConfig.server) {
    // get server specific config from main files
    const serverConfig = await entryConfig.server()

    merge.push(serverConfig ?? {})
  }

  merge.push(params.userConfig ?? {})

  const merged = deepMergeAll<UserConfig>(merge)

  delete merged.server

  userConfig = merged

  if (userConfig.plugins) {
    try {
      userConfig = await installPlugins({ userConfig, isApp })
    } catch (error: unknown) {
      log.error("compileApplication", "plugin install error", { error })
    }
  }

  if (!isApp && mainFile.factorEnv) {
    await generateFiles(mainFile.factorEnv)
  }

  userConfig = await storeUserConfig(userConfig)

  return { userConfig, mainFile }
}

export const getServerUserConfig = async (
  params: WhichModule & { userConfig?: UserConfig },
): Promise<UserConfig> => {
  const mainFilePath = params.mainFilePath ?? getMainFilePath(params)

  const { userConfig } = await compileApplication({
    mainFilePath,
    isApp: false,
    userConfig: params.userConfig,
  })

  return userConfig
}
