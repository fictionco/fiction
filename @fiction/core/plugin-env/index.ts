import path from 'node:path'
import dotenv from 'dotenv'
import { FictionObject } from '../plugin.js'
import type { HookType, UserNotification } from '../utils/index.js'
import { crossVar, isApp, isCi, isDev, isNode, isTest, onResetUi, resetUi, runHooks, runHooksSync, shortId, toSlug, toSnake, vue, waitFor } from '../utils/index.js'
import { version as fictionVersion } from '../package.json'
import type { RunVars } from '../inject.js'
import { TypedEventTarget } from '../utils/eventTarget.js'
import { logMemoryUsage } from '../utils/nodeUtils.js'
import type { CleanupCallback } from '../types/index.js'
import { type BrowserEventObject, onBrowserEvent } from '../utils/eventBrowser.js'
import { compileApplication } from './entry.js'
import type { CliCommand } from './commands.js'
import { standardAppCommands } from './commands.js'
import { generateStaticConfig } from './generate.js'
import { commonServerOnlyModules } from './serverOnly.js'
import { EnvVar, envConfig, vars } from './onImport.js'
import type { CliOptions, CliVars, ResetUiScope, ResetUiTrigger, ServerModuleDef, ServiceConfig } from './types.js'
import type { FictionEnvHookDictionary } from './hooks.js'

export { envConfig, vars, EnvVar }
export * from './types.js'
export * from './entry.js'
export * from './commands.js'

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
  staticPaths?: string[]
  meta?: {
    version?: string
    app?: {
      name?: string
      email?: string
      url?: string
      domain?: string
      siteId?: string // set dynamically
      orgId?: string // set dynamically
      userId?: string // set dynamically
    }
  }
}

type BaseCompiled = {
  commands: string
  vars: string
  [key: string]: any
}

export type EnvEventMap = {
  resetUi: CustomEvent<{ scope: ResetUiScope, cause: string, trigger: ResetUiTrigger }>
  keypress: CustomEvent<{ key: string, direction: 'up' | 'down' }>
  shutdown: CustomEvent<{ reason: string }> // shut down services, server
  restartServers: CustomEvent<{ reason: string }> // restart services, server
  notify: CustomEvent<UserNotification>
  cleanup: CustomEvent<{ reason: string }> // clear memory, etc.
}

export class FictionEnv<
  S extends BaseCompiled = BaseCompiled,
> extends FictionObject<FictionControlSettings> {
  rand = shortId()
  cleanupCallbacks: CleanupCallback[] = []
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
  isCi = isCi()
  hasWindow = typeof window !== 'undefined'
  isNode = isNode()

  isRendering = false
  version = this.settings.version || '0.0.0'
  fictionVersion = fictionVersion
  uiPaths = new Set(this.settings.uiPaths)
  staticPaths = new Set(this.settings.staticPaths)

  serverOnlyImports: Record<string, true | Record<string, string>> = commonServerOnlyModules()

  distFolder = this.settings.distFolder || path.join(this.cwd, 'dist')

  heldKeys = vue.ref<Record<string, boolean>>({})

  // allows service passed to app to be modified
  // plugins that add services need to edit this
  // the services are then accessed via useService provide
  service = vue.shallowRef<{ runVars?: Partial<RunVars>, [key: string]: unknown }>({})

  async runHooks<T extends keyof FictionEnvHookDictionary>(hook: T, ...args: FictionEnvHookDictionary[T]['args']) {
    return runHooks<FictionEnvHookDictionary, T>({ list: this.hooks, hook, args })
  }

  runHooksSync<T extends keyof FictionEnvHookDictionary>(hook: T, ...args: FictionEnvHookDictionary[T]['args']) {
    return runHooksSync<FictionEnvHookDictionary, T>({ list: this.hooks, hook, args })
  }

  public addHook<T extends HookType<FictionEnvHookDictionary>>(hook: T): void {
    this.hooks.push(hook)
  }

  constructor(settings: FictionControlSettings) {
    super('FictionEnv', settings)

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

    this.handleEvents()
    this.setupKeyTracking()
  }

  handleEvents() {
    if (!this.hasWindow)
      return

    onResetUi((args) => {
      if (args.cause.includes('env'))
        return
      args.cause = `${args.cause}[env]`
      this.events.emit('resetUi', args)
    })

    this.events.on('resetUi', (event) => {
      const args = event.detail
      if (args.cause.includes('env'))
        return
      args.cause = `${args.cause}[env]`
      resetUi(args)
    })
  }

  setupKeyTracking(): void {
    // Watch for keypress events
    this.events.on('keypress', (event) => {
      const heldKeys = this.heldKeys.value
      const { key, direction } = event.detail
      if (direction === 'down') {
        heldKeys[key] = true
      }
      else if (heldKeys[key]) {
        delete heldKeys[key]
      }
      this.heldKeys.value = { ...heldKeys }
    })

    // Setup window event listeners if window is available
    if (this.hasWindow) {
      this.setupWindowKeyListeners()
    }
  }

  setupWindowKeyListeners(): void {
    const emitKeypress = (event: BrowserEventObject<'keydown' | 'keyup'>): void => {
      const direction = event.type === 'keydown' ? 'down' : 'up'
      this.events.emit('keypress', { key: event.key.toLowerCase(), direction })
    }

    const removeKeydown = onBrowserEvent('keydown', emitKeypress)
    const removeKeyup = onBrowserEvent('keyup', emitKeypress)

    this.cleanupCallbacks.push(() => {
      removeKeydown()
      removeKeyup()
    })
  }

  cleanup(args: { reason: string }) {
    this.events.emit('cleanup', args)
    this.cleanupCallbacks.forEach(cb => cb && cb())
  }

  override setup() {
    const vars = this.getVars()

    if (!this.isApp.value) {
      const total = vars.length
      const publicVars = vars.filter(_ => _.isPublic).length
      this.log.info(
        `${publicVars} public vars (${total} total)`,
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
    const stopWatch = vue.watch(
      () => this.currentCommand.value,
      (cmd) => {
        const fullOpts = cmd?.options ?? {}
        // generally "process" is unavailable in browser
        if (isNode()) {
          // converts cli args --service-port to SERVICE_PORT env var
          Object.entries(fullOpts).forEach(([key, value]) => {
            if (value) {
              const processKey = toSnake(key, { upper: true })

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

    this.cleanupCallbacks.push(() => stopWatch())
  }

  getPluginVars() {
    const isApp = this.isApp.value
    // get custom env vars from plugins, etc.
    const pluginVars = vars.list.flatMap((cb) => {
      const v = cb().map((vari) => {
        if (!isApp || vari.isPublic) {
          if (!vari.val.value)
            vari.val.value = crossVar.get(vari.name) as string | undefined
        }
        else {
          vari.val.value = ''
        }
        return vari
      })

      return v
    })
    return pluginVars
  }

  getVars() {
    const pluginVars = this.getPluginVars()

    // get service ports as env vars; this allows them to be both
    // on client/server side, to sync with other deployment config(docker), etc
    const commandVars = this.commands
      .filter(_ => _.port.value)
      .map((c) => {
        const name = `${c.command.toUpperCase()}_PORT`
        const val = crossVar.get(name) as string
        return new EnvVar({ name, val: val || String(c.port.value), isPublic: true })
      })

    return [...pluginVars, ...commandVars]
  }

  getPublicVars() {
    return this.getVars().filter(_ => _.isPublic && _.val.value)
  }

  getRenderedEnvVars(): Record<string, string | Record<string, string>> {
    const rendered = Object.fromEntries(
      this.getPublicVars().filter(_ => _.val.value).map(_ => [_.name, _.val.value]),
    ) as Record<string, string | Record<string, string>>

    rendered.IS_APP_CLIENT = 'yes'

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
    if (!this.isProd.value && !this.isApp.value && !this.isTest.value && !this.isRestart()) {
      await this.generate()
    }
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
      this.log.warn(`shutting down`, { data: { reason } })
      this.events.emit('cleanup', { reason })
      await waitFor(1000)
      this.events.emit('shutdown', { reason })
    }
  }

  var(variable: S['vars']): string {
    const isApp = this.isApp.value
    const mode = this.mode.value
    const context = isApp ? 'app' : 'node'
    const isCi = this.isCi

    const info = [mode, context, isCi].join(' / ')

    const envVar = this.getVars().find(_ => _.name === variable)

    if (!envVar) {
      throw new Error(`variable definition not set up: ${variable} (IS_APP: ${isApp})`)
    }

    const v = envVar.val.value

    if (envVar.verify) {
      if (!envVar.verify({ fictionEnv: this, value: v }))
        throw new Error(`variable verify failed: ${variable} [${info}]`)
    }
    else if (isApp) {
      if (v && !envVar.isPublic) {
        throw new Error(`truthy variable is not public: ${variable} [${info}]`)
      }
    }
    else {
      if (!v && !envVar.isOptional) {
        throw new Error(`variable is not optional and not set: ${variable} [${info}]`)
      }
    }

    return v || ''
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

    const staticPaths = [
      `${root}/static`,
      `${root}/**/static`,
    ]

    staticPaths.forEach(staticPath => this.staticPaths.add(staticPath))
  }
}
