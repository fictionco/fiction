import type { Express } from 'express'
import type http from 'node:http'
import type { Config as TailwindConfig } from 'tailwindcss'
import type * as vite from 'vite'
import type { RunVars, StandardServices } from '../inject'
import type { FictionPluginSettings } from '../plugin'
import type { FictionBuild } from '../plugin-build'
import type { FictionAppEntry, FictionEnv, ServiceConfig, ServiceList } from '../plugin-env'
import type { FictionRouter } from '../plugin-router/index.js'
import path from 'node:path'
import { createHead as createHeadBrowser } from '@unhead/vue/client'
import { createHead as createHeadSSR } from '@unhead/vue/server'
import { FictionPlugin } from '../plugin'
import { EnvVar, vars } from '../plugin-env'
import { AppRoute } from '../plugin-router/index.js'
import { FictionSitemap } from '../plugin-sitemap'
import { HooksUtil, initializeResetUi, isTest, safeDirname, vue } from '../utils'
import ElRoot from './ElRoot.vue'
import { FictionRender } from './plugin-render'

vars.register(() => [
  new EnvVar({ name: 'FICTION_ORG_ID', isOptional: true, isPublic: true }),
])

export type FictionAppSettings = {
  fictionEnv: FictionEnv
  fictionRouter: FictionRouter
  mode?: 'production' | 'development'
  isTest?: boolean
  liveUrl?: string
  localHostname?: string
  isLive?: vue.Ref<boolean>
  altHostnames?: { dev: string, prod: string }[]
  port: number
  rootComponent?: vue.Component
  tailwindConfig?: Partial<TailwindConfig>[]
  srcFolder?: string
  mainIndexHtml?: string
  publicFolder?: string
  appInstanceId?: string // to differentiate multiple apps
  renderTokenSecret?: string
  root?: string
} & FictionPluginSettings

function isConstructor(value: any, name?: string): value is () => any {
  const isValid = typeof value === 'function' && value.prototype && value.prototype.constructor === value
  if (!isValid && name) {
    console.warn(`${name} is not a constructor [skipping]`)
  }
  return isValid
}

export type AppHookEvents = {
  beforeAppMounted: (args: { entry: FictionAppEntry }) => Promise<void>
}

export class FictionApp extends FictionPlugin<FictionAppSettings> {
  isLive = this.settings.isLive ?? this.settings.fictionEnv.isProd
  viteDevServer?: vite.ViteDevServer
  isTest = this.settings.isTest || isTest()
  hooks = new HooksUtil<AppHookEvents>()
  rootComponent = this.settings.rootComponent || ElRoot
  fictionBuild?: FictionBuild
  fictionRender?: FictionRender
  fictionSitemap?: FictionSitemap
  port = vue.ref(this.settings.port || 3000)
  appServer?: http.Server
  staticServer?: http.Server
  localHostname = this.settings.localHostname || `localhost`
  localUrl = vue.computed(() => `http://${this.localHostname}:${this.port.value}`)
  prodUrl = vue.computed(() => this.settings.liveUrl || this.localUrl.value)
  liveUrl = vue.ref(this.settings.liveUrl || this.localUrl.value)

  appUrl = vue.computed(() => {
    const isLive = this.settings.isLive?.value ?? false
    return isLive ? this.liveUrl.value : this.localUrl.value
  })

  srcFolder = this.settings.srcFolder || this.settings.fictionEnv.cwd
  mainIndexHtml = this.settings.mainIndexHtml || path.join(this.srcFolder, 'index.html')
  publicFolder = this.settings.publicFolder || path.join(this.srcFolder, 'public')

  appInstanceId = this.settings.appInstanceId || 'app'

  constructor(settings: FictionAppSettings) {
    super('FictionApp', { root: safeDirname(import.meta.url), ...settings })

    /**
     * node application init
     */
    if (!this.settings.fictionEnv.isApp.value && this.settings.fictionEnv?.cwd) {
      if (isConstructor(FictionRender, 'FictionRender')) {
        this.fictionRender = new FictionRender({ fictionApp: this, ...this.settings })
      }

      if (isConstructor(FictionSitemap, 'FictionSitemap')) {
        this.fictionSitemap = new FictionSitemap({ fictionApp: this, ...this.settings })
      }
    }

    // add testing routes
    this.settings.fictionRouter.update([new AppRoute({ name: 'renderTest', path: '/render-test', component: async (): Promise<any> => import('./test/TestRunVars.vue') })])

    this.fictionEnv?.events.on('shutdown', async () => this.close())
  }

  // tailwindConfig = this.settings.tailwindConfig ?? []
  // addTailwindConfig(tailwindConfig: Partial<TailwindConfig>) {
  //   this.tailwindConfig = [...this.tailwindConfig, tailwindConfig]
  // }

  async buildApp(options: { render?: boolean, serve?: boolean } = {}) {
    if (this.settings.fictionEnv.isApp.value)
      return

    return this.fictionRender?.buildApp(options)
  }

  async serveStaticApp() {
    return this.fictionRender?.serveStaticApp()
  }

  createVueApp = async (args: {
    runVars: Partial<RunVars>
    service: ServiceList & Partial<StandardServices>
    initialState: Record<string, any>
  }): Promise<FictionAppEntry> => {
    const { service, runVars, initialState = {} } = args

    const { fictionEnv, fictionRouter } = this.settings

    const router = fictionRouter.create({ caller: `mountApp:${this.appInstanceId}` })

    const isSSR = fictionEnv.isSSR.value
    if (isSSR) {
      await fictionRouter.replace(runVars?.PATHNAME || '/', { caller: 'CreateSSRVueApp', logLevel: 'debug' })
    }
    const app: vue.App = isSSR ? vue.createSSRApp(this.rootComponent) : vue.createApp(this.rootComponent)

    fictionEnv.service.value = { ...fictionEnv.service.value, ...service, runVars }
    app.provide('service', fictionEnv.service)

    // initial state in browser only, passed via #__INITIAL_STATE__
    fictionEnv.initialState.value = { ...fictionEnv.initialState.value, ...initialState }
    app.provide('initialState', initialState)

    app.use(router)

    await router.isReady()
    const meta = isSSR ? createHeadSSR() : createHeadBrowser()
    app.use(meta)
    return { app, router, meta, service }
  }

  /**
   * this runs during rendering and browser
   */
  async mountApp(args: {
    selector?: string
    mountEl?: Element
    serviceConfig?: ServiceConfig
  }): Promise<FictionAppEntry> {
    const { selector = '#app', serviceConfig } = args

    const runVars = serviceConfig?.runVars || {}
    const service = serviceConfig?.service || {}
    const initialState = serviceConfig?.__INITIAL_STATE__ || {}

    const { fictionEnv, fictionRouter } = this.settings
    if (serviceConfig)
      await fictionEnv.crossRunCommand({ context: 'app', serviceConfig, runVars })

    const entry = await this.createVueApp({ runVars, service, initialState })

    if (typeof window !== 'undefined' && !this.settings.fictionEnv.isSSR.value) {
      await this.hooks.run('beforeAppMounted', { entry })

      const mountEl = args.mountEl || document.querySelector(selector)

      if (!mountEl) {
        this.log.error(`mountEl not found: ${selector}`, { data: { html: document.documentElement.innerHTML } })
        throw new Error(`mountEl not found: ${selector}`)
      }

      initializeResetUi({ fictionRouter, fictionEnv }).catch(console.error)

      entry.app.mount(mountEl)

      document.documentElement.style.opacity = '1'
      document.documentElement.style.transform = 'none'
      mountEl.classList.remove('loading')
      mountEl.classList.add('loaded')
    }

    return entry
  }

  logReady(args: { serveMode: string }) {
    const app = this.settings.fictionEnv.meta || {}
    const { port, appInstanceId, prodUrl, localUrl, settings } = this
    const serveMode = args.serveMode
    const isLive = this.isLive.value ?? false
    const data: Record<string, any> = { instanceId: appInstanceId, app, port: port.value, prodUrl: prodUrl.value, localUrl: localUrl.value, isLive, serveMode }

    if (settings.altHostnames?.length) {
      const mode = isLive ? 'prod' : 'dev'
      const port = isLive ? '' : `:${this.port.value}`
      const protocol = isLive ? 'https' : 'http'

      data.altUrls = settings.altHostnames.map(_ => `${protocol}://${_[mode]}${port}`)
    }

    this.log.info(`serving app [ready]`, { data })
  }

  async ssrServerSetup(
    args: { mode?: 'dev' | 'prod' | 'test', expressApp?: Express, id?: string } = {},
  ): Promise<Express | undefined> {
    if (this.settings.fictionEnv.isApp.value || !this.fictionRender)
      return

    const { mode = 'dev', expressApp, id = `ssr-${this.appInstanceId}` } = args
    const eApp = await this.fictionRender.createExpressApp({ mode, expressApp, id })

    return eApp
  }

  async ssrServerCreate(
    args: { mode?: 'dev' | 'prod' | 'test', expressApp?: Express } = {},
  ): Promise<http.Server | undefined> {
    const { mode = 'dev', expressApp } = args
    if (this.settings.fictionEnv.isApp.value || !this.fictionRender)
      return

    if (this.appServer) {
      this.appServer.close()
    }

    const setupExpressApp = await this.ssrServerSetup({ mode, expressApp })

    return this.restartableAppServer({ expressApp: setupExpressApp })
  }

  async restartableAppServer(args: { expressApp?: Express, isRestart?: boolean } = {}) {
    const { expressApp, isRestart } = args
    if (this.appServer) {
      this.appServer.close()
    }

    await new Promise<void>((resolve) => {
      this.appServer = expressApp?.listen(this.port.value, () => resolve())
    })

    this.logReady({ serveMode: 'ssr' })

    if (!isRestart) {
      this.fictionEnv.events.on('restartServers', async () => this.restartableAppServer({ ...args, isRestart: true }))
    }

    return this.appServer
  }

  async close(args: { caller?: string } = {}) {
    const { caller = 'unknown' } = args
    this.log.info(`close app: ${this.appInstanceId} (${caller})`)
    this.appServer?.close()
    this.staticServer?.close()

    await this.fictionRender?.viteDevServer?.close()
  }
}
