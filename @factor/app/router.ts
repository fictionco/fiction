import { applyFilters, runCallbacks, pushToFilter } from "@factor/tools/filters"
import { emitEvent } from "@factor/tools/events"
import Vue from "vue"
import VueRouter from "vue-router"
import qs from "qs"

Vue.use(VueRouter)

let __initialPageLoad = true

//addCallback("initialize-server", () => addAppRoutes())
// addCallback("initialize-app", () => createRouter(), { priority: 300 })

export function createRouter() {
  const routes = applyFilters("routes", []).filter(_ => _)

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
  })

  // Load hooks for client navigation handling
  // Don't run on server as this causes the hooks to run twice
  if (process.env.FACTOR_SSR == "client") {
    router.beforeEach((to, from, next) => hookClientRouterBefore(to, from, next))
    router.afterEach((to, from) => hookClientRouterAfter(to, from))
  }

  Vue.$router = router

  return router
}

export function getRouter() {
  return Vue.$router
}

export function addContentRoute(routeItem) {
  pushToFilter("content-routes", routeItem)
}

// If called before 'createRouter' then add to callback
export function addRoutes(routeConfig) {
  getRouter().addRoutes(routeConfig)
}

export function currentRoute() {
  return getRouter().currentRoute
}

export function navigateToRoute(r) {
  return getRouter().push(r)
}

// Only run this before navigation on the client, it should NOT run on initial page load
async function hookClientRouterBefore(to, from, next) {
  if (__initialPageLoad) next()
  else {
    const doBefore = runCallbacks("client-route-before", { to, from, next })
    emitEvent("ssr-progress", "start")
    const results = await doBefore

    // If a user needs to sign in (with modal) or be redirected after an action
    // Those hooks may not want the navigation to continue
    // As they will be handling with navigation with a redirect instead
    // @ts-ignore
    if (results.length == 0 || !results.some(_ => _ === false)) next()
    else next(false)
  }
}

function hookClientRouterAfter(to, from) {
  __initialPageLoad = false
  emitEvent("ssr-progress", "finish")
  applyFilters("client-route-after", [], { to, from })

  const { query } = to

  if (query._action) {
    runCallbacks(`route-query-action-${query._action}`, query)
  }
}
