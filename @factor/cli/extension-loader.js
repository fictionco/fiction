import { dirname, parse } from "path"
import { getPath } from "@factor/tools/paths"
import { toPascalCase, sortPriority } from "@factor/tools/utils"
import log from "@factor/tools/logger"
import fs from "fs-extra"
import glob from "glob"

export function getCWDPackage() {
  let pkg
  try {
    const p = require(`${getCWD()}/package.json`)

    if (p.name == "@factor/wrapper") {
      if (process.env.FACTOR_ENV != "test") {
        log.warn("Couldn't generate loaders - CWD is workspace root")
      }
    } else {
      pkg = p
    }
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") {
      log.warn("Couldn't generate loaders - CWD has no package.json")
    }
  }

  return pkg
}

let __extensions // ensure we don't recursively scan more than once
export function getExtensions() {
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

export function getFactorDirectories() {
  return getExtensions().map(({ name, main }) => getDirectory({ name, main }))
}

function getCWD() {
  return process.env.FACTOR_CWD || process.cwd()
}

// Determine if a package name is the CWD
function isCWD(name) {
  return name == getCWDPackage().name ? true : false
}

function generateExtensionList(packagePaths) {
  const loader = []

  packagePaths.forEach(_ => {
    let {
      name,
      factor: { _id = null, priority = null, target = false, extend = "plugin" } = {},
      version,
      main = "index"
    } = _

    if (!_id) _id = getId({ _id, name })

    loader.push({
      version,
      name,
      main,
      extend,
      priority: getPriority({ priority, name, extend }),
      target: normalizeTarget({ target, main, _id }),
      cwd: isCWD(name),
      _id
    })
  })

  return sortPriority(loader)
}

export function generateLoaders() {
  const extensions = getExtensions()

  if (extensions.length == 0) return

  makeModuleLoader({
    extensions,
    loadTarget: "server",
    callback: files => {
      writeFile({
        destination: getPath("loader-server"),
        content: loaderString(files)
      })
    }
  })

  makeModuleLoader({
    extensions,
    loadTarget: "app",
    callback: files => {
      writeFile({
        destination: getPath("loader-app"),
        content: loaderString(files)
      })
    }
  })

  makeFileLoader({
    extensions,
    filename: "factor-settings.js",
    callback: files => {
      writeFile({
        destination: getPath("loader-settings"),
        content: loaderStringOrdered(files)
      })
    }
  })

  makeFileLoader({
    extensions,
    filename: "factor-styles.*",
    callback: files => {
      const imports = files.map(_ => `@import (less) "~${_.file}";`).join(`\n`)
      const content = `${imports}`

      writeFile({
        destination: getPath("loader-styles"),
        content
      })
    }
  })

  //console.log("Files Made @", process.env.FACTOR_CWD || process.getCWD())

  return
}

// Webpack doesn't allow dynamic paths in require statements
// In order to make dynamic require statements, we build loader files
// Also an easier way to see what is included than by using other techniques
function makeModuleLoader({ extensions, loadTarget, callback }) {
  const files = []

  const filtered = extensions.filter(({ target }) => target[loadTarget])

  filtered.forEach(extension => {
    const { target, name, cwd } = extension

    target[loadTarget].forEach(({ _id, file, priority = 100 }) => {
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

function makeFileLoader({ extensions, filename, callback }) {
  const files = []

  extensions.forEach(_ => {
    const { name, cwd, _id, main, priority } = _

    const dir = getDirectory({ name })
    const requireBase = getRequireBase({ cwd, name, main })

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
      .filter(_ => _)
      .forEach(lPath => files.push(lPath))
  })

  callback(files)
}

function recursiveDependencies(deps, pkg) {
  const { dependencies = {}, devDependencies = {} } = pkg

  const d = { ...dependencies, ...devDependencies }

  Object.keys(d)
    .map(_ => require(`${_}/package.json`))
    .filter(_ => typeof _.factor != "undefined" || _.name.includes("factor"))
    .forEach(_ => {
      if (!deps.find(pkg => pkg.name == _.name)) {
        deps.push(_)
        deps = recursiveDependencies(deps, _)
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
function normalizeTarget({ target, main, _id }) {
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
        __[t] = [{ file: val, _id: getId({ _id, main, file: val }) }]
      } else {
        __[t] = val.map(v => {
          return typeof v == "string"
            ? { file: v, _id: getId({ _id, main, file: v }) }
            : v
        })
      }
    })
  }
  return __
}

function writeFile({ destination, content }) {
  fs.ensureDirSync(dirname(destination))
  fs.writeFileSync(destination, content)
}

function loaderString(files) {
  return files.map(({ file }) => `import "${file}"`).join("\n")
}

function loaderStringOrdered(files) {
  const lines = files.map(
    ({ _id, file, priority }) =>
      `import { default as ${_id} } from "${file}" // ${priority}`
  )

  lines.push(`\n\nexport default [ ${files.map(({ _id }) => _id).join(", ")} ]`)

  return lines.join("\n")
}

// Use root application dependencies as the start of the
// factor dependency tree
function loadExtensions(pkg) {
  const dependents = recursiveDependencies([pkg], pkg)

  return generateExtensionList(dependents)
}

function getDirectory({ name, main = "" }) {
  const resolver = isCWD(name) ? getCWD() : name

  const root = require.resolve(resolver, { paths: [main] })

  return dirname(root)
}

function getRequireBase({ cwd, name, main }) {
  return dirname([cwd ? ".." : name, main].join("/"))
}

// Set priority by extension type
// App > Theme > Plugin
function getPriority({ extend, priority, name }) {
  if (priority) return priority

  return isCWD(name) ? 1000 : (extend == "theme" ? 150 : 100)
}

// Get standard reference ID
function getId({ _id, name = "", main = "index", file = "" }) {
  let __ = isCWD(name)
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

export function makeEmptyLoaders() {
  const l = ["loader-server", "loader-app", "loader-styles", "loader-settings"]
  l.forEach(pathId => {
    const content = pathId == "loader-styles" ? "" : ``
    writeFile({ destination: getPath(pathId), content })
  })
}

// const loaderUtility = new FactorLoaderUtility()

// export default loaderUtility

// export function generateLoaders() {
//   return loaderUtility.generateLoaders()
// }

// export function getFactorDirectories() {
//   return loaderUtility.getFactorDirectories()
// }
