import { dirname } from "path"
import { getExtensions } from "@factor/cli/extension-loader"
import { getPath } from "@factor/api/paths"
import fs from "fs-extra"

const fileExistsInTheme = (file: string): string => {
  let filePath = ""
  const themes = getExtensions().filter(_ => _.extend == "theme")
  if (themes.length > 0) {
    themes.some(_ => {
      const themeRoot = dirname(require.resolve(_.name))
      const themePath = file.replace("__FALLBACK__", themeRoot)

      if (fs.pathExistsSync(themePath)) {
        filePath = themePath
        return true
      } else return false
    })
  }

  return filePath
}

export const resolveFilePath = (file: string): string => {
  const appPath = file.replace("__FALLBACK__", getPath("source"))

  if (fs.pathExistsSync(appPath)) {
    return appPath
  } else {
    let filePath = fileExistsInTheme(file)

    if (!filePath) {
      const fallbackPath = file.replace("__FALLBACK__", getPath("coreApp"))

      if (fs.pathExistsSync(fallbackPath)) {
        filePath = fallbackPath
      } else {
        filePath = ""
      }
    }

    return filePath
  }
}
