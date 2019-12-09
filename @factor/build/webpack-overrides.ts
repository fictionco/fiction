import { dirname, basename } from "path"
import { addFilter } from "@factor/tools"
import { getExtensions } from "@factor/cli/extension-loader"
import { getPath } from "@factor/tools/paths"
import fs from "fs-extra"
import glob from "glob"
import webpack, { Plugin } from "webpack"
import { FactorExtension } from "@factor/cli/types"

const getThemes = (): FactorExtension[] => {
  return getExtensions().filter(_ => _.extend == "theme")
}

interface WebpackResource {
  [key: string]: any;
  request: string;
  context: string;
}

addFilter({
  key: "themeAlias",
  hook: "webpack-aliases",
  callback: (_: Record<string, any>) => {
    const themes = getThemes()
    const p =
      themes.length > 0 ? dirname(require.resolve(themes[0].name)) : getPath("source")

    return { ..._, "@theme": p }
  }
})

const _fileExists = (path: string): string => {
  if (fs.pathExistsSync(path)) {
    return path
  } else {
    const files = glob.sync(`${path}.*`)

    return files && files.length == 1 ? files[0] : ""
  }
}

export const overrideOperator = (resource: WebpackResource): WebpackResource => {
  const inApp = _fileExists(resource.request.replace("__FALLBACK__", getPath("source")))
  let filePath = ""
  if (inApp) {
    filePath = inApp
  } else {
    const themes = getThemes()
    if (themes.length > 0) {
      themes.some((_: FactorExtension): boolean => {
        const themeSrc = dirname(require.resolve(_.name))

        const inTheme = _fileExists(resource.request.replace("__FALLBACK__", themeSrc))

        if (inTheme) {
          filePath = inTheme
          return true
        } else return false
      })
    }

    if (!filePath) {
      const relPath = _fileExists(
        resource.request.replace("__FALLBACK__", resource.context)
      )

      const fallbackPath = _fileExists(
        resource.request.replace("__FALLBACK__", getPath("coreApp"))
      )

      if (relPath) filePath = relPath
      else if (fallbackPath) filePath = fallbackPath
    }
  }

  if (filePath) resource.request = filePath

  return resource
}

// Server utils sometimes aren't compatible with webpack
// Replace with polyfill if a
export const browserReplaceModule = (resource: WebpackResource): WebpackResource => {
  const resolvedFile = require.resolve(resource.request, { paths: [resource.context] })
  const resolvedDirectory = dirname(resolvedFile)
  const filename = basename(resolvedFile)

  const filenameRoot = filename
    .split(".")
    .slice(0, -1)
    .join(".")

  const clientUtil = _fileExists(`${resolvedDirectory}/${filenameRoot}-browser`)

  if (clientUtil) resource.request = clientUtil

  return resource
}

// This allows for overriding of files from themes
// Notes:
// - Uses "__FALLBACK__" as a flag to check a file, this is an alias for the theme root. The function replaces this with the app root.

addFilter({
  key: "moduleReplacePlugins",
  hook: "webpack-plugins",
  callback: (_: Plugin[]): Plugin[] => {
    _.push(
      new webpack.NormalModuleReplacementPlugin(
        /^mongoose/,
        (resource: WebpackResource): WebpackResource => {
          resource.request = "mongoose/browser"
          return resource
        }
      )
    )

    _.push(
      new webpack.NormalModuleReplacementPlugin(
        /^__FALLBACK__/,
        (resource: WebpackResource) => overrideOperator(resource)
      )
    )
    _.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@factor/,
        (resource: WebpackResource): WebpackResource => browserReplaceModule(resource)
      )
    )
    return _
  }
})
