import type http from 'node:http'
import path from 'node:path'
import type * as vite from 'vite'
import type { Config as TailwindConfig } from 'tailwindcss'
import type { Express } from 'express'
import { createHead } from '@unhead/vue'
import { initializeResetUi, isTest, safeDirname, vue } from '../utils'
import { EnvVar, type FictionAppEntry, type FictionEnv, type ServiceConfig, type ServiceList, vars } from '../plugin-env'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import type { FictionBuild } from '../plugin-build'
import { AppRoute, type FictionRouter } from '../plugin-router'
import type { RunVars, StandardServices } from '../inject'
import { FictionSitemap } from '../plugin-sitemap'
import { FictionRender } from './plugin-render'
import ElRoot from './ElRoot.vue'

vars.register(() => [
  new EnvVar({ name: 'FICTION_ORG_ID', isOptional: true, isPublic: true }),
  new EnvVar({ name: 'FICTION_SITE_ID', isOptional: true, isPublic: true }),
])

export type FictionAppSettings = {
  mode?: 'production' | 'development'
  isTest?: boolean
  liveUrl?: string
  localHostname?: string
  isLive?: vue.Ref<boolean>
  altHostnames?: { dev: string, prod: string }[]
  port: number
  fictionEnv: FictionEnv
  rootComponent?: vue.Component
  fictionRouter: FictionRouter
  tailwindConfig?: Partial<TailwindConfig>[]
  srcFolder?: string
  mainIndexHtml?: string
  publicFolder?: string
  appInstanceId?: string // to differentiate multiple apps
  fictionOrgId?: string
  fictionSiteId?: string
  root?: string
} & FictionPluginSettings

export class FictionApp extends FictionPlugin<FictionAppSettings> {
  isLive = this.settings.isLive ?? this.settings.fictionEnv.isProd
  viteDevServer?: vite.ViteDevServer
  isTest = this.settings.isTest || isTest()
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
  root = safeDirname(import.meta.url)

  constructor(settings: FictionAppSettings) {
    super('FictionApp', settings)

    /**
     * node application init
     */
    if (!this.settings.fictionEnv.isApp.value && this.settings.fictionEnv?.cwd) {
      this.fictionRender = new FictionRender({ fictionApp: this, ...this.settings })
      this.fictionSitemap = new FictionSitemap({ fictionApp: this, ...this.settings })
    }

    // add testing routes
    this.settings.fictionRouter.update([new AppRoute({ name: 'renderTest', path: '/render-test', component: (): Promise<any> => import('./test/TestRunVars.vue') })])

    this.addSchema()
  }

  addSchema() {
    const routes = this.settings.fictionRouter.routes.value || []
    if (this.settings.fictionEnv) {
      this.settings.fictionEnv.addHook({
        hook: 'staticSchema',
        callback: async (existing) => {
          const routeKeys = routes.map(_ => _.name).filter(Boolean).sort()

          return { ...existing, routes: { enum: routeKeys, type: 'string' }, menus: { enum: [''], type: 'string' } }
        },
      })

      this.settings.fictionEnv.addHook({
        hook: 'staticConfig',
        callback: (
          schema: Record<string, unknown>,
        ): Record<string, unknown> => {
          return { ...schema, routes: routes.map(ep => ({ key: ep.name, path: ep.path })) }
        },
      })
    }
  }

  tailwindConfig = this.settings.tailwindConfig ?? []
  addTailwindConfig(tailwindConfig: Partial<TailwindConfig>) {
    this.tailwindConfig = [...this.tailwindConfig, tailwindConfig]
  }

  async buildApp(options: { render?: boolean, serve?: boolean } = {}) {
    if (this.settings.fictionEnv.isApp.value)
      return

    return this.fictionRender?.buildApp(options)
  }

  async serveStaticApp() {
    if (this.settings.fictionEnv.isApp.value)
      return
    return this.fictionRender?.serveStaticApp()
  }

  createVueApp = async (args: {
    renderRoute?: string
    runVars?: Partial<RunVars>
    service: ServiceList & Partial<StandardServices>
  }): Promise<FictionAppEntry> => {
    const { renderRoute, service, runVars } = args

    const router = this.settings.fictionRouter.create({ caller: `mountApp:${this.appInstanceId}` })

    if (renderRoute)
      await this.settings.fictionRouter.replace({ path: renderRoute }, { caller: 'createVueApp' })

    await this.settings.fictionEnv.runHooks('afterAppSetup', { service })

    const app: vue.App = renderRoute
      ? vue.createSSRApp(this.rootComponent)
      : vue.createApp(this.rootComponent)

    this.settings.fictionEnv.service.value = { ...this.settings.fictionEnv.service.value, ...service, runVars }
    app.provide('service', this.settings.fictionEnv.service)

    app.use(router)

    await router.isReady()
    const meta = createHead()
    app.use(meta)
    return { app, router, meta, service }
  }

  /**
   * this runs during rendering and browser
   */
  async mountApp(args: {
    selector?: string
    mountEl?: Element
    renderRoute?: string
    runVars?: Partial<RunVars>
    service: ServiceList & Partial<StandardServices>
    serviceConfig?: ServiceConfig
  }): Promise<FictionAppEntry> {
    const { selector = '#app', renderRoute, service, runVars, serviceConfig } = args

    if (serviceConfig)
      await this.settings.fictionEnv.crossRunCommand({ context: 'app', serviceConfig, runVars })

    const entry = await this.createVueApp({ renderRoute, runVars, service })

    if (typeof window !== 'undefined' && !this.settings.fictionEnv.isSSR.value) {
      await this.settings.fictionEnv.runHooks('beforeAppMounted', entry)

      const mountEl = args.mountEl || document.querySelector(selector)

      if (!mountEl)
        throw new Error(`mountEl not found: ${selector}`)

      initializeResetUi(this.settings.fictionRouter).catch(console.error)
      entry.app.mount(mountEl)

      document.documentElement.style.opacity = '1'
      document.documentElement.style.transform = 'none'
      mountEl.classList.remove('loading')
      mountEl.classList.add('loaded')

      await this.settings.fictionEnv.runHooks('appMounted', entry)
    }

    return entry
  }

  logReady(args: { serveMode: string }) {
    const app = this.settings.fictionEnv.meta.app || {}
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
    args: { isProd?: boolean, expressApp?: Express } = {},
  ): Promise<Express | undefined> {
    if (this.settings.fictionEnv.isApp.value || !this.fictionRender)
      return

    const { isProd = false, expressApp } = args
    const eApp = await this.fictionRender.createExpressApp({ isProd, expressApp })

    return eApp
  }

  async ssrServerCreate(
    args: { isProd?: boolean, expressApp?: Express } = {},
  ): Promise<http.Server | undefined> {
    const { isProd = false, expressApp } = args
    if (this.settings.fictionEnv.isApp.value || !this.fictionRender)
      return

    const eApp = await this.ssrServerSetup({ isProd, expressApp })

    await new Promise<void>((resolve) => {
      this.appServer = eApp?.listen(this.port.value, () => resolve())
    })

    this.logReady({ serveMode: 'ssr' })

    return this.appServer
  }

  async close() {
    this.log.info('close app')
    this.appServer?.close()
    this.staticServer?.close()
    await this.fictionRender?.viteDevServer?.close()
  }
}
