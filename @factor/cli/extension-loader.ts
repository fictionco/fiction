import { dirname, parse, resolve } from "path"

import { getPath } from "@factor/api/paths"
import { toPascalCase, sortPriority } from "@factor/api/utils"
import fs from "fs-extra"
import glob from "glob"
import log from "@factor/api/logger"
import {
  FactorPackageJson,
  FactorExtension,
  ExtendTypes,
  LoadTargets,
  NormalizedLoadTarget,
  LoadTarget,
  CommandOptions
} from "./types"

interface LoaderFile {
  _id: string;
  file: string;
  priority: number;
  path?: string;
}

export const getCWD = (): string => {
  return process.env.FACTOR_CWD || process.cwd()
}

export const getCWDPackage = (): FactorPackageJson => {
  let pkg
  try {
    const p = require(`${getCWD()}/package.json`)

    if (p.name === "@factor/wrapper") {
      if (process.env.FACTOR_ENV != "test") {
        log.warn(
          "Couldn't generate loaders - Working directory is monorepo/workspace root"
        )
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

// Determine if a package name is the CWD
export const isCWD = (name: string): boolean => {
  return name === getCWDPackage().name
}

const getDirectory = ({ name, main = "" }: { name: string; main?: string }): string => {
  const resolver = isCWD(name) ? getCWD() : name

  let root
  if (main) {
    root = require.resolve(resolver, { paths: [main] })
  } else {
    root = require.resolve(`${resolver}/package.json`)
  }

  return dirname(root)
}

const getRequireBase = ({
  cwd,
  name,
  main = "package.json"
}: {
  cwd: boolean;
  name: string;
  main?: string;
}): string => {
  return dirname([cwd ? ".." : name, main].join("/"))
}

// Set priority by extension type
// App > Theme > Plugin
const getPriority = ({
  extend,
  priority,
  name
}: {
  extend: ExtendTypes;
  priority?: number;
  name: string;
}): number => {
  if (priority && priority >= 0) return priority

  const out = 100

  if (isCWD(name)) {
    return 1000
  } else if (extend == ExtendTypes.Theme) {
    return 150
  }

  return out
}

// Webpack doesn't allow dynamic paths in require statements
// In order to make dynamic require statements, we build loader files
// Also an easier way to see what is included than by using other techniques
const makeModuleLoader = ({
  extensions,
  loadTarget,
  callback
}: {
  extensions: FactorExtension[];
  loadTarget: LoadTargets;
  callback: (files: LoaderFile[]) => void;
}): void => {
  const files: LoaderFile[] = []

  const filtered = extensions.filter(({ load }) => load[loadTarget])

  filtered.forEach(extension => {
    const { load, name, cwd } = extension

    load[loadTarget].forEach(({ _id = "", file, priority = 100 }) => {
      const _module = `${cwd ? ".." : name}/${file}`

      const moduleName = _module.replace(/\.[^./]+$/, "").replace(/\/index$/, "")

      files.push({
        _id,
        file: moduleName,
        priority
      })
    })
  })

  callback(sortPriority(files))
}

const makeFileLoader = ({
  extensions,
  filename,
  callback
}: {
  extensions: FactorExtension[];
  filename: string;
  callback: (files: LoaderFile[]) => void;
}): void => {
  const files: LoaderFile[] = []

  extensions.forEach(_ => {
    const { name, cwd, _id, priority } = _

    const dir = getDirectory({ name })
    const requireBase = getRequireBase({ cwd, name })

    glob
      .sync(`${dir}/**/${filename}`)
      .map((fullPath, index) => {
        const _module = fullPath.replace(dir, requireBase)
        const moduleName = _module.replace(/\.[jt]s$/, "").replace(/\/index$/, "")

        if (moduleName.includes("node_modules")) return

        return {
          _id: index == 0 ? _id : `${_id}_${index}`,
          file: moduleName,
          path: fullPath,
          priority
        }
      })
      .forEach(lPath => {
        if (lPath) {
          files.push(lPath)
        }
      })
  })

  callback(files)
}

const recursiveDependencies = (
  deps: FactorPackageJson[],
  pkg: FactorPackageJson
): FactorPackageJson[] => {
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

// Get standard reference ID
const getId = ({ _id = "", name = "", main = "index", file = "" }): string => {
  let __
  if (isCWD(name)) {
    __ = "cwd"
  } else if (_id) {
    __ = _id
  } else {
    const afterSlash = name.split(/plugin-|theme-|@factor/gi).pop() ?? "id"
    __ = afterSlash.replace(/\//gi, "").replace(/-([a-z])/g, g => g[1].toUpperCase())
  }

  // Add file specific ID to end
  if (file && parse(file).name != parse(main).name) {
    __ += toPascalCase(file)
  }

  return __
}

const writeFile = ({
  destination,
  content
}: {
  destination: string;
  content: string;
}): void => {
  fs.ensureDirSync(dirname(destination))
  fs.writeFileSync(destination, content)
}

export const makeEmptyLoaders = (): void => {
  const l = ["loader-server", "loader-app", "loader-styles", "loader-settings"]
  l.forEach(pathId => {
    const content = pathId == "loader-styles" ? "" : ``
    writeFile({ destination: getPath(pathId), content })
  })
}

// Normalize load key from package.json
// Allow for both simple syntax or full control
// load: ["app", "server"] - load main on app/server
// load: {
//  "server": ["_id": "myId", "file": "some-file.js"]
// }
const normalizeLoadTarget = ({
  load,
  main,
  _id
}: {
  load: LoadTarget;
  main: string;
  _id: string;
}): NormalizedLoadTarget => {
  const __: NormalizedLoadTarget = { app: [], server: [] }

  if (!load) return __

  if (Array.isArray(load)) {
    load.forEach(t => {
      __[t] = [{ file: main, _id }]
    })
  } else if (typeof load == "object") {
    Object.keys(load).forEach(t => {
      const val = load[t]

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

const loaderString = (files: LoaderFile[]): string => {
  return files.map(({ file }) => `import "${file}"`).join("\n")
}

const loaderStringOrdered = (files: LoaderFile[]): string => {
  const lines = files.map(
    ({ _id, file, priority }) =>
      `import { default as ${_id} } from "${file}" // ${priority}`
  )

  lines.push(`\n\nexport default [ ${files.map(({ _id }) => _id).join(", ")} ]`)

  return lines.join("\n")
}

export const generateExtensionList = (
  packagePaths: FactorPackageJson[]
): FactorExtension[] => {
  const loader: FactorExtension[] = []

  packagePaths.forEach(_ => {
    const {
      name,
      factor: { priority = -1, load = [], extend = ExtendTypes.Plugin } = {},
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

// Use root application dependencies as the start of the
// factor dependency tree
const loadExtensions = (pkg: FactorPackageJson): FactorExtension[] => {
  const dependents = recursiveDependencies([pkg], pkg)

  return generateExtensionList(dependents)
}

let __extensions: FactorExtension[] // ensure we don't recursively scan more than once
export const getExtensions = (): FactorExtension[] => {
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

export const getFactorDirectories = (): string[] => {
  return getExtensions().map(({ name, main }) => getDirectory({ name, main }))
}

export const generateLoaders = (options?: CommandOptions): void => {
  if (options && options.clean) {
    fs.removeSync(resolve(getCWD(), ".factor"))
    fs.removeSync(resolve(getCWD(), "dist"))
  }

  const extensions = getExtensions()

  if (extensions.length == 0) return

  makeModuleLoader({
    extensions,
    loadTarget: LoadTargets.Server,
    callback: (files: LoaderFile[]) => {
      writeFile({
        destination: getPath("loader-server"),
        content: loaderString(files)
      })
    }
  })

  makeModuleLoader({
    extensions,
    loadTarget: LoadTargets.App,
    callback: (files: LoaderFile[]) => {
      writeFile({ destination: getPath("loader-app"), content: loaderString(files) })
    }
  })

  makeFileLoader({
    extensions,
    filename: "factor-settings.*",
    callback: (files: LoaderFile[]) => {
      writeFile({
        destination: getPath("loader-settings"),
        content: loaderStringOrdered(files)
      })
    }
  })

  makeFileLoader({
    extensions,
    filename: "factor-styles.*",
    callback: (files: LoaderFile[]) => {
      const imports = files.map(_ => `@import (less) "~${_.file}";`).join(`\n`)
      const content = `${imports}`

      writeFile({ destination: getPath("loader-styles"), content })
    }
  })

  return
}
