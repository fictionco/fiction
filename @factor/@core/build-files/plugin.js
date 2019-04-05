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
        "plugins-loader-serverless": res(gen, "load-plugins-serverless.js"),
        "plugins-loader-themes": res(gen, "load-themes.js"),
        "app-package": res(Factor.$paths.get("app"), "package.json")
      })

      if (Factor.FACTOR_ENV == "build") {
        this.generateLoaders()
      }

      this.addWatchers()
    }

    addWatchers() {
      Factor.$filters.add("build-watchers", _ => {
        _.push({
          name: "Generate Loaders - Package Added/Removed",
          files: this.getExtensionPatterns(),
          ignored: [],
          callback: ({ event, path }) => {
            // Any time there is a node_modules within a @factor package
            // Then we don't want to watch it
            // TODO - Ideally these wouldn't be included in the GLOB of packages
            // Wasn't working so added this
            const subModules = path.split("@factor").pop()
            if (
              (event == "add" || event == "unlink") &&
              (!subModules || !subModules.includes("node_modules"))
            ) {
              this.generateLoaders()
              return true // update server
            } else {
              return false // server ignore
            }
          }
        })
        return _
      })
    }

    generateLoaders() {
      const s = Date.now()
      const extensions = this.getExtensions()

      this.makeLoaderFile({
        extensions,
        destination: Factor.$paths.get("plugins-loader-build"),
        target: ["build"]
      })

      this.makeLoaderFile({
        extensions,
        destination: Factor.$paths.get("plugins-loader-app"),
        target: ["app"]
      })

      // this.makeLoaderFile({
      //   extensions,
      //   destination: Factor.$paths.get("plugins-loader-themes"),
      //   target: ["themes"]
      // })

      this.makeLoaderFile({
        extensions,
        destination: Factor.$paths.get("plugins-loader-serverless"),
        target: ["endpoint", "serverless"],
        requireAtRuntime: true
      })

      require("consola").success(
        `Made Loaders [${Date.now() - s}ms]`,
        `- ${extensions.length} Extensions`
      )
    }

    getExtensionPatterns() {
      let patterns = []

      require("find-node-modules")().forEach(_ => {
        patterns.push(path.resolve(_, `./@${this.namespace}/**/package.json`))
        patterns.push(path.resolve(_, `./${this.namespace}*/package.json`))
      })

      // Add package.json from CWD - Application directory
      patterns.push(Factor.$paths.get("app-package"))

      return patterns
    }

    getExtensions() {
      const glob = require("glob").sync

      let packagePaths = []
      this.getExtensionPatterns().forEach(pattern => {
        packagePaths = packagePaths.concat(glob(pattern))
      })

      return this.makeLoader(packagePaths)
    }

    makeLoader(packagePaths) {
      const loader = []
      packagePaths.forEach(_ => {
        let fields = {}
        if (_.includes("package.json")) {
          let {
            name,
            factor: {
              id,
              priority = 100,
              target = false,
              service = "",
              provider = "",
              scope = "extension"
            } = {},
            version
          } = require(_)

          // Change scope if package is actually the app (themes vs app)
          // Useful for theme development
          if (_ == Factor.$paths.get("app-package")) {
            scope = "application"
          }

          fields = {
            version,
            module: name,
            priority,
            target,
            service,
            provider,
            scope,
            id:
              id ||
              this.makeId(name.split(/endpoint|plugin|theme|service|@factor|@fiction/gi).pop())
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

    // Webpack doesn't allow dynamic paths in require statements
    // In order to make dynamic require statements, we build loader files
    // Also an easier way to see what is included than by using other techniques
    makeLoaderFile({ extensions, destination, target, requireAtRuntime = false }) {
      const fs = require("fs-extra")

      const filtered = extensions.filter(_ => {
        if (_.scope == "theme" && !target.includes("themes")) {
          return false
        }
        if (_.target) {
          if (typeof _.target == "string") {
            if (target.includes(_.target)) {
              return true
            }
          } else if (target.filter(value => _.target.includes(value)).length > 0) {
            return true
          }
        }
      })

      const lines = [`/* GENERATED FILE */`]

      lines.push("const files = {}")

      filtered.forEach(extension => {
        const { module, id } = extension
        const r = requireAtRuntime ? JSON.stringify(extension) : `require("${module}").default`
        lines.push(`files["${id}"] = ${r}`)
      })

      lines.push(`module.exports = files`)

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

    makeId(name) {
      return name.replace(/\.js|plugin|\-|\//gi, "")
    }

    sortPriority(arr) {
      if (!arr || arr.length == 0) return arr

      return arr.sort((a, b) => {
        const ap = a.priority || 100
        const bp = b.priority || 100
        return ap < bp ? -1 : ap > bp ? 1 : 0
      })
    }
  }()
}
