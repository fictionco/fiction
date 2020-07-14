import { dirname, parse, resolve, join, basename, normalize } from "path"
import { getWorkingDirectory, toPascalCase, sortPriority } from "@factor/api/utils"
import { getPath } from "@factor/api/paths"

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
  CommandOptions,
} from "./types"

interface LoaderFile {
  _id: string
  file: string
  priority: number
  path?: string
  writeFile?: { filename: string; content: string }
  group?: string
}

/**
 * Returns a normalized directory path
 * Normalization prevents any problems with windows paths
 * @param rawPath - the raw path
 */
const nd = (rawPath: string): string => {
  return normalize(dirname(rawPath))
}

/**
 * Gets the package.json from the CWD (current working directory)
 * @param cwd - working directory path
 */
export const getWorkingDirectoryPackage = (cwd?: string): FactorPackageJson => {
  let pkg
  try {
    const p = require(`${getWorkingDirectory(cwd)}/package.json`)

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
      log.warn("Couldn't generate loaders - working directory has no package.json")
    } else throw error
  }

  return pkg
}

/**
 * Gets the resolved 'main' directory path for an extension
 * @param name - package.json name
 * @param isCwd - is the package the app?
 * @param cwd - the working directory
 * @param main - the main file
 */
const getDirectory = ({
  name,
  isCwd,
  cwd,
  main = "",
}: {
  name: string
  main?: string
  isCwd: boolean
  cwd?: string
}): string => {
  const resolver = isCwd ? getWorkingDirectory(cwd) : name

  let root
  if (main) {
    root = require.resolve(resolver, { paths: [main] })
  } else {
    root = require.resolve(`${resolver}/package.json`)
  }

  return nd(root)
}

/**
 * Gets the path needed for node resolve taking into account main files and cwd
 * @param name - package.json name
 * @param isCwd - is the package the app?
 * @param cwd - the working directory
 * @param main - the main file
 */
const getResolver = ({
  name,
  isCwd,
  cwd,
  main = "package.json",
}: {
  name: string
  main?: string
  isCwd: boolean
  cwd?: string
}): string => {
  const resolverRoot = isCwd ? getWorkingDirectory(cwd) : name

  return `${resolverRoot}/${main}`
}

/**
 * Gets the base module require path
 * Follows the node format rather than path
 *
 * @param isCwd - is the package the working directory
 * @param name - the module name (from package.json)
 * @param main - the main file of the package
 */
const getRequireBase = ({
  isCwd,
  name,
  main = "package.json",
}: {
  isCwd: boolean
  name: string
  main?: string
}): string => {
  const mainFile = join(...[isCwd ? ".." : name, main])
  return nd(mainFile)
}

/**
 * Set ordering priority by file type
 * @example
 * - plugin = 100 (default)
 * - theme = 150
 * - app = 1000
 *
 * @param extend - type of extension
 * @param priority - use assigned priority if its set
 * @param isCwd - is the package the working directory of the app
 */
const getPriority = ({
  extend,
  priority,
  isCwd,
}: {
  extend: ExtendTypes
  priority?: number
  name: string
  isCwd: boolean
}): number => {
  if (priority && priority >= 0) return priority

  const out = 100

  if (isCwd) {
    return 1000
  } else if (extend == ExtendTypes.Theme) {
    return 150
  }

  return out
}

/**
 * Webpack doesn't allow dynamic paths in require statements
 * In order to make dynamic require statements, we build loader files
 *
 * @param extensions - factor extensions
 * @param loadTarget - the loading environment
 * @param callback - function to call with the results
 * @param additional - additional files to add to results (advanced)
 */
const makeModuleLoader = ({
  extensions,
  loadTarget,
  callback,
  additional = [],
}: {
  extensions: FactorExtension[]
  loadTarget: LoadTargets
  callback: (files: LoaderFile[]) => void
  cwd?: string
  additional?: LoaderFile[]
}): void => {
  const files: LoaderFile[] = []

  const filtered = extensions.filter(({ load }) => load[loadTarget])

  filtered.forEach((extension) => {
    const { load, name, isCwd } = extension

    load[loadTarget].forEach(({ _id = "", file, priority = 100 }) => {
      const _module = `${isCwd ? ".." : name}/${file}`

      const moduleName = _module.replace(/\.[^./]+$/, "").replace(/\/index$/, "")

      files.push({ _id, file: moduleName, priority })
    })
  })

  callback(sortPriority([...files, ...additional]))
}

/**
 * Scans Factor directories for a file name via glob
 * @param extensions - the extensions to scan
 * @param filename - the name of the file (w glob support)
 * @param callback - the function to call with the results
 * @param cwd - working directory
 * @additional - additional files to add to callback (advanced)
 */
const makeFileLoader = ({
  extensions,
  filename,
  callback,
  cwd,
  additional = [],
}: {
  extensions: FactorExtension[]
  filename: string
  callback: (files: LoaderFile[]) => void
  cwd?: string
  additional?: LoaderFile[]
}): void => {
  const files: LoaderFile[] = []

  extensions.forEach((_) => {
    const { name, isCwd, _id, priority } = _

    const dir = getDirectory({ name, isCwd, cwd })
    const requireBase = getRequireBase({ isCwd, name })

    const fileGlob = `${dir}/**/${filename}*`

    glob
      .sync(fileGlob)
      .map((_) => normalize(_))
      .filter((path) => {
        // Don't include anything inside of node_modules
        // this isn't very efficient since it searches them anyway, but couldn't make it work otherwise
        const sub = path.replace(dir, "")
        return sub.includes("node_modules") ? false : true
      })
      .map((fullPath, index) => {
        const _module = fullPath.replace(dir, requireBase)

        /**
         * Make sure posix path,
         * remove file extension and
         * index if at end
         */
        const moduleName = _module
          .replace(/\\/g, "/")
          .replace(/\.[jt]s$/, "")
          .replace(/\/index$/, "")

        const reg = new RegExp(`.*${filename}-(.*)\\.`)
        const capture = _module.match(reg)
        const group = capture && capture.length > 1 ? capture[1] : ""

        let newId = _id

        if (group) newId += `_${group}`

        if (index > 0) newId += `_${index}`

        return {
          _id: newId,
          file: moduleName,
          path: fullPath,
          priority,
          group,
        }
      })
      .forEach((lPath) => {
        if (lPath) {
          files.push(lPath)
        }
      })
  })

  callback([...files, ...additional])
}

/**
 * Recursively gets dependencies with 'factor' attribute
 * Also track modules that are disabled by apps/themes/plugins
 * @param dependents - dependencies of a package
 * @param pkg - the calling package.json
 */
const recursiveDependencies = (
  dependents: FactorPackageJson[],
  pkg: FactorPackageJson,
  disabled: string[],
  options?: { shallow?: true }
): { dependents: FactorPackageJson[]; disabled: string[] } => {
  const { dependencies = {}, factor: { disable = [] } = {} } = pkg

  disabled = [...disabled, ...disable]

  Object.keys(dependencies)
    .map((_) => {
      // Some external dependencies may throw errors due to mismatching export
      // Currently seeing this with 'envfile'
      let p
      try {
        p = require(`${_}/package.json`)
      } catch {
        //silence
      }

      return p
    })
    .filter((_) => _ && typeof _.factor != "undefined")
    .forEach((_) => {
      // don't add if it's already there
      if (!dependents.find((pkg) => pkg.name == _.name)) {
        dependents.push(_)

        if (!options?.shallow) {
          // Preceding (;) is needed when not using const/let

          ;({ dependents, disabled } = recursiveDependencies(
            dependents,
            _,
            disabled,
            options
          ))
        }
      }
    })

  return { dependents, disabled }
}

/**
 * Gets a standard reference ID based on package.json params
 */
const getId = ({
  _id = "",
  name = "",
  main = "index",
  file = "",
  isCwd = false,
}): string => {
  let __
  if (isCwd) {
    __ = "cwd"
  } else if (_id) {
    __ = _id
  } else {
    const afterSlash = name.split(/plugin-|theme-|@factor/gi).pop() ?? "id"
    __ = afterSlash
      .replace(/\//gi, "")
      .replace(/[!#$%&*@^]/g, "")
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  }

  // Add file specific ID to end
  if (file && parse(file).name != parse(main).name) {
    __ += toPascalCase(file)
  }

  return __
}

const writeFile = ({
  destination,
  content,
}: {
  destination: string
  content: string
}): void => {
  fs.ensureDirSync(nd(destination))
  fs.writeFileSync(normalize(destination), content)
}

export const makeEmptyLoaders = (): void => {
  const l = ["loader-server", "loader-app", "loader-styles", "loader-settings"]
  l.forEach((pathId) => {
    const content = pathId == "loader-styles" ? "" : ``
    writeFile({ destination: getPath(pathId), content })
  })
}

/**
 * Normalize load key from package.json > factor
 * Allow for both simple syntax or full control
 * @example
 * - load: ["app", "server"] - load main on app/server
 * - load: {
 *    "server": ["_id": "myId", "file": "some-file.js"]
 *   }
 *
 * @param object.load - load target "server" or "client"
 * @param main - main file
 * @param _id - extension id, helps with naming convention
 *
 * @returns normalized object representing desired auto-load
 */
const normalizeLoadTarget = ({
  load,
  main,
  _id,
  isCwd,
}: {
  load: LoadTarget
  main: string
  _id: string
  isCwd: boolean
}): NormalizedLoadTarget => {
  const __: NormalizedLoadTarget = { app: [], server: [] }

  if (!load) return __

  if (Array.isArray(load)) {
    load.forEach((t) => {
      __[t] = [{ file: main, _id }]
    })
  } else if (typeof load == "object") {
    Object.keys(load).forEach((t) => {
      const val = load[t]

      if (!Array.isArray(val)) {
        __[t] = [
          { file: join(nd(main), val), _id: getId({ _id, main, file: val, isCwd }) },
        ]
      } else {
        __[t] = val.map((v) => {
          return typeof v == "string"
            ? { file: join(nd(main), v), _id: getId({ _id, main, file: v, isCwd }) }
            : { ...v, file: join(nd(main), v.file) }
        })
      }
    })
  }
  return __
}

/**
 * Creates a string import statement to load a file
 * @param files - module names used to create the string
 */
const loaderString = (files: LoaderFile[]): string => {
  return files.map(({ file }) => `import "${file}"`).join("\n")
}
/**
 * Creates an import string, that loads things in a priority based order
 * @param files - module names to write to string
 */
const loaderStringOrdered = (files: LoaderFile[]): string => {
  const lines = files.map(
    ({ _id, file, priority }) =>
      `import { default as ${_id} } from "${file}" // ${priority}`
  )

  lines.push(`\n\nexport default [ ${files.map(({ _id }) => _id).join(", ")} ]`)

  return lines.join("\n")
}

/**
 * Creates an import string, that loads things in a priority based order
 * @param files - module names to write to string
 */
const loaderStringOrderedAndGrouped = (files: LoaderFile[]): string => {
  const lines = files.map(
    ({ _id, file, priority }) =>
      `import { default as ${_id} } from "${file}" // ${priority}`
  )

  const groups: { [key: string]: LoaderFile[] } = {}

  files.forEach((file) => {
    const grp = file.group ? file.group : "en"

    if (!groups[grp]) groups[grp] = []

    groups[grp].push(file)
  })

  const exportLines: string[] = []
  Object.keys(groups).forEach((key) => {
    exportLines.push(`${key}: [${groups[key].map(({ _id }) => _id).join(", ")}]`)
  })

  lines.push(`\n\nexport default {\n  ${exportLines.join(`,\n  `)}\n}`)

  return lines.join("\n")
}
/**
 * Generates a normalized list of extensions to work with
 * @param packagePaths - All package.json files from Factor extensions
 * @param packageBase - The base package.json
 */
export const generateExtensionList = (
  packagePaths: FactorPackageJson[],
  packageBase: FactorPackageJson
): FactorExtension[] => {
  const loader: FactorExtension[] = []

  packagePaths.forEach((_) => {
    const {
      name,
      factor: { priority = -1, load = [], extend = ExtendTypes.Plugin } = {},
      version,
      main = "index",
    } = _

    let { factor: { _id = "" } = {} } = _

    const isCwd = packageBase.name == name

    if (!_id) _id = getId({ _id, name, isCwd })

    loader.push({
      version,
      name,
      main,
      extend,
      priority: getPriority({ priority, name, extend, isCwd }),
      load: normalizeLoadTarget({ load, main, _id, isCwd }),
      isCwd,
      _id,
    })
  })

  return sortPriority(loader)
}

/**
 * Use root application dependencies as the start of the factor dependency tree
 * Recursively get all factor dependencies
 *
 * @param pkg - the root application package.json
 */
export const loadExtensions = (
  pkg: FactorPackageJson,
  options?: { shallow?: true }
): FactorExtension[] => {
  const { dependents, disabled } = recursiveDependencies([pkg], pkg, [], options)

  const deps = dependents.filter((_) => !disabled.includes(_.name))

  return generateExtensionList(deps, pkg)
}

/**
 * Gets a list of the names of themes/plugins by package name
 * @param pkg - root package
 * @param options.shallow - only look at the plugins/themes from root pkg
 */
export const installedExtensions = (
  pkg: FactorPackageJson,
  options?: {
    shallow?: true
  }
): { themes: string[]; plugins: string[] } => {
  const list = loadExtensions(pkg, options)
  const themes: string[] = list
    .filter((item) => item.extend == "theme")
    .map((_) => _.name)
  const plugins: string[] = list
    .filter((item) => item.extend == "plugin")
    .map((_) => _.name)
  return { themes, plugins }
}

/**
 * Verify that the main files and loading setup from package.json resolves to actual files
 * Without this check errors occur that don't hint to what is happening
 * @param extensions - all factor extensions and app
 */
const verifyMainFiles = (extensions: FactorExtension[], cwd?: string): void | never => {
  let mainFiles: string[] = []

  extensions.forEach(({ isCwd, load: { app, server }, name }) => {
    ;[app, server].forEach((environment) => {
      if (environment.length > 0) {
        mainFiles.push(
          ...environment.map((_) =>
            getResolver({
              name,
              isCwd,
              cwd,
              main: _.file,
            })
          )
        )
      }
    })
  })

  // remove duplicates
  mainFiles = mainFiles.filter((item, index) => {
    return mainFiles.indexOf(item) === index
  })

  mainFiles.forEach((fi) => {
    try {
      require.resolve(fi)
    } catch {
      throw new Error(`There was a problem resolving a main file (${fi}).`)
    }
  })
}

/**
 * Gets Factor extensions based on working directory package.json
 *
 * @param cwd - working directory path
 *
 * @returns array - list of factor extension
 */
const __extensions: Record<string, FactorExtension[]> = {}
export const getExtensions = (cwd?: string): FactorExtension[] => {
  const workingDirectory = getWorkingDirectory(cwd)

  if (__extensions[workingDirectory]) {
    return __extensions[workingDirectory]
  } else {
    const cwdPackage = getWorkingDirectoryPackage(cwd)

    if (cwdPackage) {
      const extensions = loadExtensions(cwdPackage)

      verifyMainFiles(extensions, cwd)

      __extensions[workingDirectory] = extensions

      return extensions
    } else {
      return []
    }
  }
}

/**
 * Gets the directories for current app and all Factor extensions
 */
export const getFactorDirectories = (): string[] => {
  return getExtensions().map(({ name, main, isCwd }) => {
    return getDirectory({ name, main, isCwd })
  })
}

export const generateLoaders = (options?: CommandOptions): void => {
  const { cwd, clean, controlFiles } = options || {}
  const workingDirectory = getWorkingDirectory(cwd)

  const folders = {
    generated: resolve(workingDirectory, ".factor"),
    distribution: resolve(workingDirectory, "dist"),
  }

  Object.values(folders).forEach((folder) => {
    if (clean) {
      fs.removeSync(folder)
    }
    fs.ensureDirSync(folder)
  })

  // Control files allow apps to be customized from other builds
  // Useful in advanced setups, e.g. added for theme demo
  const controls: {
    [key in LoadTargets]?: LoaderFile[]
  } = {}
  if (controlFiles) {
    controlFiles.forEach(({ file, target, writeFile }) => {
      let _filename

      if (writeFile) {
        const { filename, content } = writeFile
        _filename = filename
        fs.writeFileSync(join(folders.generated, filename), content)
      } else if (file) {
        _filename = basename(file)
        fs.copySync(file, join(folders.generated, _filename))
      }

      if (_filename) {
        const filenameBase = _filename.split(".").slice(0, -1).join(".")

        controls[target] = [
          { _id: filenameBase, file: `./${filenameBase}`, priority: 800 },
        ]
      }
    })
  }

  // Get extensions based on working directory dependencies
  const extensions = getExtensions(cwd)

  if (extensions.length == 0) return

  /**
   * SERVER MODULES LOADER
   */
  makeModuleLoader({
    extensions,
    loadTarget: LoadTargets.Server,
    additional: controls[LoadTargets.Server],
    cwd,
    callback: (files: LoaderFile[]) => {
      writeFile({
        destination: getPath("loader-server", cwd),
        content: loaderString(files),
      })
    },
  })

  /**
   * APP MODULES LOADER
   */
  makeModuleLoader({
    extensions,
    loadTarget: LoadTargets.App,
    additional: controls[LoadTargets.App],
    cwd,
    callback: (files: LoaderFile[]) => {
      writeFile({ destination: getPath("loader-app", cwd), content: loaderString(files) })
    },
  })

  /**
   * SETTINGS FILES LOADER
   */
  makeFileLoader({
    extensions,
    filename: "factor-settings",
    additional: controls[LoadTargets.Settings],
    cwd,
    callback: (files: LoaderFile[]) => {
      writeFile({
        destination: getPath("loader-settings", cwd),
        content: loaderStringOrdered(files),
      })
    },
  })

  /**
   * SETTINGS FILES LOADER
   */
  makeFileLoader({
    extensions,
    filename: "factor-lang",
    additional: controls[LoadTargets.Lang],
    cwd,
    callback: (files: LoaderFile[]) => {
      writeFile({
        destination: getPath("loader-lang", cwd),
        content: loaderStringOrderedAndGrouped(files),
      })
    },
  })

  /**
   * STYLE FILES LOADER
   */
  makeFileLoader({
    extensions,
    filename: "factor-styles",
    additional: controls[LoadTargets.Style],
    cwd,
    callback: (files: LoaderFile[]) => {
      const imports = files.map((_) => `@import (less) "~${_.file}";`).join(`\n`)
      const content = `${imports}`

      writeFile({ destination: getPath("loader-styles", cwd), content })
    },
  })

  return
}
