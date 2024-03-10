import type http from 'node:http'
import path from 'node:path'
import type * as vite from 'vite'
import type { Config as TailwindConfig } from 'tailwindcss'
import type { Express } from 'express'
import { createHead } from '@unhead/vue'
import type { HookType } from '../utils'
import { initializeResetUi, safeDirname, vue } from '../utils'
import type { FictionAppEntry, FictionEnv, ServiceConfig, ServiceList } from '../plugin-env'
import { FictionPlugin } from '../plugin'
import type { FictionBuild } from '../plugin-build'
import { AppRoute, type FictionRouter } from '../plugin-router'
import type { RunVars, StandardServices } from '../inject'
import { FictionRender } from './plugin-render'
import ElRoot from './ElRoot.vue'
import type { FictionSitemap } from './sitemap'
import type { SiteMapEntry } from './types'

type HookDictionary = {
  beforeAppMounted: { args: [FictionAppEntry] }
  appMounted: { args: [FictionAppEntry] }
  afterAppSetup: { args: [{ service: ServiceList }] }
  viteConfig: { args: [vite.InlineConfig[]] }
  headTags: { args: [string, { pathname?: string }] }
  htmlBody: { args: [string, { pathname?: string }] }
}

export interface FictionAppSettings {
  hooks?: HookType<HookDictionary>[]
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
  sitemaps?: SiteMapEntry[]
  uiPaths?: string[]
  tailwindConfig?: Partial<TailwindConfig>[]
  srcFolder?: string
  mainIndexHtml?: string
  publicFolder?: string
  appInstanceId?: string // to differentiate multiple apps
  [key: string]: unknown
}

export class FictionApp extends FictionPlugin<FictionAppSettings> {
  isLive = this.settings.isLive ?? this.settings.fictionEnv.isProd
  viteDevServer?: vite.ViteDevServer
  hooks = this.settings.hooks ?? []
  uiPaths = this.settings.uiPaths ?? []
  fictionRouter = this.settings.fictionRouter
  isTest = this.settings.isTest || this.utils.isTest()
  rootComponent = this.settings.rootComponent || ElRoot
  fictionEnv = this.settings.fictionEnv
  fictionBuild?: FictionBuild
  fictionSitemap?: FictionSitemap
  fictionRender?: FictionRender
  appName: string
  appEmail: string
  sitemaps = this.settings.sitemaps ?? []
  port = this.settings.port || 3000
  appServer?: http.Server
  staticServer?: http.Server
  localHostname = this.settings.localHostname || `localhost`
  localUrl = `http://${this.localHostname}:${this.port}`
  liveUrl = vue.ref(this.settings.liveUrl || this.localUrl)
  appUrl = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive?.value ?? false
    return isLive ? this.liveUrl.value : this.localUrl
  })

  srcFolder = this.settings.srcFolder || this.fictionEnv.cwd
  mainIndexHtml = this.settings.mainIndexHtml || path.join(this.srcFolder, 'index.html')
  publicFolder = this.settings.publicFolder || path.join(this.srcFolder, 'public')

  appInstanceId = this.settings.appInstanceId || 'app'
  root = safeDirname(import.meta.url)

  constructor(settings: FictionAppSettings) {
    super('app', settings)

    this.appEmail = this.fictionEnv.appEmail
    this.appName = this.fictionEnv.appName
    /**
     * node application init
     */
    if (!this.fictionEnv.isApp.value && this.fictionEnv?.cwd) {
      this.fictionRender = new FictionRender({
        fictionApp: this,
        fictionEnv: this.fictionEnv,
        fictionRouter: this.fictionRouter,
      })
    }

    // add testing routes
    this.fictionRouter.update([new AppRoute({ name: 'renderTest', path: '/render-test', component: (): Promise<any> => import('./test/TestRunVars.vue') })])

    this.addSchema()
  }

  addSchema() {
    if (this.fictionEnv) {
      this.fictionEnv.addHook({
        hook: 'staticSchema',
        callback: async (existing) => {
          const routeKeys = this.fictionRouter.routes.value?.map(_ => _.name).filter(Boolean).sort()

          return { ...existing, routes: { enum: routeKeys, type: 'string' }, menus: { enum: [''], type: 'string' } }
        },
      })

      this.fictionEnv.addHook({
        hook: 'staticConfig',
        callback: (
          schema: Record<string, unknown>,
        ): Record<string, unknown> => {
          return { ...schema, routes: this.fictionRouter.routes.value?.map(ep => ({ key: ep.name, path: ep.path })) }
        },
      })
    }
  }

  public addHook(hook: HookType<HookDictionary>): void {
    this.hooks.push(hook)
  }

  addSitemap(sitemap: SiteMapEntry) {
    this.sitemaps = [...this.sitemaps, sitemap]
  }

  addUiPaths(uiPaths: string[]) {
    this.uiPaths = [...this.uiPaths, ...uiPaths]
  }

  tailwindConfig = this.settings.tailwindConfig ?? []
  addTailwindConfig(tailwindConfig: Partial<TailwindConfig>) {
    this.tailwindConfig = [...this.tailwindConfig, tailwindConfig]
  }

  async buildApp(options: { render?: boolean, serve?: boolean } = {}) {
    if (this.fictionEnv.isApp.value)
      return

    return this.fictionRender?.buildApp(options)
  }

  async serveStaticApp() {
    if (this.fictionEnv.isApp.value)
      return
    return this.fictionRender?.serveStaticApp()
  }

  createVueApp = async (args: {
    renderRoute?: string
    runVars?: Partial<RunVars>
    service: ServiceList & Partial<StandardServices>
  }): Promise<FictionAppEntry> => {
    const { renderRoute, service, runVars } = args

    const router = this.fictionRouter.create({ caller: `mountApp:${this.appInstanceId}` })

    if (renderRoute)
      await this.fictionRouter.replace({ path: renderRoute }, { id: 'mount' })

    await this.utils.runHooks<HookDictionary, 'afterAppSetup'>({
      list: this.hooks,
      hook: 'afterAppSetup',
      args: [{ service }],
    })

    const app: vue.App = renderRoute
      ? vue.createSSRApp(this.rootComponent)
      : vue.createApp(this.rootComponent)

    this.fictionEnv.service.value = { ...this.fictionEnv.service.value, ...service, runVars }
    app.provide('service', this.fictionEnv.service)

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

    await this.fictionEnv.crossRunCommand({ context: 'app', serviceConfig, runVars })

    const entry = await this.createVueApp({ renderRoute, runVars, service })

    if (typeof window !== 'undefined' && !this.fictionEnv.isSSR.value) {
      await this.utils.runHooks<HookDictionary, 'beforeAppMounted'>({
        list: this.hooks,
        hook: 'beforeAppMounted',
        args: [entry],
      })

      const mountEl = args.mountEl || document.querySelector(selector)

      if (!mountEl)
        throw new Error(`mountEl not found: ${selector}`)

      initializeResetUi(this.fictionRouter).catch(console.error)
      entry.app.mount(mountEl)

      document.documentElement.style.opacity = '1'
      document.documentElement.style.transform = 'scale(1)'
      mountEl.classList.remove('loading')
      mountEl.classList.add('loaded')

      await this.utils.runHooks<HookDictionary, 'appMounted'>({
        list: this.hooks,
        hook: 'appMounted',
        args: [entry],
      })
    }

    return entry
  }

  logReady(args: { serveMode: string }) {
    const { appName = 'Unnamed App', port, appInstanceId, liveUrl, localUrl, settings } = this
    const serveMode = args.serveMode
    const isLive = this.isLive.value ?? false
    const data: Record<string, any> = { instanceId: appInstanceId, appName, port, liveUrl: liveUrl.value, localUrl, isLive, serveMode }

    if (settings.altHostnames?.length) {
      const mode = isLive ? 'prod' : 'dev'
      const port = isLive ? '' : `:${this.port}`
      const protocol = isLive ? 'https' : 'http'

      data.altUrls = settings.altHostnames.map(_ => `${protocol}://${_[mode]}${port}`)
    }

    this.log.info(`serving app [ready]`, { data })
  }

  async ssrServerSetup(
    args: { isProd?: boolean, expressApp?: Express } = {},
  ): Promise<Express | undefined> {
    if (this.fictionEnv.isApp.value || !this.fictionRender)
      return

    const { isProd = false, expressApp } = args
    const eApp = await this.fictionRender.createExpressApp({ isProd, expressApp })

    return eApp
  }

  /**
   * This creates an endpoint server and ssr server on same port
   * Allows production apps to serve on one instance
   */
  // async comboSsrServerCreate(args: { isProd?: boolean, fictionServer: FictionServer, fictionUser: FictionUser }) {
  //   const { isProd = false, fictionServer, fictionUser } = args
  //   fictionServer.port.value = this.port
  //   fictionServer.useLocal.value = true
  //   const srv = await fictionServer.initServer({ fictionUser })
  //   await this.ssrServerSetup({ isProd, expressApp: srv?.expressApp })
  //   await srv?.run()
  //   this.logReady({ serveMode: 'comboSSR' })
  // }

  async ssrServerCreate(
    args: { isProd?: boolean, expressApp?: Express } = {},
  ): Promise<http.Server | undefined> {
    const { isProd = false, expressApp } = args
    if (this.fictionEnv.isApp.value || !this.fictionRender)
      return

    const eApp = await this.ssrServerSetup({ isProd, expressApp })

    await new Promise<void>((resolve) => {
      this.appServer = eApp?.listen(this.port, () => resolve())
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
