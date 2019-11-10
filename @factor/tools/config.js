import fs from "fs"
import { addFilter } from "@factor/tools/filters"
import { deepMerge } from "@factor/tools/utils"
import { getPath } from "@factor/tools/paths"

// setup needed process variables to act like they do on the server
addFilter("webpack-define", async __ => {
  __["process.env.NODE_ENV"] = JSON.stringify(process.env.NODE_ENV)
  __["process.env.FACTOR_ENV"] = JSON.stringify(process.env.FACTOR_ENV)
  __["process.env.PORT"] = JSON.stringify(process.env.PORT)
  __["process.env.HTTP_PROTOCOL"] = JSON.stringify(process.env.HTTP_PROTOCOL)
  __["process.env.FACTOR_COMMAND"] = JSON.stringify(process.env.FACTOR_COMMAND)
  __["process.env.FACTOR_APP_CONFIG"] = JSON.stringify(configSettings())

  return __
})

export function configSettings() {
  const cwd = process.env.FACTOR_CWD || process.cwd()

  const configFile = getPath(`config-file-public`)
  // @ts-ignore
  const config = fs.existsSync(configFile) ? require(configFile) : {}

  const { factor = {} } = require(`${cwd}/package.json`)

  return deepMerge([factor, config])
}
