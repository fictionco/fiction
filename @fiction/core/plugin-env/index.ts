import path from 'node:path'
import process from 'node:process'
import dotenv from 'dotenv'
import type { X } from 'vitest/dist/reporters-P7C2ytIv'
import { FictionObject } from '../plugin'
import type { HookType } from '../utils'
import { camelToUpperSnake, getCrossVar, isApp, isDev, isNode, isTest, runHooks, toSlug, vue } from '../utils'
import { version as fictionVersion } from '../package.json'
import type { RunVars } from '../inject'
import { compileApplication } from './entry'
import type * as types from './types'
import type { CliCommand } from './commands'
import { standardAppCommands } from './commands'
import { done } from './utils'
import { generateStaticConfig } from './generate'
import { commonServerOnlyModules } from './serverOnly'

export * from './types'
export * from './entry'
export * from './commands'

type VerifyVar = (params: {
  fictionEnv: FictionEnv
  value: string | undefined
}) => boolean

interface EnvVarSettings<X extends string> {
  name: X
  val?: string | undefined
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
      new EnvVar({ name: 'NODE_ENV', isPublic: true }),
      new EnvVar({ name: 'COMMAND', isPublic: true }),
      new EnvVar({ name: 'COMMAND_OPTS', isPublic: true }),
      new EnvVar({ name: 'RUNTIME_VERSION', isPublic: true }),
      new EnvVar({ name: 'RUNTIME_COMMIT', isPublic: true }),
      new EnvVar({ name: 'IS_TEST', isPublic: true }),
    ],
  ]

  register(v: () => EnvVar<string>[]) {
    this.list.push(v)
  }
}

/**
 * Singleton of var callbacks.
 * Register envVars (as a side-effect on import) from plugins and then call the functions
 * once FictionEnv has set up.
 */
export const vars = new EnvVarList()

export interface FictionControlSettings {
  hooks?: HookType<types.FictionEnvHookDictionary>[]
  envFiles?: string[]
  envFilesProd?: string[]
  env?: Record<string, string>
  cwd: string
  mainFilePath?: string
  distFolder?: string
  inspector?: boolean
  nodemonConfigPath?: string
  id?: string
  appName?: string
  appEmail?: string
  appUrl?: string
  commands?: CliCommand<string>[]
  mode?: 'development' | 'production'
  isApp?: boolean
  isTest?: boolean
  version?: string
  serverOnlyModules?: types.ServerModuleDef[]
  uiPaths?: string[]

}

type BaseCompiled = {
  commands: string
  vars: string
  [key: string]: any
}

export class FictionEnv<
  S extends BaseCompiled = BaseCompiled,
> extends FictionObject<FictionControlSettings> {
  generatedConfig?: S
  commands = this.settings.commands || standardAppCommands
  hooks = this.settings.hooks || []
  envFiles = this.settings.envFiles || []
  envFilesProd = this.settings.envFilesProd || []
  env = this.settings.env || {}
  cwd = this.settings.cwd
  mainFilePath = this.settings.mainFilePath || path.join(this.cwd, 'index.ts')
  appName = this.settings.appName || 'Fiction App'
  appEmail = this.settings.appEmail || ''
  appUrl = this.settings.appUrl || ''
  id = this.settings.id || toSlug(this.appName) || 'fiction'
  inspector = this.settings.inspector || false
  mode = vue.ref<'development' | 'production' | undefined>(isDev() ? 'development' : 'production')
  isRestart = () => process.env.IS_RESTART === '1'
  isApp = vue.ref(this.settings.isApp)
  isSSR = vue.computed(() => !!(this.isApp.value && this.isNode))
  isTest = vue.ref(this.settings.isTest)
  isServer = vue.computed(() => !this.isApp.value)
  isProd = vue.computed(() => !isDev())
  isDev = vue.ref()
  hasWindow = typeof window !== 'undefined'
  isNode = !!(typeof process !== 'undefined' && process.versions && process.versions.node)

  isRendering = false
  version = this.settings.version || '0.0.0'
  fictionVersion = fictionVersion
  uiPaths = new Set(this.settings.uiPaths)

  serverOnlyImports: Record<string, true | Record<string, string>> = commonServerOnlyModules()

  distFolder = this.settings.distFolder || path.join(this.cwd, 'dist')

  // allows service passed to app to be modified
  // plugins that add services need to edit this
  // the services are then accessed via useService provide
  service = vue.shallowRef<{ runVars?: Partial<RunVars>, [key: string]: unknown }>({})

  constructor(settings: FictionControlSettings) {
    super('env', settings)

    const commitId = process.env.RUNTIME_COMMIT || ''
    this.log.info(`[start] environment`, {
      data: {
        appName: this.appName,
        version: `${this.version || 'no version'} [fiction: ${fictionVersion}]`,
        vars: Object.keys(process.env).length,
        commands: this.commands.map(c => c.command).join(', '),
        isRestart: this.isRestart(),
        commit: commitId,
      },
    })

    this.envInit()

    this.isApp.value = isApp()
    this.isTest.value = isTest()
    this.isDev.value = isDev()

    this.mode.value = this.isDev.value ? 'development' : 'production'

    if (isNode())
      this.nodeInit()

    this.addHook({
      hook: 'staticSchema',
      callback: async (existing) => {
        const commandKeys = this.commands?.map(_ => _.command).sort()
        const envVarKeys = this.getVars().map(_ => _.name).sort()
        return {
          ...existing,
          commands: { enum: commandKeys, type: 'string' },
          vars: { enum: envVarKeys, type: 'string' },
        }
      },
    })
  }

  setup() {
    const vars = this.getVars()

    if (!this.isApp.value) {
      this.log.info(
        `variables (${vars.length} total / ${
          vars.filter(_ => _.isPublic).length
        } public)`,
        {
          data: this.getRenderedEnvVars(),
          disableOnRestart: true,
        },
      )
    }

    this.verifyEnv()
  }

  commandName = vue.ref(getCrossVar('COMMAND') || '')
  commandOpts = vue.ref(JSON.parse(getCrossVar('COMMAND_OPTS') || '{}') as types.CliOptions)

  currentCommand = vue.computed(() => {
    if (!this.commandName.value)
      return

    const baseCmd = this.commands.find(_ => _.command === this.commandName.value)

    if (!baseCmd)
      this.log.error(`command not found: ${this.commandName.value}`)

    return baseCmd?.setOptions(this.commandOpts.value)
  })

  envInit() {
    vue.watch(
      () => this.currentCommand.value,
      (cmd) => {
        const fullOpts = cmd?.options ?? {}
        // generally "process" is unavailable in browser
        if (isNode()) {
          // converts cli args --service-port to SERVICE_PORT env var
          Object.entries(fullOpts).forEach(([key, value]) => {
            if (value) {
              const processKey = camelToUpperSnake(key)
              process.env[processKey] = String(value)
            }
          })

          if (fullOpts.mode) {
            this.mode.value = fullOpts.mode

            process.env.NODE_ENV = fullOpts.mode
          }

          if (process.env.VITEST)
            process.env.IS_TEST = 'yes'
        }
      },
      { immediate: true },
    )
  }

  getVars() {
    // get custom env vars from plugins, etc.
    const customVars = vars.list.flatMap((cb) => {
      const v = cb().map((vari) => {
        if (!vari.val.value)
          vari.val = vue.ref(getCrossVar(vari.name) as string | undefined)

        return vari
      })

      return v
    })

    // get service ports as env vars; this allows them to be both
    // on client/server side, to sync with other deployment config(docker), etc
    const commandVars = this.commands
      .filter(_ => _.port.value)
      .map((c) => {
        const name = `${c.command.toUpperCase()}_PORT`
        const val = process.env[name]
        return new EnvVar({
          name,
          val: val || String(c.port.value),
          isPublic: true,
        })
      })

    return [...customVars, ...commandVars]
  }

  getPublicVars() {
    return this.getVars().filter(_ => _.isPublic && _.val.value)
  }

  getRenderedEnvVars(): Record<string, string | Record<string, string>> {
    const rendered = Object.fromEntries(
      this.getPublicVars()
        .filter(_ => _.val.value)
        .map(_ => [_.name, _.val.value]),
    ) as Record<string, string | Record<string, string>>
    rendered.IS_VITE = 'yes'

    return rendered
  }

  nodeInit() {
    if (this.mode.value === 'production')
      this.envFiles.push(...this.envFilesProd)

    this.envFiles.forEach((envFile) => {
      const { error, parsed } = dotenv.config({ path: path.resolve(envFile) })
      if (parsed) {
        this.log.info(`loaded envFile: ${envFile}`, {
          data: {
            keys: Object.entries(parsed || {})
              .map(([key, v]) => `${key}(${v.length})`)
              .join(', '),
          },
        })
      }
      else if (error) {
        this.log.warn(`envFile does not exist`, { data: { envFile } })
      }
    })

    // set env vars added directly to config
    Object.entries(this.env).forEach(([key, value]) => {
      process.env[key] = value
    })
  }

  verifyEnv() {
    /**
     * Verify variables and issue warnings if something is missing
     */
    this.getVars().forEach((v) => {
      const { name, val, verify, isOptional } = v

      let r: boolean
      if (verify)
        r = verify({ fictionEnv: this, value: val.value })
      else if (!this.isApp && !isOptional)
        r = !!val
      else
        r = true

      if (!r)
        this.log.warn(`var missing: ${name}`)
    })
  }

  async afterSetup() {
    if (
      !this.isProd.value
      && !this.isApp.value
      && !this.isTest.value
      && !this.isRestart()
    )
      await this.generate()
  }

  async generate() {
    await generateStaticConfig(this)
  }

  public addHook(hook: HookType<types.FictionEnvHookDictionary>): void {
    this.hooks.push(hook)
  }

  onCommand(
    commands: string[],
    callback: (command: string, options: types.CliOptions) => Promise<void>,
  ): void {
    this.hooks.push({
      hook: 'runCommand',
      callback: async (command: string, opts: types.CliOptions) => {
        if (commands.includes(command))
          await callback(command, opts)
      },
    })
  }

  /**
   * This runs on both server and app to ensure consistency
   * App vs Server behavior is guarded in actual extensions (isNode, window defined, etc. )
   */
  async crossRunCommand(args: {
    context: 'node' | 'app'
    serviceConfig: types.ServiceConfig
    cliVars?: Partial<types.CliVars>
    runVars?: Partial<RunVars>
  }) {
    const { context, serviceConfig, cliVars, runVars } = args

    let cmd: CliCommand | undefined = this.currentCommand.value
    if (context === 'app')
      cmd = this.commands.find(_ => _.command === cmd?.clientCommand)

    const options = { command: cmd?.command, ...cmd?.options }

    await runHooks<types.FictionEnvHookDictionary>({
      list: this.hooks,
      hook: 'runCommand',
      args: [options.command || 'not_set', options],
    })

    if (serviceConfig?.runCommand)
      await serviceConfig.runCommand({ context, command: options.command || 'not_set', options, cliVars, runVars })
  }

  async serverRunCurrentCommand(args: { serviceConfig: types.ServiceConfig, cliVars: Partial<types.CliVars> }): Promise<void> {
    const { serviceConfig, cliVars } = args

    const cliCommand = this.currentCommand.value

    if (!cliCommand)
      throw new Error('currentCommand not set')

    if (!cliCommand.description)
      delete cliCommand.description

    this.log.info(`running command ${cliCommand.command}`, { data: cliCommand.toConfig() })

    const context = 'node'
    await compileApplication({ context, serviceConfig, cliVars })

    await this.crossRunCommand({ context, serviceConfig, cliVars })

    if (cliCommand.options.exit)
      done(0)
  }

  var(variable: S['vars'], opts: { fallback?: string | number } = {}): string {
    const { fallback } = opts
    const envVar = this.getVars().find(_ => _.name === variable)

    if (!envVar) {
      this.log.error(`envVar missing: ${variable}`)
      return ''
    }
    const v = envVar.val.value

    if (!v && fallback)
      envVar.val.value = String(fallback)

    return envVar.val.value || ''
  }

  addUiRoot(root: string) {
    const uiPaths = [
      `${root}/*.vue`,
      `${root}/**/*.vue`,
      `${root}/*.ts`,
      `${root}/**/*.ts`,
      `!${root}/node_modules/**`, // Exclude node_modules
      `!${root}/dist/**`, // Exclude dist
    ]
    uiPaths.forEach(uiPath => this.uiPaths.add(uiPath))
  }
}
