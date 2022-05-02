import { Ref, ComputedRef, shallowRef, computed } from "vue"
import * as vueRouter from "vue-router"
import { FactorPlugin } from "../plugin"
import { randomBetween } from "../utils"
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
  readonly routes: Ref<AppRoute<string>[]>
  router: vueRouter.Router
  key = randomBetween(1, 10_000)
  replacers: RouteReplacer[]
  constructor(settings: FactorRouteSettings = {}) {
    super(settings)
    this.replacers = settings.replacers || []
    this.routes = shallowRef(settings.routes || []) as Ref<AppRoute<ROUTEKEY>[]>
    this.router = this.createFactorRouter()
  }
  setup() {}

  public vueRoutes = computed<vueRouter.RouteRecordRaw[]>(() => {
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
          props: { services: li.services },
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
        const children = mapped[r.parent]?.children ?? []
        mapped[r.parent].children = [...children, r]
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
    replace: Record<string, any> = {},
  ): ComputedRef<string> {
    return computed<string>(() => {
      let r = this.rawPath(name)

      Object.entries(replace).forEach(([key, value]) => {
        if (typeof value == "string") {
          r = r.replace(`:${key}`, value)
        }
      })

      this.replacers.forEach(({ key, replace }) => {
        const active = replace().value
        r = r.replace(`:${key}`, active[key] ?? "---")
      })

      return r
    })
  }

  public current(): vueRouter.RouteRecordRaw | undefined {
    const route = this.router?.currentRoute.value
    return this.vueRoutes.value.find((r) => route?.name == r.name)
  }

  public to(
    key: ROUTEKEY,
    replace: Record<string, any> = {},
    query?: Record<string, any> | undefined,
  ): string {
    const searchParams = query ? `?${new URLSearchParams(query)}` : ""
    const route = this.routeRef(key, replace).value

    return `${route}${searchParams}`
  }

  public menuItem(name: ROUTEKEY): MenuItem {
    const val = this.routes.value.find((r) => name == r.name)

    const route = this.router?.currentRoute.value

    if (!val) throw new Error(`AppRoute ${String(name)} missing`)
    if (!route) throw new Error("no current route")

    const isActive = val.meta?.isActive as AppRoute<ROUTEKEY>["isActive"]
    const active = isActive ? isActive({ route }) : route?.name == val.name

    return {
      key: val.name as string,
      name: val.meta?.niceName as string,
      icon: val.meta?.icon as string,
      active,
      route: this.routeRef(name).value,
    }
  }

  public menu(location: MENUKEY): MenuItem[] {
    const items: MenuItem[] = []

    this.routes.value.forEach((li) => {
      const menus = (li.meta?.menus || []) as string[]

      if (menus.includes(location)) {
        items.push(this.menuItem(li.name as ROUTEKEY))
      }
    })
    return items
  }
}
