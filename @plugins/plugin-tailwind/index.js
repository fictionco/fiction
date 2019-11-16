import { addFilter } from "@factor/tools"
import tailwindCSS from "tailwindcss"
import { setting } from "@factor/tools/settings"
import { resolve } from "path"
import purgeCssUtility from "@fullhuman/postcss-purgecss"

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

const purgecss = purgeCssUtility({
  // Specify the paths to all of the template files in your project
  content: [
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/**/*.jsx"
    // etc.
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
})

addFilter("postcss-plugins", _ => {
  return [
    tailwindCSS(config),
    ..._,
    ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ]
})
