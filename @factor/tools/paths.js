import fs from "fs-extra"
import { resolve, dirname, relative } from "path"

import { addFilter, applyFilters } from "@factor/tools"
import { getExtensions } from "@factor/cli/extension-loader"

// Add static folder copy config to webpack copy plugin
addFilter("webpack-copy-files-config", _ => [..._, ...staticCopyConfig()])
addFilter("webpack-aliases", _ => {
  return { ..._, "@": getPath("source"), "~": getPath("app") }
})

function relativePath(key) {
  const { main = "index.js" } = require(resolve(CWD(), "package.json"))
  const sourceDirectory = dirname(resolve(CWD(), main))

  const app = "."

  const source = relative(CWD(), sourceDirectory)
  const dist = [app, "dist"]
  const generated = [app, ".factor"]
  const coreApp = dirname(require.resolve("@factor/app"))

  const paths = applyFilters("paths", {
    app,
    source,
    dist,
    generated,
    coreApp,
    static: [source, "static"],
    "entry-browser": [coreApp, "entry-browser.js"],
    "entry-server": [coreApp, "entry-server.js"],
    "config-file-public": [app, "factor-config.json"],
    "config-file-private": [app, ".env"],
    "loader-app": [...generated, "loader-app.js"],
    "loader-server": [...generated, "loader-server.js"],
    "loader-settings": [...generated, "loader-settings.js"],
    "loader-styles": [...generated, "loader-styles.less"],
    "client-manifest": [...dist, "factor-client.json"],
    "server-bundle": [...dist, "factor-server.json"]
  })

  const p = paths[key]

  return Array.isArray(p) ? p.join("/") : p
}

export function getPath(key) {
  const rel = relativePath(key)
  const full = typeof rel != "undefined" ? resolve(CWD(), rel) : false

  return full
}

function CWD() {
  return process.env.FACTOR_CWD || process.cwd()
}

// Returns configuration array for webpacks copy plugin
// if static folder is in app or theme, contents should copied to dist
function staticCopyConfig() {
  const themeRoot = getPath("theme")
  const themePath = themeRoot ? resolve(themeRoot, "static") : false
  const appPath = getPath("static")

  const paths = [themePath, appPath]
  const copyItems = []

  paths.forEach(p => {
    if (fs.pathExistsSync(p)) copyItems.push({ from: p, to: "", ignore: [".*"] })
  })

  return copyItems
}

function fileExistsInTheme(file) {
  let filePath = ""
  const themes = getExtensions().filter(_ => _.extend == "theme")
  if (themes.length > 0) {
    themes.some(_ => {
      const themeRoot = dirname(require.resolve(_.name))
      const themePath = file.replace("#", themeRoot)

      if (fs.pathExistsSync(themePath)) {
        filePath = themePath
        return true
      }
    })
  }

  return filePath
}

export function resolveFilePath(file) {
  const appPath = file.replace("#", getPath("source"))

  if (fs.pathExistsSync(appPath)) {
    return appPath
  } else {
    let filePath = fileExistsInTheme(file)

    if (!filePath) {
      const fallbackPath = file.replace("#", getPath("coreApp"))

      if (fs.pathExistsSync(fallbackPath)) {
        filePath = fallbackPath
      }
    }

    return filePath
  }
}

export function localhostUrl() {
  const { routine, port } = getHttpDetails()

  return `${routine}://localhost:${port}`
}

export function getHttpDetails() {
  const port = process.env.PORT || 3000

  let routine = "http"
  let certDir = false
  const filename = "server.key"

  const filepath = require("find-up").sync(filename)

  let certConfig = {}
  if (filepath) {
    const fs = require("fs")
    routine = "https"
    certDir = dirname(filepath)

    certConfig = {
      key: fs.readFileSync(resolve(certDir, "server.key")),
      cert: fs.readFileSync(resolve(certDir, "server.crt"))
    }

    if (process.env.CERTIFICATE_PASSPHRASE) {
      certConfig.passphrase = process.env.CERTIFICATE_PASSPHRASE
    }
  }

  return { port, routine, certDir, certConfig }
}
