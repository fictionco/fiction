import { addFilter } from "@factor/api"
import tailwindCSS from "tailwindcss"
import { setting } from "@factor/api/settings"
//import purgeCssUtility from "@fullhuman/postcss-purgecss"

export const setup = (): void => {
  // If tailwind.config is in CWD prefer that, otherwise use the one in the plugin
  // optionally overridden by a setting (allows for change of name)

  // const purgecss = purgeCssUtility({
  //   // Specify the paths to all of the template files in your project
  //   content: [
  //     "./src/**/*.html",
  //     "./src/**/*.vue",
  //     "./src/**/*.jsx"
  //     // etc.
  //   ],

  //   // Include any special characters you're using in this regular expression
  //   defaultExtractor: (content: string) => content.match(/[\w-/:]+(?<!:)/g) || []
  // })

  addFilter({
    key: "tailwindPlugin",
    hook: "postcss-plugins",
    callback: (_: any[], { cwd }: { cwd?: string } = {}): any[] => {
      const config: string = setting("tailwind.config", { cwd }) ?? ""
      const directives: string = setting("tailwind.directives", { cwd }) ?? ""

      return [
        tailwindCSS(config, directives),
        ..._
        //...(process.env.NODE_ENV === "production" ? [purgecss] : [])
      ]
    }
  })
}

setup()
