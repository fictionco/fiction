import { FactorPlugin } from "../plugin"
import { randomBetween, vue, vueRouter } from "../utils"
import { MenuItem } from "../types/utils"
import { AppRoute } from "./appRoute"
import { RouteReplacer } from "./types"
export * from "./types"
export * from "./appRoute"

type FactorRouteSettings = {
  routes?: AppRoute<string>[]
  replacers?: RouteReplacer[]
}

export class FactorRouter<
  ROUTEKEY extends string = string,
  MENUKEY extends string = string,
> extends FactorPlugin<FactorRouteSettings> {
  readonly routes: vue.Ref<AppRoute<string>[]>
  router: vueRouter.Router
  key = randomBetween(1, 10_000)
  replacers: RouteReplacer[]
  constructor(settings: FactorRouteSettings = {}) {
    super(settings)
    this.replacers = settings.replacers || []
    this.routes = vue.shallowRef(settings.routes || []) as vue.Ref<
      AppRoute<string>[]
    >
    this.router = this.createFactorRouter()
  }
  setup() {}

  addReplacers(replacers: RouteReplacer[]) {
    this.replacers = [...this.replacers, ...replacers]
  }

  public vueRoutes = vue.computed<vueRouter.RouteRecordRaw[]>(() => {
    return this.convertAppRoutesToRoutes(this.routes.value)
  })

  private createFactorRouter = (): vueRouter.Router => {
    const history = !this.utils.isNode()
      ? vueRouter.createWebHistory()
      : vueRouter.createMemoryHistory()

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
          meta: { niceName: li.niceName, menus: li.menus, ...li.meta },
        }

        const props: Record<string, any> = {}

        if (li.services && out.props) {
          props.services = li.services
        }

        if (Object.keys(props).length > 0) {
          out.props = props
        }

        if (li.children.length > 0) {
          out.children = this.convertAppRouteToRoute(li.children) // recursive
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
    this.routes.value = [...this.routes.value, ...routeList]

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

  public rawPath(name: ROUTEKEY, replace?: Record<string, string>): string {
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
    name: ROUTEKEY,
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

  public current(): vueRouter.RouteRecordRaw | undefined {
    const route = this.router?.currentRoute.value
    return this.vueRoutes.value.find((r) => route?.name == r.name)
  }

  public link(
    key: ROUTEKEY,
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

  public async goto(
    key: ROUTEKEY,
    replace: Record<
      string,
      string | undefined | vue.Ref<string | undefined>
    > = {},
    query?: Record<string, any> | undefined,
  ): Promise<void> {
    const path = this.link(key, replace, query).value
    await this.router.push(path)
  }

  /**
   * @deprecated
   * replace by link
   */
  public to(
    key: ROUTEKEY,
    replace: Record<string, string | undefined> = {},
    query?: Record<string, any> | undefined,
  ): string {
    return this.link(key, replace, query).value
  }

  private activeRef(name: ROUTEKEY): vue.ComputedRef<boolean> {
    const val = this.routes.value.find((r) => name == r.name)
    const isActive = val?.isActive

    return vue.computed(() => {
      const route = this.router?.currentRoute.value
      const active = isActive ? isActive({ route }) : route?.name == val?.name
      return active || false
    })
  }

  public getRouteMenuItem(name: ROUTEKEY): MenuItem {
    const val = this.routes.value.find((r) => name == r.name)

    const route = this.router?.currentRoute.value

    if (!val) throw new Error(`AppRoute ${String(name)} missing`)
    if (!route) throw new Error("no current route")

    return {
      key: val.name,
      name: val.niceName,
      icon: val.icon,
      active: this.activeRef(name as ROUTEKEY),
      route: this.routeRef(name),
    }
  }

  menu(location: MENUKEY): MenuItem[] {
    const items: MenuItem[] = []

    this.routes.value.forEach((li) => {
      const menus = (li.menus || []) as string[]

      if (menus.includes(location)) {
        items.push(this.getRouteMenuItem(li.name as ROUTEKEY))
      }
    })
    return items
  }
}
