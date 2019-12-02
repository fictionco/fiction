import fs from "fs"
import { deepMerge } from "@factor/tools/utils"
import { getPath } from "@factor/tools/paths"

export function configSettings() {
  const cwd = process.env.FACTOR_CWD || process.cwd()

  const configFile = getPath(`config-file-public`)

  const config = fs.existsSync(configFile) ? require(configFile) : {}

  const { factor = {} } = require(`${cwd}/package.json`)

  return deepMerge([factor, config])
}
