const { resolve, dirname } = require("path")
const { pathExistsSync } = require("fs-extra")
module.exports = Factor => {
  return new (class {
    constructor() {
      const { baseDir } = Factor.FACTOR_CONFIG

      this.baseDir = baseDir

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
            to: "static",
            ignore: [".*"]
          })
        }
      })

      return copyItems
    }

    assignFolderNames() {
      const _ = {}
      _.dist = "dist"
      _.source = "src"
      _.generated = "generated"
      _.static = "static"

      this.folderNames = Factor.$filters.apply("folder-names", _)
    }

    assignPaths() {
      const _ = {}
      _.app = this.baseDir
      _.source = resolve(this.baseDir, this.folder("source"))
      _.dist = resolve(this.baseDir, this.folder("dist"))
      _.generated = resolve(this.baseDir, this.folder("generated"))
      _.config = resolve(this.baseDir)

      _.static = resolve(_.source, "static")

      //_.template = resolve(_.source, "index.html")
      //_.favicon = resolve(_.static, "favicon.png")

      _.modules = this.getModulesFolders()

      this.paths = Factor.$filters.apply("paths", _)
    }

    resolveFilePath(file, folder = "") {
      const themeRoot = this.paths.theme
      const folderName = this.folder(folder)
      const themePath = themeRoot ? resolve(themeRoot, folderName, file) : false
      const appPath = resolve(this.paths.source, folderName, file)
      console.log("RESOLVE", file, themeRoot, themePath, appPath)
      if (pathExistsSync(appPath)) {
        return appPath
      } else if (themePath && pathExistsSync(themePath)) {
        return themePath
      } else {
        return ""
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

    getAliases() {
      return {
        "@": this.get("source"),
        "~": this.get("app"),
        "#": this.get("theme") || this.get("source"),
        "@generated": this.get("generated"),
        "@config": this.get("config")
      }
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

    localhostUrl() {
      const { routine, port } = this.getHttpDetails()

      return `${routine}://localhost:${port}`
    }

    getHttpDetails() {
      if (this.httpDetails) {
        return this.httpDetails
      } else {
        const port = Factor.$config.setting("port") || 7777

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
