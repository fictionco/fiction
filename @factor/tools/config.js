import fs from "fs"
import dotenv from "dotenv"
import { resolve } from "path"
import { deepMerge, addFilter } from "@factor/tools"
import { getPath, localhostUrl } from "@factor/tools/paths"

dotenv.config({ path: resolve(getPath("app"), ".env") })

addFilter("webpack-define", async __ => {
  __["process.env.NODE_ENV"] = JSON.stringify(process.env.NODE_ENV)
  __["process.env.FACTOR_ENV"] = JSON.stringify(process.env.FACTOR_ENV)
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

  const merged = deepMerge([factor, config])

  const calculated = _calculatedConfig(merged)

  return deepMerge([merged, calculated])
}

function _calculatedConfig({ url }) {
  const currentUrl = process.env.NODE_ENV == "development" || !url ? localhostUrl() : url

  return { currentUrl }
}
