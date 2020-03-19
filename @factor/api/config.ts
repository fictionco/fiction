import { deepMerge } from "@factor/api/utils"

/**
 * Gets the basic configuration of an application using package.json, factor-config
 * @param cwd - The directory of the application to get config from
 * @returns The deep merged configuration
 */
export const configSettings = (cwd?: string): Record<string, any> => {
  const workingDirectory = cwd ? cwd : process.env.FACTOR_CWD || process.cwd()

  const { factor, ...rest } = require(`${workingDirectory}/package.json`)

  const factorConfig = factor ? { ...factor, installed: true } : {}

  const out = deepMerge([{ package: rest }, factorConfig])

  return out
}
