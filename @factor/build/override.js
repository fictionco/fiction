import glob from "glob"
import fs from "fs-extra"
import { dirname, resolve } from "path"
import { addFilter } from "@factor/tools"
import { getPath } from "@factor/paths"
import { getExtensions } from "@factor/build/util"

const themes = getExtensions().filter(_ => _.extend == "theme")

addFilter("webpack-aliases", _ => {
  const p =
    themes.length > 0 ? dirname(require.resolve(themes[0].name)) : getPath("source")

  return { ..._, "@theme": p }
})

// This allows for overriding of files from themes
// Notes:
// - Uses "#" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.
// - TODO if a file is added to app, then server needs a restart, fix should be possible
addFilter("webpack-plugins", (_, { webpack }) => {
  _.push(modulePathWebpackPlugin(webpack))
  _.push(browserReplacement(webpack))
  return _
})

// Server utils sometimes aren't compatible with webpack
// Replace with polyfill if a
function browserReplacement(webpack) {
  return new webpack.NormalModuleReplacementPlugin(/^@factor/, resource => {
    const resolvedDirectory = dirname(
      require.resolve(resource.request, { paths: [resource.context] })
    )
    const clientUtil = _fileExists(
      resolve(resolvedDirectory, `${resource.request}-browser`)
    )

    if (clientUtil) resource.request = clientUtil
  })
}

function modulePathWebpackPlugin(webpack) {
  return new webpack.NormalModuleReplacementPlugin(/^\#/, resource => {
    resource.request = handleAsOverride(resource)
  })
}

function handleAsOverride(resource) {
  const inApp = _fileExists(resource.request.replace("#", getPath("source")))
  let filePath = ""
  if (inApp) {
    filePath = inApp
  } else {
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

  return filePath ? filePath : resource.request
}

function _fileExists(path) {
  const basePath = path.split("?")[0]
  //const query = path.split("?")[1] || ""
  if (fs.pathExistsSync(basePath)) {
    return path
  } else {
    const files = glob.sync(`${basePath}.*`)

    if (files && files.length == 1) {
      return files[0]
    } else {
      return false
    }
  }
}
