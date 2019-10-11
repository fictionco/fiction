import { resolve, dirname, basename } from "path"
import { writeFileSync, ensureDirSync } from "fs-extra"
import { sync as glob } from "glob"
const { FACTOR_CWD } = process.env

export default Factor => {
  return new (class {
    constructor() {
      this.cwdPackage = require(`${FACTOR_CWD}/package.json`)

      this.extensions = this.loadExtensions(this.cwdPackage)

      Factor.$filters.callback("cli-run-create-loaders", () => this.generateLoaders())
    }

    generateExtensionList(packagePaths) {
      const loader = []
      console.log(packagePaths)
      packagePaths.forEach(_ => {
        let {
          name,
          factor: { id, priority, target = false, extend = "plugin" } = {},
          version,
          main = "index.js"
        } = _

        loader.push({
          version,
          name,
          main,
          extend,
          priority: this.getPriority({ priority, name, extend }),
          target: this.normalizeTarget({ target, main }),
          cwd: this.isCWD(name),
          id: this.getId({ id, name })
        })
      })

      return Factor.$utils.sortPriority(loader)
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
          this.writeFileWithLines(
            Factor.$paths.get("loader-server"),
            files.map(({ id, file }) => `files["${id}"] = require("${file}").default`)
          )
        }
      })

      this.makeModuleLoader({
        extensions: this.extensions,

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

    // Webpack doesn't allow dynamic paths in require statements
    // In order to make dynamic require statements, we build loader files
    // Also an easier way to see what is included than by using other techniques
    makeModuleLoader({ extensions, loadTarget, callback }) {
      const files = []

      const filtered = extensions.filter(({ target }) => target[loadTarget])

      filtered.forEach(extension => {
        const { id, target, name, cwd } = extension

        target[loadTarget].forEach(fileName => {
          files.push({
            id: this.getId({ id, name, fileName }),
            file: `${cwd ? ".." : name}/${fileName}`
          })
        })
      })

      callback(files)
    }

    makeFileLoader({ extensions, filename, callback }) {
      const files = []

      extensions.forEach(_ => {
        const { name, cwd, id, main } = _

        const dir = this.getDirectory({ cwd, name, main })
        const requireBase = this.getRequireBase({ cwd, name, main })

        glob(`${dir}/**/${filename}`)
          .map((fullPath, index) => {
            return {
              id: index == 0 ? id : `${id}_${index}`,
              file: fullPath.replace(dir, requireBase),
              path: fullPath
            }
          })
          .forEach(lPath => files.push(lPath))
      })

      callback(files)
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

    normalizeTarget({ target, main }) {
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

    writeFile({ destination, content }) {
      ensureDirSync(dirname(destination))

      writeFileSync(destination, content)
    }

    writeFileWithLines(destination, fileLines) {
      let lines = [`/******** GENERATED FILE - DO NOT EDIT DIRECTLY ********/`]

      lines.push("const files = {}")

      lines = lines.concat(fileLines)

      lines.push(`module.exports = files`)

      ensureDirSync(dirname(destination))

      writeFileSync(destination, lines.join("\n"))
    }

    getWatchDirs() {
      return this.extensions.map(({ name, cwd, main }) =>
        this.getDirectory({ cwd, name, main })
      )
    }

    // Use root application dependencies as the start of the
    // factor dependency tree
    loadExtensions(pkg) {
      const dependants = this.recursiveDependencies([pkg], pkg)

      return this.generateExtensionList(dependants)
    }

    getDirectory({ name, main }) {
      const root = require.resolve(this.isCWD(name) ? FACTOR_CWD : name, main)

      return dirname(root)
    }

    getRequireBase({ cwd, name, main }) {
      return dirname([cwd ? ".." : name, main].join("/"))
    }

    // Determine if a package name is the CWD
    isCWD(name) {
      return name == this.cwdPackage.name ? true : false
    }

    // Set priority by extension type
    // App > Theme > Plugin
    getPriority({ extend, priority, name }) {
      if (priority) return priority

      return this.isCWD(name) ? 1000 : (extend == "theme" ? 150 : 100)
    }

    // Get standard reference ID
    getId({ id, name, fileName = "" }) {
      let out = this.isCWD(name)
        ? "cwd"
        : (id
        ? id
        : name
            .split(/plugin-|theme-|@factor/gi)
            .pop()
            .replace(/\//gi, "")
            .replace(/-([a-z])/g, g => g[1].toUpperCase()))

      // Add file specific ID to end
      if (fileName && !fileName.includes("index")) {
        out += Factor.$lodash.capitalize(fileName)
      }

      return out
    }
  })()
}
