import { applyFilters, runCallbacks, addCallback } from "@factor/tools/filters"
import { emitEvent } from "@factor/tools"
import Factor from "@factor/core"
import VueRouter from "vue-router"
import qs from "qs"

Factor.use(VueRouter)

let __initialPageLoad
let __router

addCallback("before-server-plugins", () => createRouter())

export async function createRouter() {
  __initialPageLoad = true

  const routes = applyFilters("routes", []).filter(_ => _) // remove undefined

  __router = new VueRouter({
    routes,
    mode: "history",
    scrollBehavior: (to, from, saved) => {
      return to.hash ? { selector: to.hash } : (saved ? saved : { x: 0, y: 0 })
    },
    parseQuery: query => qs.parse(query),
    stringifyQuery: query => (qs.stringify(query) ? `?${qs.stringify(query)}` : "")
  })

  Factor.$router = __router

  await runCallbacks("after-create-router", __router)

  // Load hooks for client navigation handling
  // Don't run on server as this causes the hooks to run twice
  if (process.env.FACTOR_SSR == "client") {
    __router.beforeEach((to, from, next) => hookClientRouterBefore(to, from, next))
    __router.afterEach((to, from) => hookClientRouterAfter(to, from))
  }

  return __router
}

// If called before 'createRouter' then add to callback
export function addRoutes(routeConfig) {
  if (__router) {
    __router.addRoutes(routeConfig)
  } else {
    addCallback("after-create-router", () => {
      __router.addRoutes(routeConfig)
    })
  }
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
