import { importIfExists, getMainFilePath } from "../engine/nodeUtils"
import { deepMergeAll } from "../utils"
import { omit, log } from ".."
import { setAppGlobals } from "./globals"
import { setUserConfig } from "./plugins"
import { UserConfig, MainFile } from "./types"

type WhichModule = {
  moduleName?: string
  cwd?: string
  mainFilePath?: string
}

const getDefaultServerVariables = (): Record<string, string> => {
  return {
    FACTOR_SERVER_URL: "",
    FACTOR_APP_URL: "",
    NODE_ENV: process.env.NODE_ENV || "",
    TEST_ENV: "",
  }
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

const handleCrossEnv = (userConfig?: UserConfig): UserConfig => {
  const port =
    userConfig?.port ||
    process.env.FACTOR_SERVER_PORT ||
    process.env.PORT ||
    "3333"
  process.env.FACTOR_SERVER_PORT = port

  const portApp =
    userConfig?.portApp ||
    process.env.FACTOR_APP_PORT ||
    process.env.PORT_APP ||
    "3000"

  process.env.FACTOR_APP_PORT = portApp

  const serverUrl =
    userConfig?.serverUrl ||
    process.env.FACTOR_SERVER_URL ||
    `http://localhost:${port}`

  process.env.FACTOR_SERVER_URL = serverUrl

  const appUrl = process.env.FACTOR_APP_URL || `http://localhost:${portApp}`

  process.env.FACTOR_APP_URL = appUrl

  const mode =
    userConfig?.mode ||
    (process.env.NODE_ENV as "development" | "production") ||
    "production"

  return { ...userConfig, port, portApp, serverUrl, appUrl, mode }
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
    // set default variables in server
    merge.unshift({ variables: getDefaultServerVariables() })

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
      const e = error as Error
      log.error("setUserConfig", e.message, { error })
    }
  }

  if (!isApp) {
    // Set initial globals (this will run again after extension)
    userConfig.variables = await setAppGlobals(userConfig)

    // Sets config for access throughout app
    userConfig = await setUserConfig(userConfig)

    // Set globals again with any plugin stuff
    userConfig.variables = await setAppGlobals(userConfig)

    if (userConfig.generateStaticConfig) {
      generateFiles(userConfig).catch(console.error)
    }
  } else {
    userConfig = await setUserConfig(userConfig)
  }

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
