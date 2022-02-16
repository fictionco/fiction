import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouteRecordRedirectOption,
  Router,
  RouteRecordRaw,
  RouteLocationNormalizedLoaded,
} from "vue-router"
import type { RouteLocation } from "vue-router"
import type { Component } from "vue"
import { AuthCallback, MenuItem } from "@factor/types"
import { getGlobal, setGlobal } from "./global"
import { isNode, sortPriority, toLabel } from "./utils"

type IsActiveCallback = (c: {
  route: RouteLocation
  menuItem?: MenuItem
}) => boolean | undefined

export type AppRouteParams<T extends string> = {
  key: T
  name?: string
  path: string
  icon?: string

  isActive?: IsActiveCallback
  parent?: string
  priority?: number
  meta?: {
    auth: AuthCallback
    [key: string]: unknown
  }
} & (
  | { external: true; component?: undefined }
  | { component: (() => Promise<Component>) | Component; external?: undefined }
)
export class AppRoute<T extends string> {
  key: T
  name: string
  path: string
  icon?: string
  component?: (() => Promise<Component>) | Component
  isActive?: IsActiveCallback
  meta?: Record<string, unknown>
  parent?: string
  priority: number
  children: AppRoute<T>[] = []
  external?: boolean
  redirect?: RouteRecordRedirectOption
  constructor(params: AppRouteParams<T>) {
    const {
      key,
      name,
      path,
      icon,
      component,
      isActive,
      meta,
      parent,
      priority,
      external,
    } = params
    this.key = key
    this.name = name || toLabel(key)
    this.path = path
    this.icon = icon
    this.component = component
    this.isActive = isActive
    this.meta = meta
    this.parent = parent
    this.external = external
    this.priority = priority ? priority : parent ? 200 : 100
  }
}

/**
 * Creates a vue router
 */
export const createFactorRouter = (): Router => {
  const history = !isNode ? createWebHistory() : createMemoryHistory()

  const router = createRouter({
    history,
    routes: [],
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else if (to != from) {
        return { top: 0 }
      }
    },
  })

  /**
   * Add query hook functionality
   * uses _action param to call a hook from query
   */
  router.afterEach(async () => {})

  return router
}

/**
 * Gets the primary router and creates it if it doesn't exist
 */
export const getRouter = (): Router => {
  let router: Router | undefined = getGlobal("router")
  if (!router) {
    router = createFactorRouter()
    setGlobal("router", router)
  }
  return router
}

/**
 * Adds multiple routes to the router
 */
export const addRoutes = (routes: RouteRecordRaw[]): void => {
  const router = getRouter()
  routes.forEach((r) => {
    router.addRoute(r)
  })
}

const convertAppRouteToRoute = (list: AppRoute<string>[]): RouteRecordRaw[] => {
  return list
    .map((li) => {
      if (li.external) {
        return
      } else if (!li.component) {
        throw new Error(`component missing in internal route: ${li.name}`)
      }

      const out: RouteRecordRaw = {
        path: li.path,
        name: li.name,
        component: li.component,
      }

      if (li.children.length > 0) {
        out.children = convertAppRouteToRoute(li.children) // recursive
      }

      if (li.meta) out.meta = li.meta

      return out
    })
    .filter((_) => _) as RouteRecordRaw[]
}

export const generateRoutes = (
  routeList: AppRoute<string>[],
): RouteRecordRaw[] => {
  const list = sortPriority(routeList)

  const mapped: Record<string, AppRoute<string>> = {}

  list.forEach((r) => {
    if (r.parent) {
      const children = mapped[r.parent].children
      mapped[r.parent].children = [...children, r]
    } else {
      mapped[r.key] = r
    }
  })

  return convertAppRouteToRoute(Object.values(mapped))
}

export const setupRouter = (routeList: AppRoute<string>[]): void => {
  const vueRouteList = generateRoutes(routeList)

  addRoutes(vueRouteList)
}

/**
 * @deprecated Get the current route being viewed
 */
export const currentRoute = (): RouteLocationNormalizedLoaded => {
  return getRouter().currentRoute.value
}

/**
 * Does the current route require authentication?
 */
export const routeRequiresAuth = (): boolean => {
  const route = getRouter().currentRoute.value

  return route
    ? route.matched.some((_) => _.meta.auth || _.meta.authRedirect)
    : false
}
