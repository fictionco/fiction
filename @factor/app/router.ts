import { applyFilters, runCallbacks, pushToFilter, addFilter } from "@factor/api/hooks"
import { emitEvent } from "@factor/api/events"
import Vue from "vue"
import VueRouter, { RouteConfig, Route, RouterOptions, Location } from "vue-router"
import qs from "qs"

Vue.use(VueRouter)

let __initialPageLoad = true

// Only run this before navigation on the client, it should NOT run on initial page load
const hookClientRouterBefore = async (
  to: Route,
  from: Route,
  next: Function
): Promise<void> => {
  if (__initialPageLoad) next()
  else {
    const doBefore = runCallbacks("client-route-before", { to, from, next })
    emitEvent("ssr-progress", "start")
    const results = await doBefore

    // If a user needs to sign in (with modal) or be redirected after an action
    // Those hooks may not want the navigation to continue
    // As they will be handling with navigation with a redirect instead

    if (results.length == 0 || !results.some(_ => _ === false)) next()
    else next(false)
  }
}

const hookClientRouterAfter = (to: Route, from: Route): void => {
  __initialPageLoad = false
  emitEvent("ssr-progress", "finish")
  applyFilters("client-route-after", [], { to, from })

  const { query } = to

  if (query._action) {
    runCallbacks(`route-query-action-${query._action}`, query)
  }
}

export const createRouter = (): VueRouter => {
  const routes: RouteConfig[] = applyFilters("routes", []).filter((_: RouteConfig) => _)

  const router = new VueRouter({
    mode: "history",
    routes,
    scrollBehavior: (to, from, saved) => {
      const position = { x: 0, y: 0 }

      if (to.hash) {
        return { ...position, selector: to.hash }
      } else if (saved) {
        return { ...position, ...saved }
      } else {
        return position
      }
    },
    parseQuery: query => qs.parse(query),
    stringifyQuery: query => (qs.stringify(query) ? `?${qs.stringify(query)}` : "")
  } as RouterOptions)

  // Load hooks for client navigation handling
  // Don't run on server as this causes the hooks to run twice
  if (process.env.FACTOR_SSR == "client") {
    router.beforeEach((to, from, next) => hookClientRouterBefore(to, from, next))
    router.afterEach((to, from) => hookClientRouterAfter(to, from))
  }

  Vue.$router = router

  return router
}

export const getRouter = (): VueRouter => {
  return Vue.$router
}

/**
 * Adds a route to the app.
 *
 * @param routeItem Standard Route Config
 * @param options Optional route options
 * @category app
 */
export const addContentRoute = (routeItem: RouteConfig, options?: object): void => {
  pushToFilter({
    hook: "content-routes",
    key: routeItem.path,
    item: routeItem,
    ...options
  })
}

/**
 * Adds an array of routes to the router.
 *
 * @param _id A unique group identifier for the routes
 * @param routeItems Array of standard routes
 * @param options Optional route options
 * @category app
 */
export const addContentRoutes = ({
  key,
  routes
}: {
  key: string;
  routes: RouteConfig[] | (() => RouteConfig[]);
}): void => {
  addFilter({
    hook: "content-routes",
    key,
    callback: (allRoutes: RouteConfig[]): RouteConfig[] => {
      const r = typeof routes === "function" ? routes() : routes

      return allRoutes.concat(r)
    }
  })
}

export const currentRoute = (): Route => {
  return getRouter().currentRoute
}

export const navigateToRoute = (r: Location): Promise<Route> => {
  return getRouter().push(r)
}
