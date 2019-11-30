import { getExtensions } from "@factor/cli/extension-loader"
import { dirname } from "path"
import { getPath } from "@factor/tools/paths"
import fs from "fs-extra"

function fileExistsInTheme(file) {
  let filePath = ""
  const themes = getExtensions().filter((_) => _.extend == "theme")
  if (themes.length > 0) {
    themes.some((_) => {
      const themeRoot = dirname(require.resolve(_.name))
      const themePath = file.replace("__FALLBACK__", themeRoot)

      if (fs.pathExistsSync(themePath)) {
        filePath = themePath
        return true
      }
    })
  }

  return filePath
}

export function resolveFilePath(file) {
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
