import { resolve } from "path"
import { addFilter } from "@factor/tools"
import tailwindCSS from "tailwindcss"
import { setting } from "@factor/tools/settings"
import purgeCssUtility from "@fullhuman/postcss-purgecss"

export const setup = (): void => {
  const cwd = process.env.FACTOR_CWD || process.cwd()

  // If tailwind.config is in CWD prefer that, otherwise use the one in the plugin
  // optionally overridden by a setting (allows for change of name)
  let directives: string
  let config: string
  //let directives
  try {
    config = require.resolve(resolve(cwd, "tailwind.config"))
    directives = require.resolve(resolve(cwd, "tailwind.directives"))
  } catch (error) {
    if (error.code == "MODULE_NOT_FOUND") {
      config = setting("tailwind.config")
      directives = setting("tailwind.directives")
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
    defaultExtractor: (content: string) => content.match(/[\w-/:]+(?<!:)/g) || []
  })

  addFilter({
    key: "tailwindPlugin",
    hook: "postcss-plugins",
    callback: (_: any[]): any[] => {
      return [
        tailwindCSS(config, directives),
        ..._,
        ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
      ]
    }
  })
}

setup()
