import { deepMerge } from "@factor/api/utils"

/**
 * Gets the basic configuration of an application using package.json, factor-config
 * @param cwd - The directory of the application to get config from
 * @returns The deep merged configuration
 */
export const configSettings = (cwd?: string): Record<string, any> => {
  const workingDirectory = cwd ? cwd : process.env.FACTOR_CWD || process.cwd()

  const locale = process.env.FACTOR_LOCALE

  const { factor, ...rest } = require(`${workingDirectory}/package.json`)

  // If installed is set in 'factor' property then make it override
  // It will get removed on actual install
  const factorConfig = factor ? { installed: true, ...factor } : {}

  const out = deepMerge([{ package: rest }, locale, factorConfig])

  return out
}
