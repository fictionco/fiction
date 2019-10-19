import { dirname, parse } from "path"
import { writeFileSync, ensureDirSync } from "fs-extra"
import { sync as glob } from "glob"

export default Factor => {
  const { FACTOR_CWD } = process.env

  return new (class {
    constructor() {
      this.cwdPackage = require(`${FACTOR_CWD}/package.json`)

      this.extensions = this.loadExtensions(this.cwdPackage)

      Factor.$filters.callback("cli-run-create-loaders", () => this.generateLoaders())
    }

    generateExtensionList(packagePaths) {
      const loader = []

      packagePaths.forEach(_ => {
        let {
          name,
          factor: { _id, priority, target = false, extend = "plugin" } = {},
          version,
          main = "index.js"
        } = _

        _id = this.getId({ _id, name })

        loader.push({
          version,
          name,
          main,
          extend,
          priority: this.getPriority({ priority, name, extend }),
          target: this.normalizeTarget({ target, main, _id }),
          cwd: this.isCWD(name),
          _id
        })
      })

      return Factor.$utils.sortPriority(loader)
    }

    generateLoaders() {
      this.makeModuleLoader({
        extensions: this.extensions,
        loadTarget: "server",
        callback: files => {
          this.writeFile({
            destination: Factor.$paths.get("loader-server"),
            content: this.loaderString(files)
          })
        }
      })

      this.makeModuleLoader({
        extensions: this.extensions,
        loadTarget: "app",
        callback: files => {
          this.writeFile({
            destination: Factor.$paths.get("loader-app"),
            content: this.loaderString(files)
          })
        }
      })

      this.makeFileLoader({
        extensions: this.extensions,
        filename: "factor-settings.js",
        callback: files => {
          this.writeFile({
            destination: Factor.$paths.get("loader-settings"),
            content: this.loaderString(files)
          })
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
        const { _id, target, name, cwd } = extension

        target[loadTarget].forEach(({ _id, file, priority = 100 }) => {
          files.push({ _id, file: `${cwd ? ".." : name}/${file}`, priority })
        })
      })

      callback(Factor.$utils.sortPriority(files))
    }

    makeFileLoader({ extensions, filename, callback }) {
      const files = []

      extensions.forEach(_ => {
        const { name, cwd, _id, main } = _

        const dir = this.getDirectory({ cwd, name, main })
        const requireBase = this.getRequireBase({ cwd, name, main })

        glob(`${dir}/**/${filename}`)
          .map((fullPath, index) => {
            return {
              _id: index == 0 ? _id : `${_id}_${index}`,
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

    // Normalize target key from package.json
    // Allow for both simple syntax or full control
    // target: ["app", "server"] - load main on app/server
    // target: {
    //  "server": ["_id": "myId", "file": "some-file.js"]
    // }
    normalizeTarget({ target, main, _id }) {
      const __ = {}

      if (!target) return __

      if (Array.isArray(target)) {
        target.forEach(t => {
          __[t] = [{ file: main, _id }]
        })
      } else if (typeof target == "object") {
        Object.keys(target).forEach(t => {
          const val = target[t]

          if (!Array.isArray(val)) {
            __[t] = [{ file: val, _id: this.getId({ _id, main, file: val }) }]
          } else {
            __[t] = val.map(v => {
              return typeof v == "string"
                ? { file: v, _id: this.getId({ _id, main, file: v }) }
                : v
            })
          }
        })
      }
      return __
    }

    writeFile({ destination, content }) {
      ensureDirSync(dirname(destination))

      writeFileSync(destination, content)
    }

    loaderString(files) {
      const fileLines = files.map(
        ({ _id, file }) => `export { default as ${_id} } from "${file}"`
      )

      let lines = [`/******** GENERATED FILE - DO NOT EDIT DIRECTLY ********/`]

      lines = lines.concat(fileLines)

      return lines.join("\n")
    }

    // Returns all extensions or all of certain type
    getExtensions() {
      return this.extensions
    }

    getFactorDirectories() {
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
    getId({ _id, name = "", main = "index", file = "" }) {
      let __ = this.isCWD(name)
        ? "cwd"
        : (_id
        ? _id
        : name
            .split(/plugin-|theme-|@factor/gi)
            .pop()
            .replace(/\//gi, "")
            .replace(/-([a-z])/g, g => g[1].toUpperCase()))

      // Add file specific ID to end
      if (file && parse(file).name != parse(main).name) {
        __ += Factor.$utils.toPascalCase(file)
      }

      return __
    }

    makeEmptyLoaders() {
      const l = ["loader-server", "loader-app", "loader-styles", "loader-settings"]
      l.forEach(_ => {
        const content = _ == "loader-styles" ? "" : ``
        this.writeFile({
          destination: Factor.$paths.get(_),
          content
        })
      })
    }
  })()
}
