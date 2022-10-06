import path from "path"
import dotenv from "dotenv"
import { FactorObject } from "../plugin"
import { HookType, vue } from "../utils"
import { version as factorVersion } from "../package.json"
import { getServerServiceConfig } from "./entry"
import * as types from "./types"
import { FactorEnvHookDictionary } from "./types"
import { CliCommand, standardAppCommands } from "./commands"
import { done } from "./utils"
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
  val: vue.Ref<string | undefined>
  verify?: VerifyVar
  isOptional: boolean
  isPublic: boolean
  constructor(settings: EnvVarSettings<X>) {
    this.name = settings.name
    this.val = vue.ref(settings.val)
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
        name: "RUNTIME_VERSION",
        val: process.env.RUNTIME_VERSION,
        isPublic: true,
      }),
      new EnvVar({
        name: "IS_TEST",
        val: process.env.IS_TEST || process.env.VITEST,
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
  mainFilePath?: string
  inspector?: boolean
  nodemonConfigPath?: string
  id?: string
  appName: string
  appEmail: string
  serviceUrl?: string
  commands?: CliCommand<string>[]
  mode?: "development" | "production"
  isApp?: boolean
  isTest?: boolean
  version: string
}

type BaseCompiled = {
  commands: string
  vars: string
  [key: string]: any
}

export class FactorEnv<
  S extends BaseCompiled = BaseCompiled,
> extends FactorObject<FactorControlSettings> {
  generatedConfig?: S
  commands = this.settings.commands || standardAppCommands
  hooks = this.settings.hooks || []
  envFiles = this.settings.envFiles || []
  envFilesProd = this.settings.envFilesProd || []
  cwd = this.settings.cwd
  mainFilePath = this.settings.mainFilePath || path.join(this.cwd, "index.ts")
  id = this.settings.id || "factor"
  inspector = this.settings.inspector || false
  mode = this.utils.vue.ref<"development" | "production" | undefined>(
    process.env.NODE_ENV as "development" | "production",
  )
  isRestart = () => process.env.IS_RESTART == "1"
  isApp = this.utils.vue.ref(this.settings.isApp || !!process.env.IS_VITE)
  isTest = this.utils.vue.ref(this.settings.isTest || !!process.env.IS_TEST)
  isServer = this.utils.vue.computed(() => !this.isApp.value)
  isProd = this.utils.vue.computed(() => this.mode.value === "production")
  isDev = this.utils.vue.computed(() => this.mode.value === "development")
  appName = this.settings.appName
  appEmail = this.settings.appEmail
  serviceUrl = this.utils.vue.ref(this.settings.serviceUrl)
  currentCommand: CliCommand<string> | undefined
  currentCommandOpts: types.CliOptions | undefined
  isRendering = false
  version = this.settings.version
  factorVersion = factorVersion
  uiPaths: string[] = []
  constructor(settings: FactorControlSettings) {
    super("env", settings)

    this.log.info(`initializing environment`, {
      data: {
        appName: this.appName,
        version: `${this.version || "no version"} [factor: ${factorVersion}]`,
        vars: Object.keys(process.env).length,
        commands: this.commands.length,
        isRestart: this.isRestart(),
      },
    })

    this.envInit()

    if (!this.isApp.value) {
      this.nodeInit()
    } else {
      this.log.info("browser env vars", { data: process.env })
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

    if (!this.isApp.value) {
      this.log.info(
        `variables (${vars.length} total / ${
          vars.filter((_) => _.isPublic).length
        } public)`,
        {
          data: this.getViteRenderedVars(),
          disableOnRestart: true,
        },
      )
    }

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
        this.mode.value = fullOpts.mode

        this.setVar("NODE_ENV", fullOpts.mode)
      }

      if (process.env.VITEST) {
        this.setVar("IS_TEST", "true")
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
    return this.getVars().filter((_) => _.isPublic && _.val.value)
  }

  getViteRenderedVars(): Record<string, string> {
    const rendered = Object.fromEntries(
      this.getPublicVars()
        .filter((_) => _.val.value)
        .map((_) => [_.name, _.val.value]),
    ) as Record<string, string>
    rendered.IS_VITE = "yes"

    return rendered
  }

  nodeInit() {
    if (this.mode.value == "production") {
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
        r = verify({ factorEnv: this, value: val.value })
      } else if (!this.isApp && !isOptional) {
        r = val ? true : false
      } else {
        r = true
      }

      if (!r) this.log.warn(`var missing: ${name}`)
    })
  }

  async afterSetup() {
    if (
      !this.isProd.value &&
      !this.isApp.value &&
      !this.isTest.value &&
      !this.isRestart()
    ) {
      await generateStaticConfig(this)
    }
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

    const cliCommand = this.currentCommand

    if (!cliCommand.description) {
      delete cliCommand.description
    }

    if (!cliCommand.port) {
      delete cliCommand.port
    }

    this.log.info(`running command ${cliCommand.command}`, { data: cliCommand })

    const mainFilePath = this.mainFilePath

    await getServerServiceConfig({ mainFilePath })

    await this.crossRunCommand()

    if (cliCommand.options.exit) {
      done(0)
    }
  }

  setVar(variable: S["vars"], value?: string): void {
    const envVar = this.getVars().find((_) => _.name === variable)
    if (!envVar) {
      this.log.warn(`envVar missing: ${variable}`)
    } else {
      envVar.val.value = value
    }
  }

  var(variable: S["vars"], opts: { fallback: string | number }): string
  var(variable: S["vars"]): string | undefined
  var(
    variable: S["vars"],
    opts: { fallback?: string | number } = {},
  ): string | undefined {
    const { fallback } = opts
    const envVar = this.getVars().find((_) => _.name === variable)

    if (!envVar) {
      this.log.warn(`envVar missing: ${variable}`)
      return undefined
    }
    const v = envVar.val.value

    if (!v && fallback) {
      envVar.val.value = String(fallback)
    }

    return envVar.val.value
  }
}
