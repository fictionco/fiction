import { UserConfig } from "./types"

/**
 * This runs multiple times, variables from config are public
 * and the full added list should be returned
 */
const __variables: Record<string, string> = {}
export const getCrossEnvVariables = async (
  config: UserConfig = {},
): Promise<Record<string, string>> => {
  const { variables = {} } = config

  Object.entries(variables).forEach(([key, value]) => {
    const setVal = process.env[key]
      ? process.env[key]
      : typeof value == "object"
      ? JSON.stringify(value)
      : value

    const finalValue = setVal ? String(setVal) : ""

    __variables[key] = process.env[key] = finalValue
  })

  return __variables
}
