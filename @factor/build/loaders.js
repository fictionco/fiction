import { dirname, parse } from "path"
import fs from "fs-extra"
import glob from "glob"

import { toPascalCase, sortPriority, addCallback } from "@factor/tools"
import { getPath } from "@factor/paths"

export class FactorLoaderUtility {
  constructor() {
    this.cwdPackage = require(`${this.cwd()}/package.json`)

    this.extensions = this.loadExtensions(this.cwdPackage)

    addCallback("cli-run-create-loaders", () => this.generateLoaders())
  }

  cwd() {
    return process.env.FACTOR_CWD || process.cwd()
  }

  // Determine if a package name is the CWD
  isCWD(name) {
    return name == this.cwdPackage.name ? true : false
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

    return sortPriority(loader)
  }

  generateLoaders() {
    this.makeModuleLoader({
      extensions: this.extensions,
      loadTarget: "server",
      callback: files => {
        this.writeFile({
          destination: getPath("loader-server"),
          content: this.loaderString(files)
        })
      }
    })

    this.makeModuleLoader({
      extensions: this.extensions,
      loadTarget: "app",
      callback: files => {
        this.writeFile({
          destination: getPath("loader-app"),
          content: this.loaderString(files)
        })
      }
    })

    this.makeFileLoader({
      extensions: this.extensions,
      filename: "factor-settings.js",
      callback: files => {
        this.writeFile({
          destination: getPath("loader-settings"),
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
          destination: getPath("loader-styles"),
          content
        })
      }
    })

    //console.log("Files Made @", process.env.FACTOR_CWD || process.cwd())

    return
  }

  // Webpack doesn't allow dynamic paths in require statements
  // In order to make dynamic require statements, we build loader files
  // Also an easier way to see what is included than by using other techniques
  makeModuleLoader({ extensions, loadTarget, callback }) {
    const files = []

    const filtered = extensions.filter(({ target }) => target[loadTarget])

    filtered.forEach(extension => {
      const { target, name, cwd } = extension

      target[loadTarget].forEach(({ _id, file, priority = 100 }) => {
        files.push({ _id, file: `${cwd ? ".." : name}/${file}`, priority })
      })
    })

    callback(sortPriority(files))
  }

  makeFileLoader({ extensions, filename, callback }) {
    const files = []

    extensions.forEach(_ => {
      const { name, cwd, _id, main } = _

      const dir = this.getDirectory({ cwd, name, main })
      const requireBase = this.getRequireBase({ cwd, name, main })

      glob
        .sync(`${dir}/**/${filename}`)
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
      .map(_ => {
        return require(`${_}/package.json`)
      })
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
    fs.ensureDirSync(dirname(destination))
    fs.writeFileSync(destination, content)
  }

  loaderString(files) {
    const fileLines = files
      .map(({ _id, file }) => `  ${_id}: () => import("${file}")`)
      .join(`,\n`)

    let lines = [`/* GENERATED FILE */`, `export default {`, fileLines, `}`]

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
    const resolver = this.isCWD(name) ? this.cwd() : name
    const root = require.resolve(resolver, main)

    return dirname(root)
  }

  getRequireBase({ cwd, name, main }) {
    return dirname([cwd ? ".." : name, main].join("/"))
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
      __ += toPascalCase(file)
    }

    return __
  }

  makeEmptyLoaders() {
    const l = ["loader-server", "loader-app", "loader-styles", "loader-settings"]
    l.forEach(pathId => {
      const content = pathId == "loader-styles" ? "" : ``
      this.writeFile({ destination: getPath(pathId), content })
    })
  }
}

export default new FactorLoaderUtility()
