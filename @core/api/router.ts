import { FullUser, AuthCallback } from "@factor/types"
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  RouteLocationNormalizedLoaded,
  Router,
  RouteRecordRaw,
} from "vue-router"

import { applyFilters, runCallbacks } from "./hook"
import { dLog } from "./logger"
import { isNode, isSearchBot, getAppGlobal, setAppGlobal } from "./utils"

/**
 * Add the hooks on changes
 */
const routerHooks = (router: Router): void => {
  router.afterEach((to) => {
    /**
     * Add query hook functionality
     * uses _action param to call a hook from query
     */
    const queryHook = to.query._action
    if (queryHook) {
      runCallbacks(`routeQueryAction`, to)
    }
  })
}
/**
 * Creates a vue router
 */
export const createFactorRouter = (): Router => {
  const history = !isNode ? createWebHistory() : createMemoryHistory()

  const routes = applyFilters("routes", [])

  const router = createRouter({
    history,
    routes,
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else if (to != from) {
        return { top: 0 }
      }
    },
  })

  routerHooks(router)

  return router
}
/**
 * Gets the primary router and creates it if it doesn't exist
 */
export const getRouter = (): Router => {
  let router: Router | undefined = getAppGlobal("router")
  if (!router) {
    router = createFactorRouter()
    setAppGlobal("router", router)
  }
  return router
}
/**
 * Adds a route to the router
 */
export const addRoute = (route: RouteRecordRaw): void => {
  const router = getRouter()
  router.addRoute(route)
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
/**
 * Get the current route being viewed
 */
export const currentRoute = (): RouteLocationNormalizedLoaded => {
  return getRouter().currentRoute.value
}
/**
 * Does the current route require authentication?
 */
export const routeRequiresAuth = (): boolean => {
  const route = currentRoute()

  return route
    ? route.matched.some((_) => _.meta.auth || _.meta.authRedirect)
    : false
}

interface RouteAuthConfig {
  required?: boolean
  redirect?: string
  allowBots?: boolean
}

export const loginRoute = (): string => {
  return applyFilters("loginRoute", "/login")
}

export const routeAuthRedirects = async (
  user: FullUser | undefined,
): Promise<void> => {
  const router = getRouter()
  await router.isReady()
  const { matched } = router.currentRoute.value

  let authConfig: RouteAuthConfig = { redirect: "/" }
  matched.forEach(({ meta: { auth } }) => {
    if (auth) {
      authConfig = { ...authConfig, ...(auth as RouteAuthConfig) }
    }
  })

  for (const matchedRoute of matched) {
    const auth = matchedRoute.meta.auth as AuthCallback
    if (auth) {
      const redirect = await auth({ user, searchBot: isSearchBot() })

      if (redirect) {
        dLog("event", "auth required redirect", { redirect })
        await router.push({ path: redirect })
      }
    }
  }
}
