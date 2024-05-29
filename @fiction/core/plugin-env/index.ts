import path from 'node:path'
import dotenv from 'dotenv'
import { FictionObject } from '../plugin'
import type { HookType, UserNotification } from '../utils'
import { camelToUpperSnake, crossVar, isApp, isDev, isNode, isTest, runHooks, runHooksSync, toSlug, vue } from '../utils'
import { version as fictionVersion } from '../package.json'
import type { RunVars } from '../inject'
import { TypedEventTarget } from '../utils/eventTarget'
import { logMemoryUsage } from '../utils/nodeUtils'
import { compileApplication } from './entry'
import type { CliCommand } from './commands'
import { standardAppCommands } from './commands'
import { generateStaticConfig } from './generate'
import { commonServerOnlyModules } from './serverOnly'
import { EnvVar, envConfig, vars } from './onImport'
import type { CliOptions, CliVars, ServerModuleDef, ServiceConfig } from './types'
import type { FictionEnvHookDictionary } from './hooks'

export { envConfig, vars, EnvVar }
export * from './types'
export * from './entry'
export * from './commands'

export interface FictionControlSettings {
  hooks?: HookType<FictionEnvHookDictionary>[]
  envFiles?: string[]
  envFilesProd?: string[]
  env?: Record<string, string>
  cwd: string
  mainFilePath?: string
  distFolder?: string
  inspector?: boolean
  nodemonConfigPath?: string
  id?: string
  commands?: CliCommand<string>[]
  mode?: 'development' | 'production'
  isApp?: boolean
  isTest?: boolean
  version?: string
  serverOnlyModules?: ServerModuleDef[]
  uiPaths?: string[]
  meta?: { version?: string, app?: {
    name?: string
    email?: string
    url?: string
    domain?: string
    siteId?: string
    orgId?: string
  } }
}

type BaseCompiled = {
  commands: string
  vars: string
  [key: string]: any
}

export type EnvEventMap = {
  shutdown: CustomEvent<{ reason: string }>
  notify: CustomEvent<UserNotification>
}

export class FictionEnv<
  S extends BaseCompiled = BaseCompiled,
> extends FictionObject<FictionControlSettings> {
  events = new TypedEventTarget<EnvEventMap>({ fictionEnv: this })
  generatedConfig?: S
  commands = this.settings.commands || standardAppCommands
  hooks = this.settings.hooks || []
  envFiles = this.settings.envFiles || []
  envFilesProd = this.settings.envFilesProd || []
  env = this.settings.env || {}
  cwd = this.settings.cwd
  mainFilePath = this.settings.mainFilePath || path.join(this.cwd, 'index.ts')
  meta = this.settings.meta || { }
  id = this.settings.id || toSlug(this.meta.app?.name) || 'fiction'
  inspector = this.settings.inspector || false
  mode = vue.ref<'development' | 'production' | undefined>(isDev() ? 'development' : 'production')
  isRestart = () => crossVar.get('IS_RESTART') === '1'

  isApp = vue.ref(this.settings.isApp)
  isSSR = vue.computed(() => !!(this.isApp.value && this.isNode))
  isCompiled = vue.ref(false)
  isTest = vue.ref(this.settings.isTest)
  isServer = vue.computed(() => !this.isApp.value)
  isProd = vue.computed(() => !isDev())
  isDev = vue.ref()
  hasWindow = typeof window !== 'undefined'
  isNode = isNode()

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

  runHooks<T extends keyof FictionEnvHookDictionary>(hook: T, ...args: FictionEnvHookDictionary[T]['args']) {
    return runHooks<FictionEnvHookDictionary, T>({ list: this.hooks, hook, args })
  }

  runHooksSync<T extends keyof FictionEnvHookDictionary>(hook: T, ...args: FictionEnvHookDictionary[T]['args']) {
    return runHooksSync<FictionEnvHookDictionary, T>({ list: this.hooks, hook, args })
  }

  public addHook<T extends HookType<FictionEnvHookDictionary>>(hook: T): void {
    this.hooks.push(hook)
  }

  constructor(settings: FictionControlSettings) {
    super('env', settings)

    const commitId = crossVar.get('RUNTIME_COMMIT') || ''
    this.log.info(`[start] environment`, {
      data: {
        appName: this.meta.app?.name || 'no name',
        version: `${this.version || 'no version'} [fiction: ${fictionVersion}]`,
        vars: Object.keys(crossVar.vars()).length,
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
      caller: 'envConfig',
      context: 'cli',
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

    envConfig.list.forEach(c => c.onLoad({ fictionEnv: this }))
  }

  override setup() {
    const vars = this.getVars()

    if (!this.isApp.value) {
      this.log.info(
        `variables (${vars.length} total / ${vars.filter(_ => _.isPublic).length} public)`,
        { data: this.getRenderedEnvVars(), disableOnRestart: true },
      )

      // log memory usage on interval
      logMemoryUsage()
    }

    this.verifyEnv()
  }

  commandName = vue.ref(crossVar.get('COMMAND') || '')
  commandOpts = vue.ref(JSON.parse(crossVar.get('COMMAND_OPTS') || '{}') as CliOptions)

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

              crossVar.set(processKey as keyof RunVars, String(value))
            }
          })

          if (fullOpts.mode) {
            this.mode.value = fullOpts.mode

            crossVar.set('NODE_ENV', fullOpts.mode)
          }

          if (crossVar.has('VITEST'))
            crossVar.set('IS_TEST', 'yes')
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
          vari.val = vue.ref(crossVar.get(vari.name) as string | undefined)

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
        const val = crossVar.get(name) as string
        return new EnvVar({ name, val: val || String(c.port.value), isPublic: true })
      })

    return [...customVars, ...commandVars]
  }

  getPublicVars() {
    return this.getVars().filter(_ => _.isPublic && _.val.value)
  }

  getRenderedEnvVars(): Record<string, string | Record<string, string>> {
    const rendered = Object.fromEntries(
      this.getPublicVars().filter(_ => _.val.value).map(_ => [_.name, _.val.value]),
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
            keys: Object.entries(parsed || {}).map(([key, v]) => `${key}(${v.length})`).join(', '),
          },
        })
      }
      else if (error) {
        this.log.warn(`envFile does not exist`, { data: { envFile } })
      }
    })

    // set env vars added directly to config
    Object.entries(this.env).forEach(([key, value]) => {
      crossVar.set(key as keyof RunVars, value)
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

  override async afterSetup() {
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

  onCommand(
    commands: string[],
    callback: (command: string, options: CliOptions) => Promise<void>,
  ): void {
    this.hooks.push({
      hook: 'runCommand',
      callback: async (command: string, opts: CliOptions) => {
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
    serviceConfig: ServiceConfig
    cliVars?: Partial<CliVars>
    runVars?: Partial<RunVars>
  }) {
    const { context, serviceConfig, cliVars, runVars } = args

    let cmd: CliCommand | undefined = this.currentCommand.value
    if (context === 'app')
      cmd = this.commands.find(_ => _.command === cmd?.clientCommand)

    const options = { command: cmd?.command, ...cmd?.options }

    await runHooks({ list: this.hooks, hook: 'runCommand', args: [options.command || 'not_set', options] })

    if (serviceConfig?.runCommand)
      await serviceConfig.runCommand({ context, command: options.command || 'not_set', options, cliVars, runVars })
  }

  async serverRunCurrentCommand(args: { serviceConfig: ServiceConfig, cliVars: Partial<CliVars> }): Promise<void> {
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

    if (cliCommand.options.exit) {
      const reason = `--exit flag set`
      this.log.info(`shutting down`, { data: { reason } })
      this.events.emit('shutdown', { reason })
    }
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
    // prevent memory leak
    if (this.isApp.value) {
      return
    }

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
