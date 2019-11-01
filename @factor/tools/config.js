import fs from "fs"

import { deepMerge, addFilter } from "@factor/tools"
import { getPath } from "@factor/tools/paths"

// setup needed process variables to act like they do on the server
addFilter("webpack-define", async __ => {
  __["process.env.NODE_ENV"] = JSON.stringify(process.env.NODE_ENV)
  __["process.env.FACTOR_ENV"] = JSON.stringify(process.env.FACTOR_ENV)
  __["process.env.PORT"] = JSON.stringify(process.env.PORT)
  __["process.env.HTTP_PROTOCOL"] = JSON.stringify(process.env.HTTP_PROTOCOL)
  __["process.env.FACTOR_COMMAND"] = JSON.stringify(process.env.FACTOR_COMMAND)
  __["process.env.FACTOR_APP_CONFIG"] = JSON.stringify(await configSettings())
  return __
})

export async function configSettings() {
  const configFile = getPath(`config-file-public`)

  const configImport = fs.existsSync(configFile) ? import(configFile) : {}

  const [config, { factor = {} }] = await Promise.all([
    configImport,
    import(`${process.env.FACTOR_CWD}/package.json`)
  ])

  return deepMerge([factor, config])
}
