const path = require("path")
const { resolve, dirname } = path
const { existsSync } = require("fs-extra")
module.exports.default = Factor => {
  return new (class {
    constructor() {
      const gen = Factor.$paths.get("generated")

      this.namespace = "factor"

      this.build = process.env.NODE_ENV === "production" ? "production" : "development"

      Factor.$paths.add({
        "loader-app": resolve(gen, "loader-app.js"),
        "loader-server": resolve(gen, "loader-server.js"),
        "loader-settings": resolve(gen, "loader-settings.js")
      })

      this.cwdPackage = require(resolve(Factor.$paths.get("app"), "package.json"))

      this.extensions = this.getExtensions()

      if (Factor.FACTOR_TARGET == "server") {
        Factor.$filters.callback("cli-run-create-loaders", _ => this.generateLoaders(_))
      }
    }

    getExtended(type = false) {
      if (!type) {
        return this.extensions
      } else {
        return this.extensions.filter(_ => _.extend == type)
      }
    }

    generateLoaders() {
      this.makeModuleLoader({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-server"),
        buildTarget: ["server", "app"],
        mainTarget: "server"
      })

      this.makeModuleLoader({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-app"),
        buildTarget: ["app"],
        mainTarget: "app"
      })

      this.makeFileLoader({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-settings"),
        filename: "theme-settings.js"
      })

      console.log(`Loaders built for ${this.extensions.length} Extensions`)

      return
    }

    _cwdMainDir(requireRoot) {
      const parts = [requireRoot]

      const rel = Factor.$paths
        .get("source")
        .replace(`${process.cwd()}`, "")
        .replace(/^\/|\/$/g, "")

      if (rel) parts.push(rel)

      return parts.join("/")
    }

    _moduleMainDir(requireRoot) {
      const parts = [requireRoot]
      const rel = dirname(require.resolve(requireRoot))
        .split("/")
        .pop()

      if (rel) parts.push(rel)

      return parts.join("/")
    }

    makeFileLoader({ extensions, destination, filename }) {
      const files = []

      extensions.forEach(_ => {
        const { name, mainFile, mainDir, requireRoot, cwd, id } = _
        const parts = [requireRoot]

        const requireDir = cwd ? this._cwdMainDir(requireRoot) : this._moduleMainDir(requireRoot)
        if (existsSync(resolve(mainDir, filename))) {
          files.push({ id, file: `${requireDir}/${filename}` })
        }
      })

      const fileLines = files.map(({ id, file }) => `files["${id}"] = require("${file}").default`)

      this._writeFile(Factor.$paths.get("loader-settings"), fileLines)
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

    moduleMainFile({ name, main, mainTarget, target, cwd }) {
      let mroot = cwd ? ".." : name
      let mainFileParts = [mroot]

      if (typeof target == "object" && !Array.isArray(target) && target[mainTarget] && target[mainTarget] != "index") {
        if (target[mainTarget] != "index.js") {
          mainFileParts.push(target[mainTarget])
        }
      } else if (cwd) {
        mainFileParts.push(main)
      }

      return mainFileParts.join("/")
    }

    filterExtensions({ buildTarget, extensions }) {
      let filtered = extensions.filter(({ target }) => {
        target = !Array.isArray(target) ? Object.keys(target) : target
        return this.arrayIntersect(buildTarget, target)
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

        const cwd = name == this.cwdPackage.name ? true : false
        id = cwd ? "cwd" : id || this.makeId(name)
        // User App Comes Last (by default)
        priority = cwd ? 1000 : priority

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

        fields.requireRoot = cwd ? ".." : name
        fields.mainFile = this.moduleMainFile({ name, main, target, mainTarget: "app", cwd })
        fields.mainFileServer = this.moduleMainFile({ name, main, target, mainTarget: "server", cwd })

        fields.mainDir = cwd ? Factor.$paths.get("source") : dirname(require.resolve(fields.mainFile))

        loader.push(fields)
      })

      return this.sortPriority(loader)
    }

    getWatchDirs() {
      return this.extensions.map(_ => _.mainDir)
    }

    // Webpack doesn't allow dynamic paths in require statements
    // In order to make dynamic require statements, we build loader files
    // Also an easier way to see what is included than by using other techniques
    makeModuleLoader({ extensions, destination, mainTarget, buildTarget, requireAtRuntime = false }) {
      const filtered = this.filterExtensions({ mainTarget, buildTarget, extensions })

      const fileLines = []
      filtered.forEach(extension => {
        const { id, mainFile, mainFileServer } = extension

        const theFile = mainTarget == "server" ? mainFileServer : mainFile
        if (requireAtRuntime) {
          fileLines.push(JSON.stringify(extension, null, "  "))
        } else {
          fileLines.push(`files["${id}"] = require("${theFile}").default`)
        }
      })

      this._writeFile(destination, fileLines)
    }

    _writeFile(destination, fileLines) {
      const fs = require("fs-extra")
      let lines = [`/******** GENERATED FILE ********/`]

      lines.push("const files = {}")

      lines = lines.concat(fileLines)

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
