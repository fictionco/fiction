import path from "path"
import dotenv from "dotenv"
import { FactorPlugin } from "../plugin"
import { HookType, getRequire } from "../utils"
import { getServerServiceConfig } from "./entry"
import * as types from "./types"
import { FactorEnvHookDictionary } from "./types"
import { CliCommand, standardAppCommands } from "./commands"
import { done, packageMainFile } from "./utils"
export * from "./types"
export * from "./entry"
export * from "./commands"

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

export type FactorControlSettings = {
  hooks?: HookType<FactorEnvHookDictionary>[]
  envFiles?: string[]
  cwd: string
  inspector?: boolean
  envVars?: () => EnvVar<string>[]
  nodemonConfigPath?: string
  appName: string
  appEmail: string
  appUrl?: string
  commands?: CliCommand<string>[]
}

interface BaseCompiled {
  commands: string
  vars: string
  [key: string]: any
}

export class FactorEnv<
  S extends BaseCompiled = BaseCompiled,
> extends FactorPlugin<FactorControlSettings> {
  commands = this.settings.commands || standardAppCommands
  hooks = this.settings.hooks || []
  envFiles = this.settings.envFiles || []
  standardPaths?: types.StandardPaths
  cwd = this.settings.cwd
  inspector = this.settings.inspector || false
  vars: EnvVar<string>[]
  context = this.utils.isApp() ? "app" : "server"

  appName = this.settings.appName
  appEmail = this.settings.appEmail
  // needs to be set from factorApp as it takes into account port
  appUrl?: string
  envVars = this.settings.envVars || (() => [])
  currentCommand: CliCommand<string> | undefined
  currentCommandOpts: types.CliOptions | undefined
  constructor(settings: FactorControlSettings) {
    super(settings)

    if (!this.utils.isApp()) {
      this.envInit()
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
        const envVarKeys = this.vars.map((_) => _.name).sort()
        return {
          ...existing,
          commands: { enum: commandKeys, type: "string" },
          vars: { enum: envVarKeys, type: "string" },
        }
      },
    })
  }

  envInit() {
    const commandName = process.env.FACTOR_ENV_COMMAND || ""
    const commandOpts = JSON.parse(
      process.env.FACTOR_ENV_COMMAND_OPTS || "{}",
    ) as types.CliOptions

    if (!commandName) return

    const cliCommand = this.commands
      .find((_) => _.command === commandName)
      ?.setOptions(commandOpts)

    if (!cliCommand) throw new Error(`command [${commandName}] not found`)

    const fullOpts = cliCommand?.options ?? {}

    Object.entries(fullOpts).forEach(([key, value]) => {
      if (value) {
        const processKey = `FACTOR_${this.utils.camelToUpperSnake(key)}`
        process.env[processKey] = String(value)
      }
    })

    if (fullOpts.mode) {
      // use literal to prevent substitution in app
      process.env["NODE_ENV"] = fullOpts.mode
    }

    this.currentCommand = cliCommand
    this.currentCommandOpts = fullOpts
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

  setup() {}

  public addHook(hook: HookType<FactorEnvHookDictionary>): void {
    this.hooks.push(hook)
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
    const relMain = packageMainFile(cwd)
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
    commands: string[],
    callback: (command: string, options: types.CliOptions) => Promise<void>,
  ): void {
    this.hooks.push({
      hook: "runCommand",
      callback: async (command: string, opts: types.CliOptions) => {
        if (commands.includes(command)) {
          await callback(command, opts)
        }
      },
    })
  }

  runCurrentCommand = async (): Promise<void> => {
    if (!this.currentCommand) throw new Error("currentCommand not set")
    if (!this.standardPaths) throw new Error("standard paths not set")

    const cliCommand = this.currentCommand

    this.log.info(`running command ${cliCommand.command}`, { data: cliCommand })

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
      done(0)
    }
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

  var(variable: S["vars"]): string | undefined {
    const envVar = this.vars.find((_) => _.name === variable)

    if (!envVar) {
      throw new Error(`EnvVar ${variable} not found`)
    }

    const logData = {
      data: { envVar: envVar, context: this.context, mode: this.utils.mode() },
    }

    if (!envVar.val && envVar.context == "app" && this.context == "app") {
      this.log.warn(`app EnvVar missing`, logData)
    }

    if (
      !envVar.val &&
      envVar.mode == "production" &&
      this.utils.mode() == "production"
    ) {
      this.log.warn(`production EnvVar missing`, logData)
    }

    if (!envVar.val && envVar.context == "server" && this.context == "serer") {
      this.log.warn(`server EnvVar missing`, logData)
    }

    return envVar.val as string | undefined
  }
}
