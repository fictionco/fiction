import path from "path"
import * as mod from "module"
import dotenv from "dotenv"
import { FactorPlugin } from "../plugin"
import { PackageJson } from "../types"
import { HookType } from "../utils"
import { getServerUserConfig } from "./entry"
import * as types from "./types"
import { HookDictionary } from "./types"
export * from "./types"

type EnvVarSettings<X extends string> = {
  name: X
  val: string | undefined
  mode?: "production" | "development" | "all"
  context?: "server" | "app"
}

export class EnvVar<X extends string> {
  name: X
  mode?: "production" | "development" | "all"
  context?: "server" | "app"
  val: string | undefined
  constructor(settings: EnvVarSettings<X>) {
    this.name = settings.name
    this.val = settings.val
    this.mode = settings.mode || "all"
    this.context = settings.context || "server"
  }
}

class CliCommand<T extends string> {
  public command: T
  public description: string
  public options: types.CliOptions

  constructor(settings: {
    command: T
    description: string
    options: types.CliOptions
  }) {
    this.command = settings.command
    this.description = settings.description
    this.options = settings.options
  }

  setOptions(options: types.CliOptions): this {
    this.options = { ...this.options, ...options }
    return this
  }
}

const commands = [
  new CliCommand({
    command: "build",
    description: "builds the app",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "bundle",
    description: "bundles JS packages",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "start",
    description: "serves a built app",
    options: { mode: "production", exit: false },
  }),
  new CliCommand({
    command: "prerender",
    description: "prerenders app",
    options: { mode: "production", exit: true },
  }),
  new CliCommand({
    command: "server",
    description: "runs endpoint server",
    options: { mode: "production", exit: false },
  }),
  new CliCommand({
    command: "dev",
    description: "runs services in dev mode",
    options: { mode: "development", exit: false },
  }),
  new CliCommand({
    command: "rdev",
    description: "runs dev with nodemon",
    options: { mode: "development", exit: false },
  }),
  new CliCommand({
    command: "release",
    description: "builds and releases packages on NPM",
    options: { mode: "production", exit: true },
  }),
]

export type CommandKeysUtil<T extends CliCommand<string>[]> = {
  [K in keyof T]: T[K] extends CliCommand<infer T> ? T : never
}[number]

type CommandKeys = CommandKeysUtil<typeof commands> | string

type EnvVarUtil<T extends EnvVar<string>[]> = {
  [K in keyof T]: T[K] extends EnvVar<infer T> ? T : never
}[number]

export type FactorControlSettings<S extends string> = {
  hooks?: HookType<HookDictionary>[]
  envFiles?: string[]
  cwd: string
  inspector?: boolean
  envVars: () => EnvVar<S>[]
}
export class FactorEnv<S extends string> extends FactorPlugin<
  FactorControlSettings<S>
> {
  commands: CliCommand<string>[]
  hooks: HookType<HookDictionary>[]
  envFiles: string[]
  standardPaths: types.StandardPaths
  cwd: string
  inspector: boolean
  vars: EnvVar<string>[]
  context = process.env.IS_VITE ? "app" : "server"
  mode: "development" | "production" = "production"
  constructor(settings: FactorControlSettings<S>) {
    super(settings)

    this.commands = commands
    this.hooks = settings.hooks || []
    this.envFiles = settings.envFiles || []
    this.cwd = settings.cwd
    this.standardPaths = this.getStandardPaths({ cwd: this.cwd })
    this.inspector = settings.inspector || false
    this.setEnvironment()

    this.vars = [...this.coreVars(), ...settings.envVars()]
  }

  setup() {
    return {}
  }

  public addHook(hook: HookType<HookDictionary>): void {
    this.hooks.push(hook)
  }

  getRequire() {
    return mod.Module.createRequire(import.meta.url)
  }

  packageMainFile = (cwd: string): string => {
    const pkgPath = path.resolve(cwd, "package.json")
    const pkg = this.getRequire()(pkgPath) as PackageJson
    return pkg.main ?? "index"
  }

  initializeNodeInspector = async (): Promise<void> => {
    this.log.info(`[initializing inspector]`)
    const inspector = await import(/* @vite-ignore */ "inspector")
    inspector.close()
    inspector.open()
  }

  getStandardPaths = ({ cwd }: { cwd: string }): types.StandardPaths => {
    const dist = path.join(cwd, "dist")
    const distServer = path.join(dist, "server")
    const distClient = path.join(dist, "client")
    const distStatic = path.join(dist, "static")
    const distServerEntry = path.join(distServer, "mount")
    const mainFilePath = path.resolve(cwd, this.packageMainFile(cwd))

    const sourceDir = path.dirname(mainFilePath)
    const rootComponentPath = path.join(sourceDir, "App.vue")
    const publicDir = path.join(sourceDir, "public")
    const mountFilePath = path.join(
      path.dirname(this.getRequire().resolve("@factor/api")),
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

  setEnvironment = (): void => {
    this.envFiles.forEach((envFile) => {
      dotenv.config({ path: path.resolve(envFile) })
    })

    // run with node developer tools inspector
    if (this.inspector) {
      this.initializeNodeInspector().catch(console.error)
    }
  }

  onCommand(
    commands: CommandKeys[],
    callback: (
      command: CommandKeys,
      options: types.CliOptions,
    ) => Promise<void>,
  ): void {
    this.hooks.push({
      hook: "runCommand",
      callback: async (command: CommandKeys, opts: types.CliOptions) => {
        if (commands.includes(command)) {
          await callback(command, opts)
        }
      },
    })
  }

  runCommand = async (
    command: CommandKeys,
    options: types.CliOptions,
  ): Promise<void> => {
    const cliCommand = this.commands
      .find((_) => _.command === command)
      ?.setOptions(options)

    if (!cliCommand) {
      throw new Error(`Command ${command} not found`)
    }

    const { mode = "production", port, portApp } = cliCommand.options

    process.env.NODE_ENV = mode ?? "production"

    if (port) {
      process.env.FACTOR_SERVER_PORT = port
    }

    if (portApp) {
      process.env.FACTOR_APP_PORT = portApp
    }

    const userConfig = await getServerUserConfig({
      mainFilePath: this.standardPaths.mainFilePath,
    })

    const runConfig = {
      command: cliCommand.command,
      ...cliCommand.options,
      mode,
      userConfig,
    }

    await this.utils.runHooks<HookDictionary>({
      list: this.hooks,
      hook: "runCommand",
      args: [command, runConfig],
    })

    if (cliCommand.options.exit) {
      this.done(0)
    }
  }

  done = (code: 0 | 1, message = `exited process`): never => {
    if (message) {
      this.log.info(`${message} (${code})`)
    }

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(code)
  }

  coreVars() {
    const baseVars = [
      new EnvVar({ name: "mode", val: process.env.NODE_ENV }),
      new EnvVar({
        name: "port",
        val: process.env.FACTOR_SERVER_PORT || process.env.PORT,
      }),
      new EnvVar({ name: "portApp", val: process.env.FACTOR_APP_PORT }),
      new EnvVar({
        name: "serverUrl",
        val: process.env.FACTOR_SERVER_URL,
        context: "app",
      }),
    ]

    return baseVars
  }

  var<T = string>(
    variable: EnvVarUtil<
      ReturnType<this["settings"]["envVars"]> | ReturnType<this["coreVars"]>
    >,
  ): T | undefined {
    const envVar = this.vars.find((_) => _.name === variable)

    if (!envVar) {
      throw new Error(`EnvVar ${variable} not found`)
    }

    const logData = {
      data: { envVar: envVar, context: this.context, mode: this.mode },
    }

    if (!envVar.val && envVar.context == "app" && this.context == "app") {
      this.log.warn(`app EnvVar missing`, logData)
    }

    if (
      !envVar.val &&
      envVar.mode == "production" &&
      this.mode == "production"
    ) {
      this.log.warn(`production EnvVar missing`, logData)
    }

    if (!envVar.val && envVar.context == "server" && this.context == "serer") {
      this.log.warn(`server EnvVar missing`, logData)
    }

    return envVar.val as T | undefined
  }
}
