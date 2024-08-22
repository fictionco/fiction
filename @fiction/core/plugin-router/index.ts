import type { NavigationGuardWithThis, NavigationHookAfter, RouteLocationNormalizedLoaded } from 'vue-router'

import type { FictionPluginSettings } from '../plugin.js'
import { FictionPlugin } from '../plugin.js'
import { refineRoute, safeDirname, sortPriority, vue, vueRouter } from '../utils/index.js'
import type { FictionEnv } from '../plugin-env/index.js'
import type { AppRoute } from './appRoute.js'

export * from './types.js'
export * from './appRoute.js'

type LocationValue = string | number | null | undefined
type LinkReplace = Record<string, LocationValue | vue.Ref<LocationValue> | LocationValue[] >

type FictionRouterSettings = {
  routes?: AppRoute<string>[] | ((router: FictionRouter) => AppRoute<string>[])
  replacers?: LinkReplace
  fictionEnv?: FictionEnv
  baseUrl?: string
  termsUrl?: string
  privacyUrl?: string
  routerId?: string
  create?: boolean
  routeBasePath?: string
} & FictionPluginSettings

type BaseCompiled = {
  routes: string
  [key: string]: any
}

export class FictionRouter<
  S extends BaseCompiled = BaseCompiled,
> extends FictionPlugin<FictionRouterSettings> {
  routerId = this.settings.routerId || 'router'
  readonly routes: vue.Ref<AppRoute<string>[]>
  router: vue.Ref<vueRouter.Router | undefined> = vue.shallowRef()

  replacers: LinkReplace

  loadingRoute = vue.ref(true)
  baseUrl = this.settings.baseUrl || this.fictionEnv?.meta.app?.url || ''
  // prepended to every route (vue-router base)
  routeBasePath = this.settings.routeBasePath || '/'
  noBrowserNav = vue.ref(!!this.fictionEnv?.isNode)
  constructor(settings: FictionRouterSettings) {
    super(settings.routerId || 'router', { root: safeDirname(import.meta.url), ...settings })
    this.replacers = settings.replacers || {}

    const initialRoutes = typeof settings.routes === 'function' ? settings.routes(this) : settings.routes
    this.routes = vue.shallowRef(initialRoutes || []) as vue.Ref< AppRoute<string>[] >

    if (settings.create)
      this.create({ caller: 'init' })
  }

  create(args?: { noBrowserNav?: boolean, caller?: string }) {
    if (!this.router.value) {
      this.noBrowserNav.value = args?.noBrowserNav ?? this.noBrowserNav.value
      // Inline the logic from createFictionRouter if it's not used elsewhere
      const history = this.noBrowserNav.value
        ? vueRouter.createMemoryHistory()
        : vueRouter.createWebHistory(this.routeBasePath)

      this.log.debug(`creating router ${this.routerId}`, { data: { noBrowserNav: this.noBrowserNav.value, caller: args?.caller } })

      this.router.value = vueRouter.createRouter({
        history,
        routes: this.vueRoutes.value,
        scrollBehavior(to, from, savedPosition) {
          if (to.hash !== from.hash && to.hash)
            return { el: to.hash, behavior: 'smooth' }
          else if (savedPosition)
            return savedPosition
          else return { top: 0 }
        },
      })

      // Define router hooks directly here if they're not too complex
      this.router.value.beforeEach(this.routerBeforeEach)
      this.router.value.afterEach(this.routerAfterEach)

      this.log.debug(`created router with ${this.routes.value.length} routes`, { data: { r: this.router.value?.getRoutes().map(r => r.path) } })
    }

    return this.router.value
  }

  routerBeforeEach: NavigationGuardWithThis<undefined> = async (to, from) => {
    this.loadingRoute.value = true

    const result = await this.settings.fictionEnv.runHooks('routeBeforeEach', { to, from, navigate: true })

    const ar = this.routes.value.find(r => r.name === to.name)

    let navigate: ReturnType<vueRouter.NavigationGuard> = result.navigate || true
    if (ar && ar.before)
      navigate = await ar.before({ fictionRouter: this, isSSR: this.fictionEnv?.isSSR.value || false, to, from, navigate })

    return navigate
  }

  routerAfterEach: NavigationHookAfter = async (to, from) => {
    this.loadingRoute.value = false
    await this.settings.fictionEnv.runHooks('routeAfterEach', { to, from })

    const ar = this.routes.value.find(r => r.name === to.name)

    if (ar && ar.after)
      await ar.after({ fictionRouter: this, to, from })
  }

  addReplacers = (replacers: LinkReplace) => (this.replacers = { ...this.replacers, ...replacers })
  vueRoutes = vue.computed<vueRouter.RouteRecordRaw[]>(() => this.convertAppRoutesToRoutes(this.routes.value))

  public update = (routeList: AppRoute<string>[] = []) => {
    const r = routeList || []

    this.routes.value = [...this.routes.value, ...r]

    this.updateVueRouter()
  }

  /**
   * Adds multiple routes to the router
   */
  private updateVueRouter = () => {
    const rtr = this.router.value
    if (rtr)
      this.vueRoutes.value.forEach(r => rtr.addRoute(r))
  }

  private convertAppRouteToRoute = (
    list: AppRoute<string>[],
  ): vueRouter.RouteRecordRaw[] => {
    return list
      .map((li) => {
        if (!li.component)
          throw new Error(`component missing in internal route: ${li.name}`)

        const { title, niceName } = li
        const { path, name, auth, component, props } = li.settings
        const out: vueRouter.RouteRecordRaw = {
          path,
          name,
          component,
          meta: { title, niceName, auth, ...li.meta },
          props,
          children: [],
        }

        if (li.children.length > 0) {
          const cld = this.convertAppRouteToRoute(li.children) // recursive
          out.children = cld
        }

        return out
      })
      .filter(Boolean) as vueRouter.RouteRecordRaw[]
  }

  private convertAppRoutesToRoutes = (
    routeList?: AppRoute<string>[],
  ): vueRouter.RouteRecordRaw[] => {
    const list = sortPriority(routeList || [])

    const mapped: Record<string, AppRoute<string>> = {}

    list.forEach((r) => {
      if (r.parent) {
        // sometimes with added routes, the parent hasn't been added yet
        // it will be updated later
        if (mapped[r.parent]) {
          const children = mapped[r.parent]?.children ?? []
          mapped[r.parent].children = [...children, r]
        }
      }
      else {
        mapped[r.name] = r
      }
    })

    return this.convertAppRouteToRoute(Object.values(mapped))
  }

  /**
   * Does the current route require authentication?
   */
  routeRequiresAuth = (): boolean => {
    const route = this.router.value?.currentRoute.value

    return route
      ? route.matched.some(_ => _.meta.auth || _.meta.authRedirect)
      : false
  }

  public rawPath(name: S['routes'], replace?: Record<string, string>): string {
    const val = this.routes.value.find(r => name === r.name)

    let out = val?.path

    if (!out) {
      this.log.warn(`route for ${String(name)} is missing`)
      out = name
    }

    if (replace) {
      Object.entries(replace).forEach(([key, val]) => {
        out = out?.replace(key, val)
      })
    }

    return out
  }

  defaultRoute = { name: 'defaultRoute', path: '', params: {}, query: {}, meta: {}, fullPath: '', matched: [], hash: '', redirectedFrom: undefined } as RouteLocationNormalizedLoaded

  current = vue.computed<RouteLocationNormalizedLoaded>(() => this.router.value?.currentRoute.value || this.defaultRoute)

  query = vue.computed({ get: () => this.current.value.query, set: async (val) => { await this.push({ query: val }, { caller: 'querySet' }) } })
  params = vue.computed(() => this.current.value.params)
  meta = vue.computed(() => this.current.value.meta)
  vars = vue.computed(() => ({ ...this.params.value, ...this.query.value }))

  routeRef(name: S['routes'], replacers?: LinkReplace): vue.ComputedRef<string> {
    return vue.computed<string>(() => {
      const routePath = !name.includes('/') ? this.rawPath(name) : name
      const params = this.current.value.params
      const rep = { ...replacers, ...this.replacers }
      const combinedReplacers = Object.fromEntries(Object.entries(rep).map(([key, val]) => {
        const v = (vue.isRef(val) ? val.value : val) ?? params[key] as string
        return [key, v]
      }))

      return refineRoute(routePath, combinedReplacers)
    })
  }

  public link(
    key: S['routes'],
    replace: LinkReplace = {},
    query?: Record<string, any> | undefined,
  ): vue.Ref<string> {
    return vue.computed(() => {
      const params = new URLSearchParams(query).toString()
      const searchParams = params ? `?${params}` : ''

      const route = this.routeRef(key, replace).value

      return `${route}${searchParams}`
    })
  }

  public url(
    key: S['routes'],
    replace: LinkReplace = {},
    query?: Record<string, any> | undefined,
  ): vue.Ref<string> {
    return vue.computed(() => `${this.baseUrl}${this.link(key, replace, query).value}`)
  }

  public async push(
    location: vueRouter.RouteLocationRaw,
    options: { caller: string, navMode?: 'push' | 'replace' },
  ) {
    if (!this.router.value)
      throw new Error(`router not initialized [${this.settings.routerId}]`)

    const { caller = 'unknown', navMode = 'push' } = options || {}
    const path = typeof location === 'string' ? location : caller
    const current = this.current.value.path

    this.log.info(`${this.settings.routerId}(${caller}): ${current} -> ${path}`, { data: location })

    if (navMode === 'replace')
      await this.router.value.replace(location)
    else
      await this.router.value.push(location)
  }

  public async setQueryVar(
    queryVar: string,
    value: string | number | undefined,
  ) {
    const query = this.query.value
    const current = query[queryVar]

    if (current !== value) {
      const newQuery = { ...query, [queryVar]: value ?? null }

      await this.replace({ query: newQuery } as vueRouter.RouteLocationRaw)
    }
  }

  public async replace(
    location: vueRouter.RouteLocationRaw,
    options?: { caller?: string },
  ) {
    const { caller = 'unknown' } = options || {}

    if (!this.router.value)
      throw new Error(`router not initialized [${this.settings.routerId}]`)

    let path: string | undefined = ''
    if (typeof location === 'string')
      path = location
    else if ('path' in location)
      path = location.path

    if (typeof path !== 'string')
      this.log.error(`invalid path: ${path}`, { data: location })

    if (!this.fictionEnv?.isRendering)
      this.log.info(`replacing route ${path} [from ${caller}]`)

    await this.router.value.replace(location)
  }

  public async goto(
    key: S['routes'],
    replace: LinkReplace = {},
    query: LinkReplace = {},
    options: { navMode?: 'push' | 'replace', caller?: string } = {},
  ): Promise<void> {
    const { navMode = 'push', caller = `goto:${key}` } = options || {}

    const path = this.link(key, replace, query).value

    await this.push(path, { caller, navMode })
  }

  toConfig() {
    return {
      routerId: this.settings.routerId,
      current: this.current.value,
      routes: this.routes.value.map(r => r.toConfig()),
      baseUrl: this.baseUrl,
      routeBasePath: this.routeBasePath,
    }
  }
}
