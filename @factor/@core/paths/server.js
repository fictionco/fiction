const { resolve, dirname } = require("path")
const { pathExistsSync } = require("fs-extra")
export default Factor => {
  return new (class {
    constructor() {
      this.baseDir = process.env.FACTOR_CWD || process.cwd()

      this.assignFolderNames()
      this.assignPaths()

      this.addServerPaths()
      this.dataPaths()

      // Add static folder copy config to webpack copy plugin
      Factor.$filters.add("webpack-copy-files-config", _ => {
        return _.concat(this.staticCopyConfig())
      })
    }

    // Returns configuration array for webpacks copy plugin
    // if static folder is in app or theme, contents should copied to dist
    staticCopyConfig() {
      const themeRoot = this.paths.theme
      const themePath = themeRoot ? resolve(themeRoot, this.folder("static")) : false
      const appPath = this.paths.static

      const paths = [themePath, appPath]
      const copyItems = []

      paths.forEach(p => {
        if (pathExistsSync(p)) {
          copyItems.push({
            from: p,
            to: "",
            ignore: [".*"]
          })
        }
      })

      return copyItems
    }

    assignFolderNames() {
      const _ = {}
      _.dist = "dist"
      _.generated = ".factor"
      _.static = "static"

      this.folderNames = Factor.$filters.apply("folder-names", _)
    }

    assignPaths() {
      const _ = {}
      _.app = this.baseDir
      const { main = "index.js" } = require(resolve(this.baseDir, "package.json"))

      _.source = dirname(resolve(this.baseDir, main))

      _.dist = resolve(this.baseDir, this.folder("dist"))
      _.generated = resolve(this.baseDir, this.folder("generated"))
      _.config = resolve(this.baseDir)

      _["config-file-public"] = resolve(_.app, "factor-config.json")
      _["config-file-private"] = resolve(_.app, ".env")

      _.static = resolve(_.source, "static")

      _.modules = this.getModulesFolders()

      _.coreApp = dirname(require.resolve("@factor/app"))

      _["entry-client"] = resolve(_.coreApp, "entry-client.js")
      _["entry-server"] = resolve(_.coreApp, "entry-server.js")
      _["loader-app"] = resolve(_.generated, "loader-app.js")
      _["loader-server"] = resolve(_.generated, "loader-server.js")
      _["loader-settings"] = resolve(_.generated, "loader-settings.js")
      _["loader-styles"] = resolve(_.generated, "loader-styles.less")

      this.paths = Factor.$filters.apply("paths", _)
    }

    resolveFilePath(file) {
      const appPath = file.replace("#", this.paths.source)

      if (pathExistsSync(appPath)) {
        return appPath
      } else {
        let filePath = ""
        const themes = Factor.$loaders.getExtensions().filter(_ => _.extend == "theme")

        if (themes.length > 0) {
          themes.some(_ => {
            const themeRoot = dirname(require.resolve(_.name))
            const themePath = file.replace("#", themeRoot)

            if (pathExistsSync(themePath)) {
              filePath = themePath
              return true
            }
          })
        }

        if (!filePath) {
          const fallbackPath = file.replace("#", this.get("coreApp"))

          if (pathExistsSync(fallbackPath)) {
            filePath = fallbackPath
          }
        }

        return filePath
      }
    }

    getModulesFolders() {
      const relativeNodeFolders = require("find-node-modules")({ cwd: this.baseDir })

      return relativeNodeFolders.map(_ => resolve(this.baseDir, _))
    }

    addServerPaths() {
      this.add({
        "server-bundle-name": "factor-server.json",
        "client-manifest-name": "factor-client.json",
        "client-manifest": resolve(this.get("dist"), "factor-client.json"),
        "server-bundle": resolve(this.get("dist"), "factor-server.json")
      })
    }

    dataPaths() {
      this.add({
        "data-exports": resolve(this.get("app"), "data-exports")
      })
    }

    get(p) {
      return this.paths[p] || ""
    }

    folder(f) {
      return this.folderNames[f] || ""
    }

    add(p, value) {
      if (typeof p == "object") {
        this.paths = Object.assign({}, this.paths, p)
      } else {
        this.paths[p] = value
      }
    }

    assignNodeAlias() {
      const moduleAlias = require("module-alias")

      moduleAlias.addAlias("~", this.get("app"))
      moduleAlias.addAlias("@", this.get("source"))
      moduleAlias.addAlias("#", this.get("coreApp"))
    }

    getAliases() {
      const a = {
        "@": this.get("source"),
        "~": this.get("app")
      }

      return Factor.$filters.apply("webpack-aliases", a)
    }

    replaceWithAliases(p) {
      const aliases = this.getAliases()

      for (const ali in aliases) {
        if (aliases[ali]) {
          p = p.replace(aliases[ali], ali)
        }
      }

      return p
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
        }

        this.httpDetails = { port, routine, certDir, certConfig }

        return this.httpDetails
      }
    }
  })()
}
