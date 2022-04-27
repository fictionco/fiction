import path from "path"
import { createRequire } from "module"

import { MainFile } from "../config/types"
import { PackageJson } from "../types"

const require = createRequire(import.meta.url)

// export type BuildStages = "prod" | "pre" | "local"
// type NodeEnv = "production" | "development"

// export type CliOptions = {
//   name?: string
//   inspector?: boolean
//   exit?: boolean
//   portApp?: string
//   port?: string
//   serve?: boolean
//   prerender?: boolean
//   patch?: boolean
//   skipTests?: boolean
//   moduleName?: string
//   bundleMode?: "script" | "app"
//   pkg?: PackageJson
//   commit?: string
//   pathname?: string
//   cwd?: string
//   mode?: NodeEnv
//   command?: Commands
// }

// class CliCommand<T extends string> {
//   public command: T
//   public description: string
//   public options: CliOptions

//   constructor(settings: {
//     command: T
//     description: string
//     options: CliOptions
//   }) {
//     this.command = settings.command
//     this.description = settings.description
//     this.options = settings.options
//   }

//   setOptions(options: CliOptions): this {
//     this.options = { ...this.options, ...options }
//     return this
//   }
// }

// const commands = [
//   new CliCommand({
//     command: "build",
//     description: "builds the app",
//     options: { mode: "production", exit: true },
//   }),
//   new CliCommand({
//     command: "bundle",
//     description: "bundles JS packages",
//     options: { mode: "production", exit: true },
//   }),
//   new CliCommand({
//     command: "start",
//     description: "serves a built app",
//     options: { mode: "production", exit: false },
//   }),
//   new CliCommand({
//     command: "prerender",
//     description: "prerenders app",
//     options: { mode: "production", exit: true },
//   }),
//   new CliCommand({
//     command: "server",
//     description: "runs endpoint server",
//     options: { mode: "production", exit: false },
//   }),
//   new CliCommand({
//     command: "dev",
//     description: "runs services in dev mode",
//     options: { mode: "development", exit: false },
//   }),
//   new CliCommand({
//     command: "rdev",
//     description: "runs dev with nodemon",
//     options: { mode: "development", exit: false },
//   }),
//   new CliCommand({
//     command: "release",
//     description: "builds and releases packages on NPM",
//     options: { mode: "production", exit: true },
//   }),
// ]

// export type CommandKeysUtil<T extends CliCommand<string>[]> = {
//   [K in keyof T]: T[K] extends CliCommand<infer T> ? T : never
// }[number]

// type Commands = CommandKeysUtil<typeof commands>

// type WhichModule = {
//   moduleName?: string
//   cwd?: string
// }

// export const done = (code: 0 | 1, message = `exited process`): never => {
//   if (message) {
//     log.log({
//       level: code == 0 ? "info" : "error",
//       context: "cli",
//       description: `${message} (${code})`,
//     })
//   }

//   // eslint-disable-next-line unicorn/no-process-exit
//   process.exit(code)
// }

// /**
//  * Opens the node inspector port
//  * https://nodejs.org/api/inspector.html
//  */
// const initializeNodeInspector = async (): Promise<void> => {
//   log.info("initializeNodeInspector", `[initializing inspector]`)
//   const inspector = await import("inspector")
//   inspector.close()
//   inspector.open()
// }

const packageMainFile = (cwd: string): string => {
  const pkgPath = path.resolve(cwd, "package.json")
  const pkg = require(pkgPath) as PackageJson
  return pkg.main ?? "index"
}

// export const getMainFilePath = (cwd: string): string => {
//   return path.resolve(cwd, packageMainFile(cwd))
// }

// /**
//  * Get source folder for CWD or optional moduleName
//  */
// export const sourceFolder = (cwd: string): string => {
//   return path.dirname(getMainFilePath(cwd))
// }

// export const getStandardPaths = ({ cwd }: { cwd: string }): StandardPaths => {
//   const dist = path.join(cwd, "dist")
//   const distServer = path.join(dist, "server")
//   const distClient = path.join(dist, "client")
//   const distStatic = path.join(dist, "static")
//   const distServerEntry = path.join(distServer, "mount")
//   const mainFilePath = path.resolve(cwd, packageMainFile(cwd))

//   const sourceDir = path.dirname(mainFilePath)
//   const rootComponentPath = path.join(sourceDir, "App.vue")
//   const publicDir = path.join(sourceDir, "public")
//   const mountFilePath = path.join(
//     path.dirname(require.resolve("@factor/api")),
//     "/plugin-app/mount.ts",
//   )

//   return {
//     cwd,
//     dist,
//     distServer,
//     distClient,
//     distStatic,
//     distServerEntry,
//     sourceDir,
//     publicDir,
//     mountFilePath,
//     mainFilePath,
//     rootComponentPath,
//   }
// }

// /**
//  * Sets Node process and environmental variables
//  */
// export const setEnvironment = async (
//   cliCommand: CliCommand<Commands>,
// ): Promise<RunConfig> => {
//   const {
//     cwd = process.cwd(),
//     mode = "production",
//     inspector = false,
//     port,
//     portApp,
//   } = cliCommand.options

//   dotenv.config({ path: path.resolve(cwd, ".env") })

//   if (mode == "development") {
//     dotenv.config({ path: path.resolve(cwd, ".dev.env") })
//   }

//   // run with node developer tools inspector
//   if (inspector) {
//     initializeNodeInspector().catch(console.error)
//   }

//   process.env.NODE_ENV = mode ?? "production"

//   if (port) {
//     process.env.FACTOR_SERVER_PORT = port
//   }

//   if (portApp) {
//     process.env.FACTOR_APP_PORT = portApp
//   }

//   const standardPaths = getStandardPaths({ cwd })

//   const userConfig = await getServerUserConfig({
//     mainFilePath: standardPaths.mainFilePath,
//     userConfig: {},
//   })

//   return {
//     command: cliCommand.command,
//     ...cliCommand.options,
//     ...standardPaths,
//     mode,
//     userConfig,
//   }
// }

export const runCommand = async (
  command: string,
  opts: Record<string, unknown>,
) => {
  const cwd = process.cwd()
  const mainFilePath = path.resolve(cwd, packageMainFile(cwd))

  const mainFile = (await import(mainFilePath)) as MainFile

  console.log("mainFile", mainFile, mainFilePath)

  // const cliCommand = commands.find((_) => _.command === cmd)?.setOptions(opts)

  // if (!cliCommand) {
  //   log.error("runCommand", "command not found", { data: { command, opts } })
  //   done(1)
  // } else {
  //   const runConfig = await setEnvironment(cliCommand)
  //   await runHooks({
  //     list: runConfig.userConfig?.hooks ?? [],
  //     hook: "runCommand",
  //     args: [runConfig],
  //   })

  //   if (cliCommand.options.exit) {
  //     done(0)
  //   }
  // }
}
