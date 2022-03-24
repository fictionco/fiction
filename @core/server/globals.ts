import path from "path"
import { importIfExists } from "@factor/engine/nodeUtils"
import { deepMergeAll } from "@factor/api"
import { UserConfig } from "@factor/types"

const getDefaultServerVariables = (): Record<string, string> => {
  return {
    FACTOR_APP_NAME: "",
    FACTOR_APP_EMAIL: "",
    FACTOR_APP_URL: "",
    FACTOR_SERVER_URL: "",
    FACTOR_SERVER_PORT: "",
    FACTOR_APP_PORT: "",
    NODE_ENV: process.env.NODE_ENV || "",
    TEST_ENV: "",
    HTTP_PROTOCOL: "",
  }
}

/**
 * This runs multiple times, variables from config are public
 * and the full added list should be returned
 */
const __variables: Record<string, string> = {}
export const setAppGlobals = async (
  config: UserConfig = {},
): Promise<Record<string, string>> => {
  const { variables = {} } = config

  Object.entries(variables).forEach(([key, value]) => {
    const finalValue = process.env[key]
      ? String(process.env[key])
      : typeof value == "object"
      ? JSON.stringify(value)
      : String(value)

    __variables[key] = process.env[key] = finalValue
  })

  return __variables
}

export const getFactorConfig = async (params: {
  config?: UserConfig
  moduleName?: string
  cwd?: string
}): Promise<UserConfig> => {
  const { config, moduleName, cwd } = params

  const configPath = cwd
    ? cwd
    : moduleName
    ? path.dirname(require.resolve(`${moduleName}/package.json`))
    : process.cwd()

  const result = await importIfExists<{
    default: UserConfig
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
