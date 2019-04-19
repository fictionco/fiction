const { resolve, dirname } = require("path")
module.exports = Factor => {
  return new class {
    constructor() {
      this.assignFolderNames()
      this.assignPaths()
      this.addServerPaths()
    }

    assignFolderNames() {
      const _ = {}
      _.dist = "dist"
      _.source = "src"
      _.generated = "generated"

      this.folderNames = Factor.$filters.apply("folder-names", _)
    }

    assignPaths() {
      const { baseDir } = Factor.FACTOR_CONFIG

      //   console.log("DD_____", require.resolve("@factor/build-start"))
      const _ = {}
      _.app = baseDir
      _.source = resolve(baseDir, this.folder("source"))
      _.dist = resolve(baseDir, this.folder("dist"))
      _.generated = resolve(baseDir, this.folder("generated"))
      _.config = resolve(baseDir, "config")
      _.template = resolve(_.source, "index.html")
      _.static = resolve(_.source, "static")
      _.favicon = resolve(_.static, "favicon.png")

      this.paths = Factor.$filters.apply("paths", _)
    }

    addServerPaths() {
      this.add({
        "server-bundle-name": "factor-server.json",
        "client-manifest-name": "factor-client.json",
        "client-manifest": resolve(this.get("dist"), "factor-client.json"),
        "server-bundle": resolve(this.get("dist"), "factor-server.json")
      })
    }

    get(p) {
      return this.paths[p] || null
    }

    folder(f) {
      return this.folderNames[f] || null
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
  }()
}
