import { dirname } from "path"
import { addFilter } from "@factor/api/hooks"
addFilter({
  key: "addThemes",
  hook: "build-directories",
  callback: dirs => {
    const themeDir = dirname(require.resolve("@factor/theme-alpha/package.json"))
    dirs.push(themeDir)
    return dirs
  }
})
