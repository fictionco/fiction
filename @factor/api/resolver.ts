import { dirname } from "path"
import { getExtensions } from "@factor/cli/extension-loader"
import { getPath } from "@factor/api/paths"
import fs from "fs-extra"
import { FactorExtension } from "@factor/cli/types"
/**
 * Checks if a file exists in a theme dependency of an app
 * @param file - the file path (w aliases)
 */
const fileExistsInTheme = (file: string): string => {
  let filePath = ""
  const extensions = getExtensions()
  let themes: FactorExtension[] = []

  if (extensions && extensions.length > 0) {
    themes = extensions.filter((_) => _.extend == "theme")
  }

  if (themes.length > 0) {
    themes.some((_) => {
      const themeRoot = dirname(require.resolve(_.name))
      const themePath = file.replace("__FIND__", themeRoot)

      if (fs.pathExistsSync(themePath)) {
        filePath = themePath
        return true
      } else return false
    })
  }

  return filePath
}

/**
 * Resolve a file path, following aliases and checking dependencies
 * @param file - the file path (w aliases)
 */
export const resolveFilePath = (file: string): string => {
  const appPath = file.replace("__FIND__", getPath("source"))
  const noStatic = appPath.replace("/static", "")

  if (fs.pathExistsSync(appPath)) {
    return appPath
  } else if (fs.pathExistsSync(noStatic)) {
    return noStatic
  } else {
    let filePath = fileExistsInTheme(file)

    if (!filePath) {
      const fallbackPath = file.replace("__FIND__", getPath("coreApp"))

      if (fs.pathExistsSync(fallbackPath)) {
        filePath = fallbackPath
      } else {
        filePath = ""
      }
    }

    return filePath
  }
}
