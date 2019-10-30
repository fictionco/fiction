import fs from "fs-extra"
import { resolve, dirname, relative } from "path"

import { addFilter, applyFilters } from "@factor/tools"
import { getExtensions } from "@factor/build/util"

export class FactorPaths {
  constructor() {
    // Add static folder copy config to webpack copy plugin
    addFilter("webpack-copy-files-config", _ => [..._, ...this.staticCopyConfig()])
    addFilter("webpack-aliases", _ => {
      return {
        ..._,
        "@": this.get("source"),
        "~": this.get("app")
      }
    })
  }

  CWD() {
    return process.env.FACTOR_CWD || process.cwd()
  }

  get(key) {
    const rel = this.relativePath(key)
    const full = typeof rel != "undefined" ? resolve(this.CWD(), rel) : false

    return full
  }

  // Returns configuration array for webpacks copy plugin
  // if static folder is in app or theme, contents should copied to dist
  staticCopyConfig() {
    const themeRoot = this.get("theme")
    const themePath = themeRoot ? resolve(themeRoot, "static") : false
    const appPath = this.get("static")

    const paths = [themePath, appPath]
    const copyItems = []

    paths.forEach(p => {
      if (fs.pathExistsSync(p)) copyItems.push({ from: p, to: "", ignore: [".*"] })
    })

    return copyItems
  }

  relativePath(key) {
    const { main = "index.js" } = require(resolve(this.CWD(), "package.json"))
    const sourceDirectory = dirname(resolve(this.CWD(), main))

    const app = "."

    const source = relative(this.CWD(), sourceDirectory)
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
      "entry-client": [coreApp, "entry-client.js"],
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

  fileExistsInTheme(file) {
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

  resolveFilePath(file) {
    const appPath = file.replace("#", this.get("source"))

    if (fs.pathExistsSync(appPath)) {
      return appPath
    } else {
      let filePath = this.fileExistsInTheme(file)

      if (!filePath) {
        const fallbackPath = file.replace("#", this.get("coreApp"))

        if (fs.pathExistsSync(fallbackPath)) {
          filePath = fallbackPath
        }
      }

      return filePath
    }
  }

  getBaseUrl() {
    return process.env.baseURL || this.localhostUrl()
  }

  localhostUrl() {
    const { routine, port } = this.getHttpDetails()

    return `${routine}://localhost:${port}`
  }

  getHttpDetails() {
    if (this.httpDetails) {
      return this.httpDetails
    } else {
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

      this.httpDetails = { port, routine, certDir, certConfig }

      return this.httpDetails
    }
  }
}

export const $paths = new FactorPaths()

export function getPath(_id) {
  return $paths.get(_id)
}

export function resolveFilePath(path) {
  return $paths.resolveFilePath(path)
}

export function localhostUrl(path) {
  const { routine, port } = this.getHttpDetails()

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
