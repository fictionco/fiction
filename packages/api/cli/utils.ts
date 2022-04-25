import path from "path"
import { createRequire } from "module"
import dotenv from "dotenv"
import { log } from "../logger"
import { getServerUserConfig, handleCrossEnv } from "../config/entry"
import { UserConfig } from "../config/types"
import { PackageJson } from "../types"
import { runHooks } from "../utils"

const require = createRequire(import.meta.url)

export type BuildStages = "prod" | "pre" | "local"
type NodeEnv = "production" | "development"

export type CliOptions = {
  name?: string
  SERVICE?: string
  STAGE_ENV?: BuildStages
  NODE_ENV?: NodeEnv
  inspector?: boolean
  exit?: boolean
  portApp?: string
  port?: string
  serve?: boolean
  prerender?: boolean
  patch?: boolean
  skipTests?: boolean
  moduleName?: string
  bundleMode?: "script" | "app"
  pkg?: PackageJson
  commit?: string
  pathname?: string
  cwd?: string
  mode?: NodeEnv
  command?: string
}

export type Configurations = {
  pkg?: PackageJson
  userConfig?: UserConfig
}

export type RunConfig = CliOptions & StandardPaths & Configurations

export interface StandardPaths {
  cwd: string
  dist: string
  distServer: string
  distClient: string
  distStatic: string
  distServerEntry: string
  sourceDir: string
  publicDir: string
  mainFilePath: string
  rootComponentPath: string
  mountFilePath: string
}

// type WhichModule = {
//   moduleName?: string
//   cwd?: string
// }

export const done = (code: 0 | 1, message = `exited process`): never => {
  if (message) {
    log.log({
      level: code == 0 ? "info" : "error",
      context: "cli",
      description: `${message} (${code})`,
    })
  }

  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(code)
}

/**
 * Opens the node inspector port
 * https://nodejs.org/api/inspector.html
 */
const initializeNodeInspector = async (): Promise<void> => {
  log.info("initializeNodeInspector", `[initializing inspector]`)
  const inspector = await import("inspector")
  inspector.close()
  inspector.open()
}

const packageMainFile = (cwd: string): string => {
  const pkgPath = path.resolve(cwd, "package.json")
  const pkg = require(pkgPath) as PackageJson
  return pkg.main ?? "index"
}

export const getMainFilePath = (cwd: string): string => {
  return path.resolve(cwd, packageMainFile(cwd))
}

/**
 * Get source folder for CWD or optional moduleName
 */
export const sourceFolder = (cwd: string): string => {
  return path.dirname(getMainFilePath(cwd))
}

export const getStandardPaths = ({ cwd }: { cwd: string }): StandardPaths => {
  const dist = path.join(cwd, "dist")
  const distServer = path.join(dist, "server")
  const distClient = path.join(dist, "client")
  const distStatic = path.join(dist, "static")
  const distServerEntry = path.join(distServer, "mount")
  const mainFilePath = path.resolve(cwd, packageMainFile(cwd))

  const sourceDir = path.dirname(mainFilePath)
  const rootComponentPath = path.join(sourceDir, "App.vue")
  const publicDir = path.join(sourceDir, "public")
  const mountFilePath = path.join(
    path.dirname(require.resolve("@factor/api")),
    "/plugin-app/mount.ts",
  )

  return {
    cwd,
    dist,
    distServer,
    distClient,
    distStatic,
    distServerEntry,
    sourceDir,
    publicDir,
    mountFilePath,
    mainFilePath,
    rootComponentPath,
  }
}

/**
 * Sets Node process and environmental variables
 */
export const setEnvironment = async (
  options: CliOptions,
): Promise<RunConfig> => {
  const { cwd = process.cwd(), NODE_ENV = "production" } = options

  dotenv.config({ path: path.resolve(cwd, ".env") })

  if (options.NODE_ENV == "development") {
    dotenv.config({ path: path.resolve(cwd, ".dev.env") })
  }

  // run with node developer tools inspector
  if (options.inspector) {
    initializeNodeInspector().catch(console.error)
  }

  process.env.NODE_ENV = NODE_ENV ?? "production"

  const crossVars = handleCrossEnv({
    port: options.port,
    portApp: options.portApp,
    mode: options.NODE_ENV,
  })

  const standardPaths = getStandardPaths({ cwd })

  const userConfig = await getServerUserConfig({
    mainFilePath: standardPaths.mainFilePath,
    userConfig: crossVars,
  })

  return {
    ...options,
    ...standardPaths,
    mode: crossVars.mode,
    userConfig,
  }
}

/**
 * Standard wrap for a CLI command that exits and sanitizes input args
 */
export const wrapCommand = async (params: {
  cb: (options: RunConfig) => Promise<void>
  opts?: CliOptions
}): Promise<void> => {
  const { cb, opts = {} } = params
  const { exit } = opts

  const renderConfig = await setEnvironment(opts)

  try {
    await cb(renderConfig)
  } catch (error) {
    const data = { ...opts, args: process.argv }
    log.error("wrapCommand", "command exec", { error, data })
    done(1)
  }
  if (exit) done(0)
}

export const runCommand = async (command: string, opts: CliOptions) => {
  const runConfig = await setEnvironment({ ...opts, command })

  await runHooks({
    list: runConfig.userConfig?.hooks ?? [],
    hook: "run",
    args: [runConfig],
  })
}
