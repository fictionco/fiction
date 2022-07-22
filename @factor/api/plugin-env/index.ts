import path from "path"
import dotenv from "dotenv"
import { FactorPlugin } from "../plugin"
import { HookType, safeDirname } from "../utils"
import { getServerServiceConfig } from "./entry"
import * as types from "./types"
import { FactorEnvHookDictionary } from "./types"
import { CliCommand, standardAppCommands } from "./commands"
import { done, packageMainFile } from "./utils"
import { generateStaticConfig } from "./generate"
import "./nodePolyfills"
export * from "./types"
export * from "./entry"
export * from "./commands"

type VerifyVar = (params: {
  factorEnv: FactorEnv
  value: string | undefined
}) => boolean

type EnvVarSettings<X extends string> = {
  name: X
  val: string | undefined
  verify?: VerifyVar
  isOptional?: boolean
  isPublic?: boolean
}

export class EnvVar<X extends string> {
  name: X
  val: string | undefined
  verify?: VerifyVar
  isOptional: boolean
  isPublic: boolean
  constructor(settings: EnvVarSettings<X>) {
    this.name = settings.name
    this.val = settings.val
    this.verify = settings.verify
    this.isOptional = settings.isOptional || false
    this.isPublic = settings.isPublic || false
  }
}

class EnvVarList {
  list: (() => EnvVar<string>[])[] = [
    () => [
      new EnvVar({
        name: "NODE_ENV",
        val: process.env.NODE_ENV,
        isPublic: true,
      }),
      new EnvVar({
        name: "COMMAND",
        val: process.env.COMMAND,
        isPublic: true,
      }),
      new EnvVar({
        name: "COMMAND_OPTS",
        val: process.env.COMMAND_OPTS,
        isPublic: true,
      }),
      new EnvVar({
        name: "IS_TEST",
        val: process.env.IS_TEST,
        isPublic: true,
      }),
    ],
  ]

  register(v: () => EnvVar<string>[]) {
    this.list.push(v)
  }
}
/**
 * Singleton of var callbacks.
 * Register envVars (as a side-effect on import) from plugins and then call the functions
 * once FactorEnv has set up.
 */
export const vars = new EnvVarList()

export type FactorControlSettings = {
  hooks?: HookType<FactorEnvHookDictionary>[]
  envFiles?: string[]
  envFilesProd?: string[]
  cwd: string
  inspector?: boolean
  nodemonConfigPath?: string
  id?: string
  appName: string
  appEmail: string
  productionUrl?: string
  commands?: CliCommand<string>[]
}

type BaseCompiled = {
  commands: string
  vars: string
  [key: string]: any
}

export class FactorEnv<
  S extends BaseCompiled = BaseCompiled,
> extends FactorPlugin<FactorControlSettings> {
  generatedConfig?: S
  commands = this.settings.commands || standardAppCommands
  hooks = this.settings.hooks || []
  envFiles = this.settings.envFiles || []
  envFilesProd = this.settings.envFilesProd || []
  standardPaths?: types.StandardPaths
  cwd = this.settings.cwd

  inspector = this.settings.inspector || false
  context = this.utils.isApp() ? "app" : "server"
  mode: "production" | "development" | "unknown" = "unknown"
  isApp: () => boolean = () => this.utils.isApp()
  isServer: () => boolean = () => !this.isApp
  isProd: () => boolean = () => this.utils.mode() === "production"
  isDev: () => boolean = () => this.utils.mode() === "development"
  isTest: () => boolean = () => this.utils.isTest()
  appName = this.settings.appName
  appEmail = this.settings.appEmail
  // needs to be set from factorApp as it takes into account port
  productionUrl = this.settings.productionUrl
  currentCommand: CliCommand<string> | undefined
  currentCommandOpts: types.CliOptions | undefined

  constructor(settings: FactorControlSettings) {
    super(settings)

    this.log.info(`initializing (${Object.keys(process.env).length} vars)`)

    this.envInit()

    if (!this.utils.isApp()) {
      this.nodeInit()
    }

    this.addHook({
      hook: "staticSchema",
      callback: async (existing) => {
        const commandKeys = this.commands?.map((_) => _.command).sort()
        const envVarKeys = this.getVars()
          .map((_) => _.name)
          .sort()
        return {
          ...existing,
          commands: { enum: commandKeys, type: "string" },
          vars: { enum: envVarKeys, type: "string" },
        }
      },
    })
  }

  setup() {
    const vars = this.getVars()

    this.log.info(
      `variables (${vars.length} total / ${
        vars.filter((_) => _.isPublic).length
      } public)`,
      {
        data: this.getViteRenderedVars(),
        disableOnRestart: true,
      },
    )

    this.verifyEnv()
  }

  envInit() {
    const commandName = process.env.COMMAND || ""
    const commandOpts = JSON.parse(
      process.env.COMMAND_OPTS || "{}",
    ) as types.CliOptions

    if (!commandName) return

    const cliCommand = this.commands
      .find((_) => _.command === commandName)
      ?.setOptions(commandOpts)

    if (!cliCommand) throw new Error(`command [${commandName}] not found`)

    const fullOpts = cliCommand?.options ?? {}

    // generally "process" is unavailable in browser
    if (this.utils.isNode()) {
      Object.entries(fullOpts).forEach(([key, value]) => {
        if (value) {
          const processKey = this.utils.camelToUpperSnake(key)
          process.env[processKey] = String(value)
        }
      })

      if (fullOpts.mode) {
        this.mode = fullOpts.mode
        // use literal to prevent substitution in app
        process.env["NODE_ENV"] = fullOpts.mode
      }
    }

    this.currentCommand = cliCommand
    this.currentCommandOpts = fullOpts
  }

  getVars() {
    // get custom env vars from plugins, etc.
    const customVars = vars.list.flatMap((cb) => cb())

    // get service ports as env vars; this allows them to be both
    // on client/server side, to sync with other deployment config(docker), etc
    const commandVars = this.commands
      .filter((_) => _.port)
      .map((c) => {
        const name = `${c.command.toUpperCase()}_PORT`
        const val = process.env[name]
        return new EnvVar({
          name: name,
          val: val || String(c.port),
          isPublic: true,
        })
      })

    return [...customVars, ...commandVars]
  }

  getPublicVars() {
    return this.getVars().filter((_) => _.isPublic && _.val)
  }

  getViteRenderedVars(): Record<string, string> {
    const rendered = Object.fromEntries(
      this.getPublicVars()
        .filter((_) => _.val)
        .map((_) => [_.name, _.val]),
    ) as Record<string, string>
    rendered.IS_VITE = "yes"

    return rendered
  }

  updateVarsForTransfer(vars: Record<string, string>) {
    Object.entries(vars).forEach(([key, value]) => {
      process.env[key] = value
    })
  }

  nodeInit() {
    this.standardPaths = this.getStandardPaths({ cwd: this.cwd })

    if (this.mode == "production") {
      this.envFiles.push(...this.envFilesProd)
    }

    this.envFiles.forEach((envFile) => {
      const { error, parsed } = dotenv.config({ path: path.resolve(envFile) })
      if (parsed) {
        this.log.info(`loaded envFile: ${envFile}`, {
          data: {
            keys: Object.entries(parsed || {})
              .map(([key, v]) => `${key}(${v.length})`)
              .join(", "),
          },
        })
      } else if (error) {
        this.log.warn(`failed to load envFile: ${envFile}`)
      }
    })

    // run with node developer tools inspector
    if (this.inspector) {
      this.initializeNodeInspector().catch(console.error)
    }
  }

  verifyEnv() {
    /**
     * Verify variables and issue warnings if something is missing
     */
    this.getVars().forEach((v) => {
      const { name, val, verify, isOptional } = v

      let r: boolean
      if (verify) {
        r = verify({ factorEnv: this, value: val })
      } else if (!this.isApp && !isOptional) {
        r = val ? true : false
      } else {
        r = true
      }

      if (!r) this.log.warn(`var missing: ${name}`)
    })
  }

  async afterSetup() {
    if (!this.isProd() && !this.isApp() && !this.isTest()) {
      await this.generate()
    }
  }

  async generate() {
    await generateStaticConfig(this)
  }

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
      safeDirname(import.meta.url, ".."),
      "./plugin-app/mount.ts",
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
  /**
   * This runs on both server and app to ensure consistency
   * App vs Server behavior is guarded in actual extensions (isNode, window defined, etc. )
   */
  async crossRunCommand() {
    const runConfig = {
      command: this.currentCommand?.command,
      ...this.currentCommand?.options,
    }

    await this.utils.runHooks<FactorEnvHookDictionary>({
      list: this.hooks,
      hook: "runCommand",
      args: [this.currentCommand?.command || "", runConfig],
    })
  }

  serverRunCurrentCommand = async (): Promise<void> => {
    if (!this.currentCommand) throw new Error("currentCommand not set")
    if (!this.standardPaths) throw new Error("standard paths not set")

    const cliCommand = this.currentCommand

    if (!cliCommand.description) {
      delete cliCommand.description
    }

    if (!cliCommand.port) {
      delete cliCommand.port
    }

    this.log.info(`running command ${cliCommand.command}`, { data: cliCommand })

    const mainFilePath = this.standardPaths.mainFilePath

    await getServerServiceConfig({ mainFilePath })

    await this.crossRunCommand()

    if (cliCommand.options.exit) {
      done(0)
    }
  }

  var(variable: S["vars"]): string | undefined {
    const envVar = this.getVars().find((_) => _.name === variable)

    if (!envVar) {
      this.log.warn(`envVar missing: ${variable}`)
      return undefined
    }

    return envVar.val as string | undefined
  }
}
