import { dirname, basename } from "path"
import { addFilter } from "@factor/api"
import { getExtensions } from "@factor/cli/extension-loader"
import { getPath } from "@factor/api/paths"
import fs from "fs-extra"
import glob from "glob"
import webpack, { Plugin } from "webpack"
import { FactorExtension } from "@factor/cli/types"

interface WebpackResource {
  [key: string]: any;
  request: string;
  context: string;
}

/**
 * Gets the theme dependencies
 */
const getThemes = (): FactorExtension[] => {
  return getExtensions().filter(_ => _.extend == "theme")
}

/**
 * Checks if a path exists
 * @param path
 */
const _fileExists = (path: string): string => {
  if (fs.pathExistsSync(path)) {
    return path
  } else {
    const files = glob.sync(`${path}.*`)

    return files && files.length == 1 ? files[0] : ""
  }
}

/**
 * Special find file operator: __FIND__
 * Looks in folders theme/app for the file
 * Prevents loading errors and allows overriding
 *
 * @param resource - webpack resource
 * @param cwd - the current working directory
 */
export const findFileOperator = (
  resource: WebpackResource,
  cwd?: string
): WebpackResource => {
  const findAlias = "__FIND__"
  const appSource = getPath("source", cwd)
  const coreAppModule = getPath("coreApp")

  const inApp = _fileExists(resource.request.replace(findAlias, appSource))

  let filePath = ""
  if (inApp) {
    filePath = inApp
  } else {
    // next let's look in any theme dependencies
    const themes = getThemes()

    if (themes.length > 0) {
      themes.some((_: FactorExtension): boolean => {
        const themeSource = dirname(require.resolve(_.name))

        const inTheme = _fileExists(resource.request.replace(findAlias, themeSource))

        if (inTheme) {
          filePath = inTheme
          return true
        } else return false
      })
    }

    if (!filePath) {
      const relPath = _fileExists(resource.request.replace(findAlias, resource.context))

      const fallbackPath = _fileExists(resource.request.replace(findAlias, coreAppModule))

      if (relPath) {
        filePath = relPath
      } else if (fallbackPath) {
        filePath = fallbackPath
      }
    }
  }

  if (filePath) resource.request = filePath

  return resource
}

/**
 * Allow a browser polyfill for dual loaded modules that aren't actually browser compatible
 * @param resource - webpack resource
 */
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

/**
 * Add __THEME__ alias to the first theme src dir
 */
addFilter({
  key: "themeAlias",
  hook: "webpack-aliases",
  callback: (_: Record<string, any>, { cwd }) => {
    const themes = getThemes()
    const p =
      themes.length > 0
        ? dirname(require.resolve(themes[0].name))
        : getPath("source", cwd)

    return { ..._, __THEME__: p }
  }
})

/**
 * Allow for overriding of files from themes
 * @remarks
 * - uses __FIND__
 */
addFilter({
  key: "moduleReplacePlugins",
  hook: "webpack-plugins",
  callback: (_: Plugin[], { cwd }): Plugin[] => {
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
        /^__FIND__/,
        (resource: WebpackResource) => findFileOperator(resource, cwd)
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
