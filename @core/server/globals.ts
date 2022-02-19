import path from "path"
import { importIfExists } from "@factor/engine/nodeUtils"
import { deepMergeAll } from "@factor/api"
import { UserConfigServer } from "@factor/types"

const getDefaultServerVariables = (): Record<string, string> => {
  return {
    FACTOR_APP_NAME: "",
    FACTOR_APP_EMAIL: "",
    FACTOR_APP_URL: "",
    FACTOR_SERVER_URL: "",
    FACTOR_SERVER_PORT: "",
    FACTOR_APP_PORT: "",
    NODE_ENV: process.env.NODE_ENV || "",
  }
}

/**
 * This runs multiple times, variables from config are public
 * and the full added list should be returned
 */
const __variables: Record<string, string> = {}
export const setAppGlobals = async (
  config: UserConfigServer = {},
): Promise<Record<string, string>> => {
  const { variables = {} } = config

  Object.entries(variables).forEach(([key, value]) => {
    const finalValue = process.env[key]
      ? String(process.env[key])
      : typeof value == "object"
      ? JSON.stringify(value)
      : String(value)

    __variables[key] = finalValue
    process.env[key] = finalValue
  })

  return __variables
}

export const getFactorConfig = async (params: {
  config?: UserConfigServer
  moduleName?: string
}): Promise<UserConfigServer> => {
  const { config, moduleName } = params

  const configPath = moduleName
    ? path.dirname(require.resolve(`${moduleName}/package.json`))
    : process.cwd()

  const result = await importIfExists<{
    default: UserConfigServer
  }>(path.join(configPath, "factor.config.ts"))

  const configFile = result?.default || {}
  const baseConfig = deepMergeAll([
    { variables: getDefaultServerVariables() },
    configFile,
    config,
  ])

  await setAppGlobals(baseConfig)

  return baseConfig
}
