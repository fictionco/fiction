const path = require("path")
var fs = require("fs")
module.exports = Factor => {
  return new class {
    constructor() {
      const gen = Factor.$paths.get("generated")
      const res = path.resolve

      this.namespace = "factor"

      this.build = process.env.NODE_ENV === "production" ? "production" : "development"

      Factor.$paths.add({
        "plugins-loader-app": res(gen, "load-plugins-app.js"),
        "plugins-loader-build": res(gen, "load-plugins-build.js"),
        "plugins-loader-endpoint": res(gen, "load-plugins-endpoint.js"),
        "themes-loader": res(gen, "load-themes.js")
      })

      if (Factor.FACTOR_ENV == "build" && this.build == "development") {
        this.generateLoaders()
      }

      this.addWatchers()
    }

    addWatchers() {
      Factor.$filters.add("dev-watchers", _ => {
        const files = this.getExtensionPatterns()

        const watchers = [
          {
            files,
            cb: (event, path) => {
              if (
                (path.includes("package.json") || path.includes("plugin.js")) &&
                (event == "add" || event == "unlink")
              ) {
                this.generateLoaders()
                return true
              }
            }
          }
        ]

        return _.concat(watchers)
      })
    }

    generateLoaders() {
      const s = Date.now()
      const extensions = this.getExtensions()

      this.makeLoaderFile({
        extensions,
        destination: Factor.$paths.get("plugins-loader-build"),
        target: "build"
      })

      this.makeLoaderFile({
        extensions,
        destination: Factor.$paths.get("plugins-loader-app"),
        target: "app"
      })

      this.makeLoaderFile({
        extensions,
        destination: Factor.$paths.get("plugins-loader-endpoint"),
        target: "endpoint"
      })

      this.makeLoaderFile({
        extensions,
        destination: Factor.$paths.get("themes-loader"),
        target: "themes"
      })

      require("consola").success(
        `Made Loaders [${Date.now() - s}ms]`,
        `- ${extensions.length} Extensions`
      )

      // if (Factor.FACTOR_CONFIG.theme == activeTheme) {
      //   require("consola").success(`Active Theme: "${Factor.FACTOR_CONFIG.theme}"`)
      // }
    }

    makeLoaderFile({ extensions, destination, target }) {
      const fs = require("fs-extra")

      const filtered = extensions.filter(
        _ =>
          _.target == target ||
          ((Array.isArray(_.target) && _.target.includes(target)) || _.target == "all")
      )

      const lines = [`/* GENERATED FILE */`]

      lines.push("const files = {}")

      if (true || target == "build") {
        filtered.forEach(({ id, module }) => {
          lines.push(`files["${id}"] = require("${module}").default`)
        })

        lines.push(`module.exports = files`)
      }

      // else {
      //   loader.forEach(({ id, module }) => {
      //     lines.push(`files["${id}"] = () => import("${module}")`)
      //   })

      //   lines.push(`export default files`)
      // }

      fs.ensureDirSync(path.dirname(destination))

      fs.writeFileSync(destination, lines.join("\n"))
    }

    readHtmlFile(filePath, { minify = true, name = "" } = {}) {
      const fs = require("fs-extra")

      let str = fs.readFileSync(filePath, "utf-8")

      if (minify) {
        str = require("html-minifier").minify(str, {
          minifyJS: true,
          collapseWhitespace: true
        })
      }

      if (name) {
        str = `<!-- ${name} -->${str}<!-- / ${name} -->`
      }

      return str
    }

    getExtensionPatterns() {
      let patterns = []

      require("find-node-modules")().forEach(_ => {
        patterns.push(path.resolve(_, `./@${this.namespace}/**/package.json`))
        patterns.push(path.resolve(_, `./${this.namespace}*/package.json`))
      })

      patterns.push(path.resolve(Factor.$paths.get("source"), `**/plugin.js`))

      return patterns
    }

    getExtensions() {
      const glob = require("glob").sync

      let packages = []
      this.getExtensionPatterns().forEach(pattern => {
        packages = packages.concat(glob(pattern))
      })

      return this.makeLoader(packages)

      // const themesPackages = packages.filter(_ => _.includes("theme"))
      // const themesLoader = this.makeLoader(themesPackages, { key: "theme" })

      // activeTheme = Factor.FACTOR_CONFIG.theme
      //   ? themesLoader.find((_, index) => {
      //       themesLoader[index].active = true
      //       return _.id == Factor.FACTOR_CONFIG.theme
      //     })
      //   : false

      // if (activeTheme) {
      //   const themePluginPattern = path.resolve(activeTheme.filepath, `**/@${this.namespace}/**/package.json`)
      //   packages = packages.concat(glob(themePluginPattern))
      // }

      // const { factor: { services = {} } = {} } = Factor.$config

      // let pluginPackages = []
      // pluginPackages = pluginPackages.concat(packages.filter(_ => _.includes("plugin")))
      // pluginPackages = pluginPackages.concat(Object.values(services).map(_ => `${_}/package.json`))

      // const pluginsLoader = this.makeLoader(pluginPackages, { key: "plugin" })

      // return {
      //   activeTheme,
      //   pluginsLoader,
      //   themesLoader
      // }
    }

    sortPriority(arr) {
      if (!arr || arr.length == 0) return arr

      return arr.sort((a, b) => {
        const ap = a.priority || 100
        const bp = b.priority || 100
        return ap < bp ? -1 : ap > bp ? 1 : 0
      })
    }

    makeLoader(packages) {
      const loader = []
      packages.forEach(_ => {
        let fields = {}
        if (_.includes("package.json")) {
          const { name, factor: { priority = 100, target = false } = {} } = require(_)

          fields = {
            module: name,
            priority,
            target,
            id: this.makeId(name.split(/endpoint|plugin|theme|service|@factor/gi).pop())
          }
        } else {
          const basename = path.basename(_)
          const folderName = path.basename(path.dirname(_))
          // Aliases needed so paths can be changed if needed
          // Since webpack won't allow dynamic paths in require (variables in paths)

          fields = {
            module: Factor.$paths.replaceWithAliases(_),
            target: "app",
            id: basename == "plugin.js" ? folderName : this.makeId(basename)
          }
        }

        loader.push(fields)
      })

      return this.sortPriority(loader)
    }

    makeId(name) {
      return name.replace(/\.js|plugin|\-|\//gi, "")
    }
  }()
}
