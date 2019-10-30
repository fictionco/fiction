import Factor from "@factor/core"
import VueRouter from "vue-router"
import qs from "qs"
import { emitEvent, applyFilters, runCallbacks } from "@factor/tools"
Factor.use(VueRouter)

let initialPageLoad

addCallback("before-server-plugins", () => createRouter())

export function createRouter() {
  initialPageLoad = true

  const routes = applyFilters("routes", []).filter(_ => _) // remove undefined

  const router = new VueRouter({
    routes,
    mode: "history",
    scrollBehavior: (to, from, saved) => {
      return to.hash ? { selector: to.hash } : (saved ? saved : { x: 0, y: 0 })
    },
    parseQuery: query => qs.parse(query),
    stringifyQuery: query => (qs.stringify(query) ? `?${qs.stringify(query)}` : "")
  })

  Factor.$router = router

  // Load hooks for client navigation handling
  // Don't run on server as this causes the hooks to run twice
  if (process.env.FACTOR_SSR == "client") {
    router.beforeEach((to, from, next) => clientRouterBefore(to, from, next))
    router.afterEach((to, from) => clientRouterAfter(to, from))
  }
  return router
}

// Only run this before navigations on the client, it should NOT run on initial page load
async function clientRouterBefore(to, from, next) {
  if (initialPageLoad) next()
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

function clientRouterAfter(to, from) {
  initialPageLoad = false
  emitEvent("ssr-progress", "finish")
  applyFilters("client-route-after", [], { to, from })

  const { query } = to

  if (query._action) {
    runCallbacks(`route-query-action-${query._action}`, query)
  }
}
