import { dirname, parse } from "path"
import { getPath } from "@factor/tools/paths"
import { toPascalCase, sortPriority } from "@factor/tools/utils"
import fs from "fs-extra"
import glob from "glob"
import log from "@factor/tools/logger"
import { FactorPackageJson, LoadTarget, FactorExtension } from "./types"

export function getCWDPackage(): FactorPackageJson {
  let pkg
  try {
    const p = require(`${getCWD()}/package.json`)

    if (p.name === "@factor/wrapper") {
      if (process.env.FACTOR_ENV != "test") {
        log.warn("Couldn't generate loaders - CWD is workspace root")
      }
    } else {
      pkg = p
    }
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      log.warn("Couldn't generate loaders - CWD has no package.json")
    } else throw error
  }

  return pkg
}

let __extensions // ensure we don't recursively scan more than once
export function getExtensions(): FactorExtension[] {
  if (__extensions) {
    return __extensions
  } else {
    const cwdPackage = getCWDPackage()
    if (cwdPackage) {
      __extensions = loadExtensions(cwdPackage)
      return __extensions
    } else {
      return []
    }
  }
}

export function getFactorDirectories(): string[] {
  return getExtensions().map(({ name, main }) => getDirectory({ name, main }))
}

function getCWD(): string {
  return process.env.FACTOR_CWD || process.cwd()
}

// Determine if a package name is the CWD
function isCWD(name: string): boolean {
  return name === getCWDPackage().name
}

function generateExtensionList(packagePaths): FactorExtension[] {
  const loader = []

  packagePaths.forEach((_) => {
    const {
      name,
      factor: { priority = null, load = false, extend = "plugin" } = {},
      version,
      main = "index"
    } = _

    let { factor: { _id = "" } = {} } = _

    if (!_id) _id = getId({ _id, name })

    loader.push({
      version,
      name,
      main,
      extend,
      priority: getPriority({ priority, name, extend }),
      load: normalizeLoadTarget({ load, main, _id }),
      cwd: isCWD(name),
      _id
    })
  })

  return sortPriority(loader)
}

export function generateLoaders(): void {
  const extensions = getExtensions()

  if (extensions.length == 0) return

  makeModuleLoader({
    extensions,
    loadTarget: "server",
    callback: (files) => {
      writeFile({
        destination: getPath("loader-server"),
        content: loaderString(files)
      })
    }
  })

  makeModuleLoader({
    extensions,
    loadTarget: "app",
    callback: (files) => {
      writeFile({ destination: getPath("loader-app"), content: loaderString(files) })
    }
  })

  makeFileLoader({
    extensions,
    filename: "factor-settings.*",
    callback: (files) => {
      writeFile({
        destination: getPath("loader-settings"),
        content: loaderStringOrdered(files)
      })
    }
  })

  makeFileLoader({
    extensions,
    filename: "factor-styles.*",
    callback: (files) => {
      const imports = files.map((_) => `@import (less) "~${_.file}";`).join(`\n`)
      const content = `${imports}`

      writeFile({ destination: getPath("loader-styles"), content })
    }
  })

  return
}

// Webpack doesn't allow dynamic paths in require statements
// In order to make dynamic require statements, we build loader files
// Also an easier way to see what is included than by using other techniques
function makeModuleLoader({ extensions, loadTarget, callback }): void {
  const files = []

  const filtered = extensions.filter(({ load }) => load[loadTarget])

  filtered.forEach((extension) => {
    const { load, name, cwd } = extension

    load[loadTarget].forEach(({ _id, file, priority = 100 }) => {
      const _module = `${cwd ? ".." : name}/${file}`

      const moduleName = _module.replace(/\.[^/.]+$/, "").replace(/\/index$/, "")

      files.push({
        _id,
        file: moduleName,
        priority
      })
    })
  })

  callback(sortPriority(files))
}

function makeFileLoader({ extensions, filename, callback }): void {
  const files = []

  extensions.forEach((_) => {
    const { name, cwd, _id, priority } = _

    const dir = getDirectory({ name })
    const requireBase = getRequireBase({ cwd, name })

    glob
      .sync(`${dir}/**/${filename}`)
      .map((fullPath, index) => {
        const _module = fullPath.replace(dir, requireBase)
        const moduleName = _module.replace(/\.js$/, "").replace(/\/index$/, "")

        if (moduleName.includes("node_modules")) return false

        return {
          _id: index == 0 ? _id : `${_id}_${index}`,
          file: moduleName,
          path: fullPath,
          priority
        }
      })
      .filter((_) => _)
      .forEach((lPath) => files.push(lPath))
  })

  callback(files)
}

function recursiveDependencies(deps, pkg): FactorPackageJson[] {
  const { dependencies = {}, devDependencies = {} } = pkg

  const d = { ...dependencies, ...devDependencies }

  Object.keys(d)
    .map((_) => require(`${_}/package.json`))
    .filter((_) => typeof _.factor != "undefined" || _.name.includes("factor"))
    .forEach((_) => {
      if (!deps.find((pkg) => pkg.name == _.name)) {
        deps.push(_)
        deps = recursiveDependencies(deps, _)
      }
    })

  return deps
}

// Normalize load key from package.json
// Allow for both simple syntax or full control
// load: ["app", "server"] - load main on app/server
// load: {
//  "server": ["_id": "myId", "file": "some-file.js"]
// }
function normalizeLoadTarget({ load, main, _id }): LoadTarget {
  const __ = {}

  if (!load) return __

  if (Array.isArray(load)) {
    load.forEach((t) => {
      __[t] = [{ file: main, _id }]
    })
  } else if (typeof load == "object") {
    Object.keys(load).forEach((t) => {
      const val = load[t]

      if (!Array.isArray(val)) {
        __[t] = [{ file: val, _id: getId({ _id, main, file: val }) }]
      } else {
        __[t] = val.map((v) => {
          return typeof v == "string"
            ? { file: v, _id: getId({ _id, main, file: v }) }
            : v
        })
      }
    })
  }
  return __
}

function writeFile({ destination, content }): void {
  fs.ensureDirSync(dirname(destination))
  fs.writeFileSync(destination, content)
}

function loaderString(files): string {
  return files.map(({ file }) => `import "${file}"`).join("\n")
}

function loaderStringOrdered(files): string {
  const lines = files.map(
    ({ _id, file, priority }) =>
      `import { default as ${_id} } from "${file}" // ${priority}`
  )

  lines.push(`\n\nexport default [ ${files.map(({ _id }) => _id).join(", ")} ]`)

  return lines.join("\n")
}

// Use root application dependencies as the start of the
// factor dependency tree
function loadExtensions(pkg): FactorExtension[] {
  const dependents = recursiveDependencies([pkg], pkg)

  return generateExtensionList(dependents)
}

function getDirectory({ name, main = "" }): string {
  const resolver = isCWD(name) ? getCWD() : name

  let root
  if (main) {
    root = require.resolve(resolver, { paths: [main] })
  } else {
    root = require.resolve(`${resolver}/package.json`)
  }

  return dirname(root)
}

function getRequireBase({ cwd, name, main = "package.json" }): string {
  return dirname([cwd ? ".." : name, main].join("/"))
}

// Set priority by extension type
// App > Theme > Plugin
function getPriority({ extend, priority, name }): number {
  if (priority) return priority

  const out = 100

  if (isCWD(name)) {
    return 1000
  } else if (extend == "theme") {
    return 150
  }

  return out
}

// Get standard reference ID
function getId({ _id, name = "", main = "index", file = "" }): string {
  let __
  if (isCWD(name)) {
    __ = "cwd"
  } else if (_id) {
    __ = _id
  } else {
    __ = name
      .split(/plugin-|theme-|@factor/gi)
      .pop()
      .replace(/\//gi, "")
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  }

  // Add file specific ID to end
  if (file && parse(file).name != parse(main).name) {
    __ += toPascalCase(file)
  }

  return __
}

export function makeEmptyLoaders(): void {
  const l = ["loader-server", "loader-app", "loader-styles", "loader-settings"]
  l.forEach((pathId) => {
    const content = pathId == "loader-styles" ? "" : ``
    writeFile({ destination: getPath(pathId), content })
  })
}
