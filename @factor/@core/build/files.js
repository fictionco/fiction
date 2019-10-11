import { resolve, dirname } from "path"
import { writeFileSync, ensureDirSync } from "fs-extra"
import { sync as glob } from "glob"

export default Factor => {
  return new (class {
    constructor() {
      this.cwdPackage = require(process.env.FACTOR_CWD, "package.json")

      this.extensions = this.loadExtensions(this.cwdPackage)

      Factor.$filters.callback("cli-run-create-loaders", () => this.generateLoaders())
    }

    // Returns all extensions or all of certain type
    getExtensions(type = false) {
      return type ? this.extensions.filter(_ => _.extend == type) : this.extensions
    }

    generateLoaders() {
      this.makeModuleLoader({
        extensions: this.extensions,
        loadTarget: "server",
        callback: files => {
          const fileLines = files.map(
            ({ id, file }) => `files["${id}"] = require("${file}").default`
          )

          this.writeFileWithLines(Factor.$paths.get("loader-server"), fileLines)
        }
      })

      this.makeModuleLoader({
        extensions: this.extensions,
        destination: Factor.$paths.get("loader-app"),
        loadTarget: "app",
        callback: files => {
          const fileLines = files.map(
            ({ id, file }) => `files["${id}"] = require("${file}").default`
          )

          this.writeFileWithLines(Factor.$paths.get("loader-app"), fileLines)
        }
      })

      this.makeFileLoader({
        extensions: this.extensions,
        filename: "factor-settings.js",
        callback: files => {
          const fileLines = files.map(
            ({ id, file }) => `files["${id}"] = require("${file}").default`
          )

          this.writeFileWithLines(Factor.$paths.get("loader-settings"), fileLines)
        }
      })

      this.makeFileLoader({
        extensions: this.extensions,
        filename: "factor-styles.*",
        callback: files => {
          const imports = files.map(_ => `@import (less) "~${_.file}";`).join(`\n`)
          const content = `${imports}`

          this.writeFile({
            destination: Factor.$paths.get("loader-styles"),
            content
          })
        }
      })

      return
    }

    _cwdMainDir(requireRoot) {
      const parts = [requireRoot]

      const rel = Factor.$paths
        .get("source")
        .replace(`${Factor.$paths.get("app")}`, "")
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

    // Webpack doesn't allow dynamic paths in require statements
    // In order to make dynamic require statements, we build loader files
    // Also an easier way to see what is included than by using other techniques
    makeModuleLoader({ extensions, loadTarget, callback }) {
      const files = []

      const filtered = extensions.filter(({ target }) => target[loadTarget])

      filtered.forEach(extension => {
        const { id, target } = extension

        target[loadTarget].forEach(fileName => {
          const requirePath = this.requirePath(fileName, extension)
          let _id = !fileName.includes("index")
            ? `${id}${Factor.$lodash.capitalize(fileName)}`
            : id

          files.push({ id: _id, file: requirePath })
        })
      })

      callback(files)
    }

    makeFileLoader({ extensions, filename, callback }) {
      const files = []

      extensions.forEach(_ => {
        const { mainDir, requireRoot, cwd, id, priority } = _

        const requireDir = cwd
          ? this._cwdMainDir(requireRoot)
          : this._moduleMainDir(requireRoot)

        glob(`${mainDir}/**/${filename}`)
          .map((fullPath, index) => {
            return {
              id: index == 0 ? id : `${id}_${index}`,
              file: fullPath.replace(mainDir, requireDir),
              path: fullPath
            }
          })
          .forEach(lPath => files.push(lPath))
      })

      callback(files)
    }

    // Use root application dependencies as the start of the
    // factor dependency tree
    loadExtensions(pkg) {
      return this.generateExtensionList(this.recursiveDependencies([pkg], pkg))
    }

    recursiveDependencies(deps, pkg) {
      const { dependencies = {}, devDependencies = {} } = pkg

      const d = { ...dependencies, ...devDependencies }

      Object.keys(d)
        .map(_ => require(`${_}/package.json`))
        .filter(_ => typeof _.factor != "undefined" || _.name.includes("factor"))
        .forEach(_ => {
          if (!deps.find(pkg => pkg.name == _.name)) {
            deps.push(_)
            deps = this.recursiveDependencies(deps, _)
          }
        })

      return deps
    }

    moduleMainFile({ name, main, cwd }) {
      let mainFileParts = [cwd ? ".." : name]

      if (cwd) {
        mainFileParts.push(main)
      }

      return mainFileParts.join("/")
    }

    filterExtensions({ loadTarget, extensions }) {
      let filtered = extensions.filter(({ target }) => target[loadTarget])

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

    generateExtensionList(packagePaths) {
      const loader = []
      packagePaths.forEach(_ => {
        let fields = {}

        let {
          name,
          factor: { id, priority, target = false, extend = "plugin" } = {},
          version,
          main = "index.js"
        } = _

        target = this._normalizeTargetProperty({ target, main })

        const cwd = name == this.cwdPackage.name ? true : false
        id = cwd ? "cwd" : id || this.makeId(name)

        if (!priority) {
          // App > Theme > Plugin
          priority = cwd ? 1000 : (extend == "theme" ? 150 : 100)
        }

        fields = { version, name, priority, target, extend, cwd, main, id }

        fields.requireRoot = cwd ? ".." : name
        fields.mainFile = this.moduleMainFile(fields)
        fields.mainDir = cwd
          ? Factor.$paths.get("source")
          : dirname(require.resolve(fields.mainFile))

        loader.push(fields)
      })

      return Factor.$utils.sortPriority(loader)
    }

    getWatchDirs() {
      return this.extensions.map(_ => _.mainDir)
    }

    requirePath(fileName, { name, cwd }) {
      let p = [cwd ? ".." : name]

      if (!fileName.includes("index") || cwd) {
        p.push(fileName)
      }

      return p.join("/")
    }

    writeFile({ destination, content }) {
      ensureDirSync(path.dirname(destination))

      writeFileSync(destination, content)

      Factor.$log.success(`File Made @${destination}`)
    }

    writeFileWithLines(destination, fileLines) {
      const fs = require("fs-extra")
      let lines = [`/******** GENERATED FILE ********/`]

      lines.push("const files = {}")

      lines = lines.concat(fileLines)

      lines.push(`module.exports = files`)

      ensureDirSync(path.dirname(destination))

      fs.writeFileSync(destination, lines.join("\n"))

      console.log(`File Made @${destination}`)
    }

    makeId(name) {
      const base = name.split(/endpoint-|plugin-|theme-|@factor/gi).pop()
      return base.replace(/\//gi, "").replace(/-([a-z])/g, g => g[1].toUpperCase())
    }
  })()
}
