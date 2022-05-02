import path from "path"
import dotenv from "dotenv"
import { FactorPlugin } from "../plugin"
import { PackageJson } from "../types"
import { HookType, requireIfExists, getRequire } from "../utils"
import { getServerServiceConfig } from "./entry"
import * as types from "./types"
import { FactorEnvHookDictionary } from "./types"
import { CliCommand, CommandKeys, commands } from "./commands"
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

type EnvVarUtil<T extends EnvVar<string>[]> = {
  [K in keyof T]: T[K] extends EnvVar<infer T> ? T : never
}[number]

export type FactorControlSettings<S extends string> = {
  hooks?: HookType<FactorEnvHookDictionary>[]
  envFiles?: string[]
  cwd: string
  inspector?: boolean
  envVars?: () => EnvVar<S>[]
}

export class FactorEnv<S extends string> extends FactorPlugin<
  FactorControlSettings<S>
> {
  commands: CliCommand<string>[]
  hooks: HookType<FactorEnvHookDictionary>[]
  envFiles: string[]
  standardPaths?: types.StandardPaths
  cwd: string
  inspector: boolean
  vars: EnvVar<string>[]
  context = process.env.IS_VITE ? "app" : "server"
  mode: "development" | "production"
  serverPort?: number
  appPort?: number
  envVars: () => EnvVar<S>[]
  constructor(settings: FactorControlSettings<S>) {
    super(settings)

    this.commands = commands
    this.hooks = settings.hooks || []
    this.envFiles = settings.envFiles || []
    this.cwd = settings.cwd
    this.envVars = settings.envVars || (() => [])
    this.mode =
      (process.env.NODE_ENV as "development" | "production") || "production"

    this.inspector = settings.inspector || false

    if (!this.utils.isApp()) {
      this.nodeInit()
    }
    /**
     * Needs to come last so env vars are set
     */
    this.vars = [...this.coreVars(), ...this.envVars()]

    this.addHook({
      hook: "staticSchema",
      callback: async (existing) => {
        const commandKeys = this.commands?.map((_) => _.command).sort()

        return {
          ...existing,
          commands: { enum: commandKeys, type: "string" },
        }
      },
    })
  }

  nodeInit() {
    this.standardPaths = this.getStandardPaths({ cwd: this.cwd })

    this.envFiles.forEach((envFile) => {
      dotenv.config({ path: path.resolve(envFile) })
    })

    // run with node developer tools inspector
    if (this.inspector) {
      this.initializeNodeInspector().catch(console.error)
    }
  }

  setup() {
    return {}
  }

  public addHook(hook: HookType<FactorEnvHookDictionary>): void {
    this.hooks.push(hook)
  }

  packageMainFile = (cwd: string): string => {
    const pkgPath = path.resolve(cwd, "package.json")
    const pkg = requireIfExists(pkgPath) as PackageJson | undefined
    return pkg?.main ?? "index"
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
    const relMain = this.packageMainFile(cwd)
    const mainFilePath = path.resolve(cwd, relMain)

    const sourceDir = path.dirname(mainFilePath)
    const rootComponentPath = path.join(sourceDir, "App.vue")
    const publicDir = path.join(sourceDir, "public")
    const mountFilePath = path.join(
      path.dirname(getRequire().resolve("@factor/api")),
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

  setEnvironment = (): void => {}

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

  runCommand = async (cliCommand: CliCommand<string>): Promise<void> => {
    if (!this.standardPaths) throw new Error("standard paths not set")

    this.log.info(`Running command ${cliCommand.command}`, { data: cliCommand })

    const mainFilePath = this.standardPaths.mainFilePath
    const serviceConfig = await getServerServiceConfig({ mainFilePath })

    const runConfig = {
      command: cliCommand.command,
      ...cliCommand.options,
      serviceConfig,
    }

    await this.utils.runHooks<FactorEnvHookDictionary>({
      list: this.hooks,
      hook: "runCommand",
      args: [cliCommand.command, runConfig],
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
      new EnvVar({
        name: "mode",
        val: process.env.NODE_ENV,
      }),
      new EnvVar({
        name: "serverPort",
        val: process.env.FACTOR_SERVER_PORT || process.env.PORT,
      }),
      new EnvVar({ name: "appPort", val: process.env.FACTOR_APP_PORT }),
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
      ReturnType<this["envVars"]> | ReturnType<this["coreVars"]>
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
