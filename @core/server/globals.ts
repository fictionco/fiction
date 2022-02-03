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
    NODE_ENV: process.env.NODE_ENV || "",
  }
}

export const getFactorConfig = async (
  initialConfig?: UserConfigServer,
): Promise<UserConfigServer> => {
  const configPath = process.cwd()

  const result = await importIfExists<{
    default: UserConfigServer
  }>(path.join(configPath, "factor.config.ts"))

  const configFile = result?.default || {}
  return deepMergeAll([
    { variables: getDefaultServerVariables() },
    configFile,
    initialConfig,
  ])
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
