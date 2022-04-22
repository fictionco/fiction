import { importIfExists, getMainFilePath } from "../engine/nodeUtils"
import { deepMergeAll } from "../utils"
import { omit, log } from ".."

import { storeUserConfig } from "./plugins"
import { UserConfig, MainFile } from "./types"

type WhichModule = {
  moduleName?: string
  cwd?: string
  mainFilePath?: string
}

/**
 * Generate static files, note that this uses server-only utilities
 * @server
 */
const generateFiles = async (userConfig: UserConfig): Promise<void> => {
  const { generateStaticConfig } = await import("./generate")

  await generateStaticConfig(userConfig)
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
      const pluginConfig = (await plugin) ?? {}

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

export const handleCrossEnv = (
  userConfig?: UserConfig,
): UserConfig & {
  port: string
  portApp: string
  serverUrl: string
  appUrl: string
  mode: "development" | "production"
} => {
  const {
    FACTOR_SERVER_PORT,
    FACTOR_APP_PORT,
    FACTOR_SERVER_URL,
    FACTOR_APP_URL,
    PORT,
    PORT_APP,
    NODE_ENV,
  } = process.env

  const vars: Record<string, string | undefined> = {
    FACTOR_SERVER_PORT,
    FACTOR_APP_PORT,
    FACTOR_SERVER_URL,
    FACTOR_APP_URL,
    PORT,
    PORT_APP,
    NODE_ENV,
  }

  // check for stringified 'undefined'
  Object.entries(vars).forEach(([k, v]) => {
    if (v === "undefined" && vars[k]) {
      console.error('string "undefined" found in env var, use "null" instead')
      delete vars[k]
    }
  })

  const port =
    userConfig?.port || vars.FACTOR_SERVER_PORT || vars.PORT || "3333"

  const portApp =
    userConfig?.portApp || vars.FACTOR_APP_PORT || vars.PORT_APP || "3000"

  const serverUrl =
    userConfig?.serverUrl ||
    vars.FACTOR_SERVER_URL ||
    `http://localhost:${port}`

  const appUrl = process.env.FACTOR_APP_URL || `http://localhost:${portApp}`

  const mode = userConfig?.mode || vars.NODE_ENV || "production"

  process.env.FACTOR_SERVER_PORT = port
  process.env.FACTOR_SERVER_URL = serverUrl
  process.env.FACTOR_APP_PORT = portApp
  process.env.FACTOR_APP_URL = appUrl

  return {
    ...userConfig,
    port,
    portApp,
    serverUrl,
    appUrl,
    mode: mode as "development" | "production",
  }
}

export const createUserConfig = async (params: {
  mainFile: MainFile
  isApp: boolean
  userConfig?: UserConfig
}): Promise<UserConfig> => {
  const { mainFile, isApp } = params
  let { userConfig } = params

  userConfig = handleCrossEnv(userConfig)

  // get universal setup
  const entryConfig = mainFile?.setup ? await mainFile.setup(userConfig) : {}

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
      log.error("createUserConfig", "plugin install error", { error })
    }
  }

  if (!isApp && userConfig.generateStaticConfig) {
    generateFiles(userConfig).catch(console.error)
  }

  userConfig = await storeUserConfig(userConfig)

  return userConfig
}

export const getServerMainFile = async (
  params: WhichModule,
): Promise<MainFile> => {
  const mainFilePath = params.mainFilePath ?? getMainFilePath(params)
  const mod = await importIfExists<MainFile>(mainFilePath)

  return mod ?? {}
}

export const getServerUserConfig = async (
  params: WhichModule & { userConfig?: UserConfig },
): Promise<UserConfig> => {
  const mainFile = await getServerMainFile(params)

  const userConfig = await createUserConfig({
    mainFile,
    isApp: false,
    userConfig: params.userConfig,
  })

  return userConfig
}
