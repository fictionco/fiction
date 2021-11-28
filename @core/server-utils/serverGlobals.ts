import path from "path"
import { importIfExists } from "./serverPaths"
import { deepMergeAll } from "@factor/api"
import { UserConfigServer } from "@factor/types"

import { createRequire } from "module"
const require = createRequire(import.meta.url)

const getDefaultServerVariables = (): Record<string, string> => {
  return {
    FACTOR_APP_NAME: "",
    FACTOR_APP_EMAIL: "",
    FACTOR_APP_URL: "",
    FACTOR_SERVER_URL: "",
    NODE_ENV: process.env.NODE_ENV || "",
  }
}

export const packageConfig = (): Record<string, any> => {
  return require(path.join(process.cwd(), "package.json"))
}

export const getFactorConfig = async (
  config: UserConfigServer = {},
): Promise<UserConfigServer> => {
  const { factor = {} } = packageConfig()

  const result = await importIfExists<{
    default: UserConfigServer
  }>(path.join(process.cwd(), "factor.config.ts"))

  const configFile = result?.default || {}
  return deepMergeAll([
    { variables: getDefaultServerVariables() },
    factor,
    configFile,
    config,
  ])
}

export const setAppGlobals = async (
  config: UserConfigServer = {},
): Promise<Record<string, string>> => {
  const { variables = {} } = await getFactorConfig(config)

  Object.entries(variables).forEach(([key, value]) => {
    const finalValue = process.env[key] || value
    variables[key] = finalValue
    process.env[key] = finalValue
  })

  return variables
}
