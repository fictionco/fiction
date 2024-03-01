import { FactorPlugin, FactorPluginSettings } from "../plugin"
import { HookType, vue, vueRouter } from "../utils"
import { MenuItem } from "../types/utils"
import { FactorEnv } from "../plugin-env"
import { AppRoute } from "./appRoute"
import { RouteReplacer, NavigateRoute } from "./types"
export * from "./types"
export * from "./appRoute"
import { RouteLocationNormalizedLoaded } from "vue-router"
type FactorRouterSettings = {
  routes?: AppRoute<string>[]
  replacers?: RouteReplacer[]
  hooks?: HookType<FactorRouterHookDictionary>[]
  factorEnv?: FactorEnv
} & FactorPluginSettings

type BaseCompiled = {
  routes: string
  [key: string]: any
}

export type FactorRouterHookDictionary = {
  beforeEach: {
    args: [
      {
        to: vueRouter.RouteLocationNormalized
        from: vueRouter.RouteLocationNormalized
        navigate: NavigateRoute
      },
    ]
  }
  afterEach: {
    args: [
      {
        to: vueRouter.RouteLocationNormalized
        from: vueRouter.RouteLocationNormalized
      },
    ]
  }
}

export class FactorRouter<
  S extends BaseCompiled = BaseCompiled,
> extends FactorPlugin<FactorRouterSettings> {
  readonly routes: vue.Ref<AppRoute<string>[]>
  router: vueRouter.Router
  hooks = this.settings.hooks || []
  replacers: RouteReplacer[]
  factorEnv = this.settings.factorEnv
  loadingRoute = this.utils.vue.ref(true)
  constructor(settings: FactorRouterSettings) {
    super("router", settings)
    this.replacers = settings.replacers || []
    this.routes = vue.shallowRef(settings.routes || []) as vue.Ref<
      AppRoute<string>[]
    >
    this.router = this.createFactorRouter()
  }

  addHook(hook: HookType<FactorRouterHookDictionary>): void {
    this.hooks.push(hook)
  }

  addReplacers(replacers: RouteReplacer[]) {
    this.replacers = [...this.replacers, ...replacers]
  }

  public vueRoutes = vue.computed<vueRouter.RouteRecordRaw[]>(() => {
    return this.convertAppRoutesToRoutes(this.routes.value)
  })

  private createFactorRouter = (): vueRouter.Router => {
    const history = this.utils.isNode()
      ? vueRouter.createMemoryHistory()
      : vueRouter.createWebHistory()

    const router = vueRouter.createRouter({
      history,
      routes: this.vueRoutes.value,
      scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
          return savedPosition
        } else if (to != from) {
          return { top: 0 }
        }
      },
    })

    router.beforeEach(async (to, from) => {
      this.log.debug(`beforeEach [${String(to.name)}]`, to)
      this.loadingRoute.value = true
      const result = await this.utils.runHooks<
        FactorRouterHookDictionary,
        "beforeEach"
      >({
        list: this.hooks,
        hook: "beforeEach",
        args: [{ to, from, navigate: true }],
      })

      const ar = this.routes.value.find((r) => r.name == to.name)

      let navigate: NavigateRoute = result.navigate || true
      if (ar && ar.before) {
        navigate = await ar.before(to, from, navigate)
      }

      return navigate
    })

    router.afterEach(async (to, from) => {
      this.log.debug(`afterEach [${String(to.name)}]`, to)
      this.loadingRoute.value = false
      await this.utils.runHooks<FactorRouterHookDictionary>({
        list: this.hooks,
        hook: "afterEach",
        args: [{ to, from }],
      })

      const ar = this.routes.value.find((r) => r.name == to.name)

      if (ar && ar.after) {
        await ar.after(to, from)
      }
    })

    return router
  }

  /**
   * Adds multiple routes to the router
   */
  private updateVueRouter = (): vueRouter.Router => {
    this.vueRoutes.value.forEach((r) => {
      this.router.addRoute(r)
    })

    return this.router
  }

  private convertAppRouteToRoute = (
    list: AppRoute<string>[],
  ): vueRouter.RouteRecordRaw[] => {
    return list
      .map((li) => {
        if (li.external) {
          return
        } else if (!li.component) {
          throw new Error(`component missing in internal route: ${li.name}`)
        }

        const out: vueRouter.RouteRecordRaw = {
          path: li.path,
          name: li.name,
          component: li.component,
          meta: {
            niceName: li.niceName,
            menus: li.menus,
            auth: li.auth,
            ...li.meta,
          },
          children: [],
        }

        const props: Record<string, any> = {}

        if (li.services && out.props) {
          props.services = li.services
        }

        if (Object.keys(props).length > 0) {
          out.props = props
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
    const list = this.utils.sortPriority(routeList || [])

    const mapped: Record<string, AppRoute<string>> = {}

    list.forEach((r) => {
      if (r.parent) {
        // sometimes with added routes, the parent hasn't been added yet
        // it will be updated later
        if (mapped[r.parent]) {
          const children = mapped[r.parent]?.children ?? []
          mapped[r.parent].children = [...children, r]
        }
      } else {
        mapped[r.name] = r
      }
    })

    return this.convertAppRouteToRoute(Object.values(mapped))
  }

  public update = (routeList: AppRoute<string>[] = []): vueRouter.Router => {
    const r = routeList || []

    this.routes.value = [...this.routes.value, ...r]

    return this.updateVueRouter()
  }

  /**
   * Does the current route require authentication?
   */
  routeRequiresAuth = (): boolean => {
    const route = this.router.currentRoute.value

    return route
      ? route.matched.some((_) => _.meta.auth || _.meta.authRedirect)
      : false
  }

  public rawPath(name: S["routes"], replace?: Record<string, string>): string {
    const val = this.routes.value.find((r) => name == r.name)

    let out = val?.path

    if (!out) {
      this.log.warn(`route for ${String(name)} is missing`)
      out = "/"
    }

    if (replace) {
      Object.entries(replace).forEach(([key, val]) => {
        out = out?.replace(key, val)
      })
    }

    return out
  }

  private routeRef(
    name: S["routes"],
    replacers: RouteReplacer[] = [],
  ): vue.ComputedRef<string> {
    return vue.computed<string>(() => {
      let r = this.rawPath(name)

      const rep = [...replacers, ...this.replacers]
      rep.forEach(({ key, val }) => {
        const v = vue.isRef(val) ? val.value : val

        r = r.replace(`:${key}`, v ?? "--")
      })

      return r
    })
  }

  current = this.utils.vue.computed<
    RouteLocationNormalizedLoaded & {
      meta: { niceName?: (args: { factorRouter: FactorRouter }) => string }
    }
  >(() => {
    return this.router?.currentRoute.value
  })

  query = this.utils.vue.computed(() => {
    return this.current.value.query
  })

  params = this.utils.vue.computed(() => {
    return this.current.value.params
  })

  meta = this.utils.vue.computed(() => {
    return this.current.value.meta
  })

  vars = this.utils.vue.computed(() => {
    return { ...this.params.value, ...this.query.value }
  })

  public link(
    key: S["routes"],
    replace: Record<
      string,
      string | undefined | vue.Ref<string | undefined>
    > = {},
    query?: Record<string, any> | undefined,
  ): vue.Ref<string> {
    return vue.computed(() => {
      const searchParams = query ? `?${new URLSearchParams(query)}` : ""
      const replacers = Object.entries(replace).map(([key, val]) => {
        return { key, val }
      })
      const route = this.routeRef(key, replacers).value

      return `${route}${searchParams}`
    })
  }

  public async push(
    location: vueRouter.RouteLocationRaw,
    options?: { id?: string },
  ) {
    const { id = "unknown" } = options || {}
    this.log.info(`pushing route [${id}]`, location)
    await this.router.push(location)
  }

  public async setQueryVar(
    queryVar: string,
    value: string | number | undefined,
  ) {
    const query = this.query.value
    const current = query[queryVar]

    if (current != value) {
      const newQuery = { ...query, [queryVar]: value ?? null }

      await this.replace({ query: newQuery } as vueRouter.RouteLocationRaw)
    }
  }

  public async replace(
    location: vueRouter.RouteLocationRaw,
    options?: { id?: string },
  ) {
    const { id = "unknown" } = options || {}

    if (!this.factorEnv?.isRendering) {
      this.log.info(`replacing route [${id}]`, location)
    }

    await this.router.replace(location)
  }

  public async goto(
    key: S["routes"],
    replace: Record<
      string,
      string | undefined | vue.Ref<string | undefined>
    > = {},
    query?: Record<string, any> | undefined,
  ): Promise<void> {
    const path = this.link(key, replace, query).value
    await this.push(path, { id: `goto:${key}` })
  }

  /**
   * @deprecated
   * replace by link
   */
  public to(
    key: S["routes"],
    replace: Record<string, string | undefined> = {},
    query?: Record<string, any> | undefined,
  ): string {
    return this.link(key, replace, query).value
  }

  private activeRef(name: S["routes"]): vue.ComputedRef<boolean> {
    const val = this.routes.value.find((r) => name == r.name)
    const isActive = val?.isActive

    return vue.computed(() => {
      const route = this.router?.currentRoute.value

      const active = isActive ? isActive({ route }) : route?.name == val?.name
      return active || false
    })
  }

  public getRouteMenuItem(
    name: S["routes"],
    options: { useNiceName?: boolean; item?: MenuItem; priority?: number } = {},
  ): MenuItem {
    const { item = {} } = options
    const val = this.routes.value.find((r) => name == r.name)

    const route = this.router?.currentRoute.value

    if (!val) throw new Error(`AppRoute ${String(name)} missing`)
    if (!route) throw new Error("no current route")

    const itemName = val.niceName({ factorRouter: this })
    return {
      key: val.name,
      name: itemName,
      icon: val.icon,
      active: this.activeRef(name as S["routes"]),
      route: this.routeRef(name),
      ...item,
    }
  }
}
