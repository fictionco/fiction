import { addFilter } from "@factor/tools"
import { dirname, basename } from "path"
import { getExtensions } from "@factor/cli/extension-loader"
import { getPath } from "@factor/tools/paths"
import fs from "fs-extra"
import glob from "glob"
import webpack from "webpack"

function getThemes() {
  return getExtensions().filter(_ => _.extend == "theme")
}

addFilter("webpack-aliases", _ => {
  const themes = getThemes()
  const p =
    themes.length > 0 ? dirname(require.resolve(themes[0].name)) : getPath("source")

  return { ..._, "@theme": p }
})

// This allows for overriding of files from themes
// Notes:
// - Uses "#" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.
// - TODO if a file is added to app, then server needs a restart, fix should be possible
addFilter("webpack-plugins", _ => {
  _.push(
    new webpack.NormalModuleReplacementPlugin(/^#/, resource =>
      overrideOperator(resource)
    )
  )
  _.push(
    new webpack.NormalModuleReplacementPlugin(/^@factor/, resource =>
      browserReplaceModule(resource)
    )
  )
  return _
})

// Server utils sometimes aren't compatible with webpack
// Replace with polyfill if a
export function browserReplaceModule(resource) {
  const resolvedFile = require.resolve(resource.request, { paths: [resource.context] })
  const resolvedDirectory = dirname(resolvedFile)
  const filename = basename(resolvedFile, ".js")

  const clientUtil = _fileExists(`${resolvedDirectory}/${filename}-browser`)

  if (clientUtil) resource.request = clientUtil

  return resource
}

export function overrideOperator(resource) {
  const inApp = _fileExists(resource.request.replace("#", getPath("source")))
  let filePath = ""
  if (inApp) {
    filePath = inApp
  } else {
    const themes = getThemes()
    if (themes.length > 0) {
      themes.some(_ => {
        const themeSrc = dirname(require.resolve(_.name))

        const inTheme = _fileExists(resource.request.replace("#", themeSrc))

        if (inTheme) {
          filePath = inTheme
          return true
        }
      })
    }

    if (!filePath) {
      const relPath = _fileExists(resource.request.replace("#", resource.context))

      const fallbackPath = _fileExists(resource.request.replace("#", getPath("coreApp")))

      if (relPath) filePath = relPath
      else if (fallbackPath) filePath = fallbackPath
    }
  }

  if (filePath) resource.request = filePath

  return resource
}

function _fileExists(path) {
  if (fs.pathExistsSync(path)) {
    return path
  } else {
    const files = glob.sync(`${path}.*`)

    return files && files.length == 1 ? files[0] : false
  }
}
