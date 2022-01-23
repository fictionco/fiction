import path from "path"
import { importIfExists } from "./serverPaths"
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
  config: UserConfigServer = {},
): Promise<UserConfigServer> => {
  const result = await importIfExists<{
    default: UserConfigServer
  }>(path.join(process.cwd(), "factor.config.ts"))

  const configFile = result?.default || {}
  return deepMergeAll([
    { variables: getDefaultServerVariables() },
    configFile,
    config,
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
  const { variables = {} } = await getFactorConfig(config)

  Object.entries(variables).forEach(([key, value]) => {
    const finalValue = process.env[key] || value
    __variables[key] = finalValue
    process.env[key] = finalValue
  })

  return __variables
}
