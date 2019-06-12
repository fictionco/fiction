const path = require("path")
const { resolve } = path
module.exports.default = Factor => {
  return new (class {
    constructor() {
      const gen = Factor.$paths.get("generated")

      this.namespace = "factor"

      this.build = process.env.NODE_ENV === "production" ? "production" : "development"

      Factor.$paths.add({
        "loader-app": resolve(gen, "loader-app.js"),
        "loader-server": resolve(gen, "loader-server.js")
      })

      this.cwdPackage = require(resolve(Factor.$paths.get("app"), "package.json"))

      this.extensions = this.getExtensions()

      if (Factor.FACTOR_TARGET == "server") {
        this.addWatchers()

        Factor.$filters.callback("cli-run-create-loaders", _ => this.generateLoaders(_))
      }
    }

    addWatchers() {
      // Factor.$filters.add("after-build-config", () => {
      //   const res = this.generateLoaders()
      //   Factor.$log.success(res)
      // })
      // Factor.$filters.add("cli-tasks", _ => {
      //   _.push({
      //     command: (ctx, task) => {
      //       task.title = this.generateLoaders()
      //     },
      //     title: "Generating extension loaders"
      //   })
      //   return _
      // })
      // Factor.$filters.add("build-watchers", _ => {
      //   _.push({
      //     name: "Generate Loaders - Package Added/Removed",
      //     files: this.getExtensionPatterns(),
      //     ignored: [],
      //     callback: ({ event, path }) => {
      //       // Any time there is a node_modules within a @factor package
      //       // Then we don't want to watch it
      //       // TODO - Ideally these wouldn't be included in the GLOB of packages
      //       // Wasn't working so added this
      //       const subModules = path.split("@factor").pop()
      //       if ((event == "add" || event == "unlink") && (!subModules || !subModules.includes("node_modules"))) {
      //         this.generateLoaders()
      //         return true // update server
      //       } else {
      //         return false // server ignore
      //       }
      //     }
      //   })
      //   return _
      // })
    }

    getExtended(type) {
      return this.extensions.filter(_ => _.extend == type)
    }

    generateLoaders() {
      this.makeLoaderFile({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-server"),
        buildTarget: ["server", "app"],
        mainTarget: "server"
      })

      this.makeLoaderFile({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-app"),
        buildTarget: ["app"],
        mainTarget: "app"
      })

      return `Loaders built for ${this.extensions.length} Extensions`
    }

    recursiveFactorDependencies(deps, pkg) {
      const { name, factor, dependencies = {}, devDependencies = {} } = pkg

      const d = { ...dependencies, ...devDependencies }

      Object.keys(d)
        .map(_ => require(`${_}/package.json`))
        .filter(_ => typeof _.factor != "undefined" || _.name.includes("factor"))
        .forEach(_ => {
          if (!deps.find(pkg => pkg.name == _.name)) {
            deps.push(_)
            deps = this.recursiveFactorDependencies(deps, _)
          }
        })

      return deps
    }

    // Use root application dependencies as the start of the
    // factor dependency tree
    getExtensions() {
      const deps = this.recursiveFactorDependencies([this.cwdPackage], this.cwdPackage)
      const list = this.getExtensionList(deps)

      return list
    }

    moduleMainFile({ name, mainTarget, target }) {
      let mainFile = name
      if (typeof target == "object" && !Array.isArray(target) && target[mainTarget] && target[mainTarget] != "index") {
        return `${name}/${target[mainTarget]}`
      }

      return mainFile
    }

    filterExtensions({ mainTarget, buildTarget, extensions }) {
      let filtered = extensions
        .filter(({ target }) => {
          target = !Array.isArray(target) ? Object.keys(target) : target
          return this.arrayIntersect(buildTarget, target)
        })
        .map(_ => {
          const { name, target, cwd, main } = _

          // If current directory/app then is not necessarily a module in the system
          // for app dirs we need to load relative, as absolute path might be different from build time to serve time
          if (cwd) {
            _.mainFile = `../${main}`
          } else {
            _.mainFile = this.moduleMainFile({ name, target, mainTarget })
          }

          return _
        })

      return Factor.$filters.apply(`packages-loader`, filtered, { buildTarget, extensions })
    }

    getExtensionList(packagePaths) {
      const loader = []
      packagePaths.forEach(_ => {
        let fields = {}

        let {
          name,
          factor: { id, priority = 100, target = false, extend = "plugin" } = {},
          version,
          main = "index.js"
        } = _

        id = id || this.makeId(name)
        const cwd = name == this.cwdPackage.name ? true : false

        fields = {
          version,
          name,
          priority,
          target,
          extend,
          cwd,
          main,
          id
        }

        loader.push(fields)
      })

      return this.sortPriority(loader)
    }

    // Webpack doesn't allow dynamic paths in require statements
    // In order to make dynamic require statements, we build loader files
    // Also an easier way to see what is included than by using other techniques
    makeLoaderFile({ extensions, destination, mainTarget, buildTarget, requireAtRuntime = false }) {
      const fs = require("fs-extra")

      const filtered = this.filterExtensions({ mainTarget, buildTarget, extensions })

      const fileLines = []
      filtered.forEach(extension => {
        const { id, mainFile } = extension

        if (requireAtRuntime) {
          fileLines.push(JSON.stringify(extension, null, "  "))
        } else {
          fileLines.push(`files["${id}"] = require("${mainFile}").default`)
        }
      })

      let lines = [`/******** GENERATED FILE ********/`]

      if (requireAtRuntime) {
        lines.push("const files = [")
        lines.push(fileLines.join(`,\n`))
        lines.push("]")
      } else {
        lines.push("const files = {}")
        lines = lines.concat(fileLines)
      }

      lines.push(`module.exports = files`)

      fs.ensureDirSync(path.dirname(destination))

      fs.writeFileSync(destination, lines.join("\n"))

      console.log(`File Made @${destination}`)
    }

    arrayIntersect(targetA, targetB) {
      if (!targetA || !targetB) {
        return false
      } else if (targetA == "string" && targetB == "string" && targetA == targetB) {
        return true
      } else if (typeof targetA == "string" && Array.isArray(targetB) && targetB.includes(targetA)) {
        return true
      } else if (typeof targetB == "string" && Array.isArray(targetA) && targetA.includes(targetB)) {
        return true
      } else if (targetA.filter(value => targetB.includes(value)).length > 0) {
        return true
      } else {
        return false
      }
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
      const base = name.split(/endpoint-|plugin-|theme-|service-|@factor|@fiction/gi).pop()
      return base.replace(/\//gi, "").replace(/-([a-z])/g, function(g) {
        return g[1].toUpperCase()
      })
    }

    sortPriority(arr) {
      if (!arr || arr.length == 0) return arr

      return arr.sort((a, b) => {
        const ap = a.priority || a.name || 100
        const bp = b.priority || b.name || 100

        return ap < bp ? -1 : ap > bp ? 1 : 0
      })
    }
  })()
}
