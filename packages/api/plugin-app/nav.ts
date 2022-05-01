import { computed, ComputedRef, Ref, ref } from "vue"
import { MenuItem } from "@factor/api/types"
import { RouteRecordNormalized, Router } from "vue-router"
import { log } from "../plugin-log"
import { AppRoute } from "../utils"
import { BaseCompiledConfig, RouteReplacer } from "./types"
type NavSettings = {
  replacers?: RouteReplacer[]
  router: Router
}

export class Nav<C extends BaseCompiledConfig = BaseCompiledConfig> {
  routes: Ref<RouteRecordNormalized[]>
  replacers: RouteReplacer[]
  log = log.contextLogger(this.constructor.name)
  router: Router
  constructor(settings: NavSettings) {
    this.router = settings.router
    this.routes = ref(this.router.getRoutes())
    this.replacers = settings.replacers || []
  }

  initialize(params: { router: Router }) {
    const { router } = params
    this.router = router
    this.routes.value = router.getRoutes()
  }

  public rawPath(name: C["routes"], replace?: Record<string, string>): string {
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
    name: C["routes"],
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

  public current(): RouteRecordNormalized | undefined {
    const route = this.router?.currentRoute.value
    return this.routes.value.find((r) => route?.name == r.name)
  }

  public to(
    key: C["routes"],
    replace: Record<string, any> = {},
    query?: Record<string, any> | undefined,
  ): string {
    const searchParams = query ? `?${new URLSearchParams(query)}` : ""
    const route = this.routeRef(key, replace).value

    return `${route}${searchParams}`
  }

  public menuItem(name: C["routes"]): MenuItem {
    const val = this.routes.value.find((r) => name == r.name)

    const route = this.router?.currentRoute.value

    if (!val) throw new Error(`AppRoute ${String(name)} missing`)
    if (!route) throw new Error("no routes")

    const isActive = val.meta.isActive as AppRoute<string>["isActive"]
    const active = isActive ? isActive({ route }) : route?.name == val.name

    return {
      key: val.name as string,
      name: val.meta.niceName as string,
      icon: val.meta.icon as string,
      active,
      route: this.routeRef(name).value,
    }
  }

  public menu(location: C["menus"]): MenuItem[] {
    const items: MenuItem[] = []

    this.routes.value.forEach((li) => {
      const menus = (li.meta.menus || []) as string[]

      if (menus.includes(location)) {
        items.push(this.menuItem(li.name as C["menus"]))
      }
    })
    return items
  }
}
