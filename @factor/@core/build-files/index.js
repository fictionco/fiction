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
      return type ? this.extensions.filter(_ => _.extend == type) : this.extensions
    }

    generateLoaders() {
      this.makeModuleLoader({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-server"),
        mainTarget: "server"
      })

      this.makeModuleLoader({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-app"),
        mainTarget: "app"
      })

      this.makeFileLoader({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-settings"),
        filename: "factor-settings.js"
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

      // if sub folder, add (/src)
      if (rel && rel != requireRoot.split("/").pop()) parts.push(rel)

      return parts.join("/")
    }

    makeFileLoader({ extensions, destination, filename }) {
      const files = []

      extensions.forEach(_ => {
        const { mainDir, requireRoot, cwd, id } = _

        const requireDir = cwd
          ? this._cwdMainDir(requireRoot)
          : this._moduleMainDir(requireRoot)

        if (existsSync(resolve(mainDir, filename))) {
          files.push({ id, file: `${requireDir}/${filename}` })
        }
      })

      const fileLines = files.map(
        ({ id, file }) => `files["${id}"] = require("${file}").default`
      )

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

    moduleMainFile({ name, main, cwd }) {
      let mainFileParts = [cwd ? ".." : name]

      if (cwd) {
        mainFileParts.push(main)
      }

      return mainFileParts.join("/")
    }

    filterExtensions({ mainTarget, extensions }) {
      let filtered = extensions.filter(({ target }) => target[mainTarget])

      return Factor.$filters.apply(`packages-loader`, filtered, {
        buildTarget,
        extensions
      })
    }

    _normalizeTargetProperty({ target, main }) {
      const out = {}

      if (!target) return out

      if (Array.isArray(target)) {
        target.forEach(_ => {
          out[_] = [main]
        })
      } else if (typeof target == "object") {
        Object.keys(target).forEach(k => {
          const val = target[k]
          out[k] = Array.isArray(val) ? val : [val]
        })
      }
      return out
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

        target = this._normalizeTargetProperty({ target, main })

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
        fields.mainFile = this.moduleMainFile(fields)
        fields.mainDir = cwd
          ? Factor.$paths.get("source")
          : dirname(require.resolve(fields.mainFile))

        loader.push(fields)
      })

      return this.sortPriority(loader)
    }

    getWatchDirs() {
      return this.extensions.map(_ => _.mainDir)
    }

    requirePath(fileName, { name, cwd }) {
      let mainFileParts = [cwd ? ".." : name]

      if (!fileName.includes("index") || cwd) {
        mainFileParts.push(fileName)
      }

      return mainFileParts.join("/")
    }

    // Webpack doesn't allow dynamic paths in require statements
    // In order to make dynamic require statements, we build loader files
    // Also an easier way to see what is included than by using other techniques
    makeModuleLoader({ extensions, destination, mainTarget }) {
      const filtered = extensions.filter(({ target }) => target[mainTarget])

      const fileLines = []
      filtered.forEach(extension => {
        const { id, target } = extension

        target[mainTarget].forEach(fileName => {
          const requirePath = this.requirePath(fileName, extension)
          let theId = !fileName.includes("index")
            ? `${id}${Factor.$lodash.capitalize(fileName)}`
            : id
          fileLines.push(`files["${theId}"] = require("${requirePath}").default`)
        })
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
      const base = name
        .split(/endpoint-|plugin-|theme-|service-|@factor|@fiction/gi)
        .pop()
      return base.replace(/\//gi, "").replace(/-([a-z])/g, function(g) {
        return g[1].toUpperCase()
      })
    }

    sortPriority(arr) {
      if (!arr || arr.length == 0) return arr

      return arr
        .sort(function(a, b) {
          const ap = a.id
          const bp = b.id
          return ap < bp ? -1 : ap > bp ? 1 : 0
        })
        .sort((a, b) => {
          const ap = a.priority || 100
          const bp = b.priority || 100

          return ap < bp ? -1 : ap > bp ? 1 : 0
        })
    }
  })()
}
