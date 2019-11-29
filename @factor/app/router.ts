import {
  applyFilters,
  runCallbacks,
  pushToFilter,
  addFilter
} from "@factor/tools/filters"
import { emitEvent } from "@factor/tools/events"
import Vue from "vue"
import VueRouter, { RouteConfig, Route, RouterOptions } from "vue-router"
import qs from "qs"

Vue.use(VueRouter)

let __initialPageLoad = true

export function createRouter(): VueRouter {
  const routes = applyFilters("routes", []).filter((_) => _)

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
    parseQuery: (query) => qs.parse(query),
    stringifyQuery: (query) => (qs.stringify(query) ? `?${qs.stringify(query)}` : "")
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

export function getRouter(): VueRouter {
  return Vue.$router
}

export function addContentRoute(routeItem: RouteConfig): void {
  pushToFilter("content-routes", routeItem)
}

export function addContentRoutes(routeItems: RouteConfig[]): void {
  addFilter("content-routes", (routes: RouteConfig[]) => routes.concat(routeItems))
}

export function currentRoute(): Route {
  return getRouter().currentRoute
}

export function navigateToRoute(r: Route): Promise<Route> {
  return getRouter().push(r)
}

// Only run this before navigation on the client, it should NOT run on initial page load
async function hookClientRouterBefore(
  to: Route,
  from: Route,
  next: Function
): Promise<void> {
  if (__initialPageLoad) next()
  else {
    const doBefore = runCallbacks("client-route-before", { to, from, next })
    emitEvent("ssr-progress", "start")
    const results = await doBefore

    // If a user needs to sign in (with modal) or be redirected after an action
    // Those hooks may not want the navigation to continue
    // As they will be handling with navigation with a redirect instead

    if (results.length == 0 || !results.some((_) => _ === false)) next()
    else next(false)
  }
}

function hookClientRouterAfter(to: Route, from: Route): void {
  __initialPageLoad = false
  emitEvent("ssr-progress", "finish")
  applyFilters("client-route-after", [], { to, from })

  const { query } = to

  if (query._action) {
    runCallbacks(`route-query-action-${query._action}`, query)
  }
}
