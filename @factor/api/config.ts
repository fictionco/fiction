import fs from "fs"
import { deepMerge } from "@factor/api/utils"
import { getPath } from "@factor/api/paths"

/**
 * Gets the basic configuration of an application using package.json, factor-config
 * @param cwd - The directory of the application to get config from
 * @returns The deep merged configuration
 */
export const configSettings = (cwd?: string): object => {
  const workingDirectory = cwd ? cwd : process.env.FACTOR_CWD || process.cwd()

  const configFile = getPath(`config-file-public`, workingDirectory)

  const config = fs.existsSync(configFile) ? require(configFile) : {}

  const { factor = {}, ...rest } = require(`${workingDirectory}/package.json`)

  return deepMerge([{ package: rest }, factor, config])
}
