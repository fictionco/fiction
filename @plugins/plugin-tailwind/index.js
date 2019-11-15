import { pushToFilter } from "@factor/tools"
import tailwindCSS from "tailwindcss"
import { setting } from "@factor/tools/settings"
import { resolve } from "path"

const cwd = process.env.FACTOR_CWD || process.cwd()

// If tailwind.config is in CWD prefer that, otherwise use the one in the plugin
// optionally overridden by a setting (allows for change of name)
let config
try {
  config = require.resolve(resolve(cwd, "tailwind.config"))
} catch (error) {
  if (error.code == "MODULE_NOT_FOUND") {
    config = setting("tailwind.config")
  } else throw new Error(error)
}

pushToFilter("postcss-plugins", tailwindCSS(config))
