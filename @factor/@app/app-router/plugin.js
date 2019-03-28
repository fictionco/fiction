import Factor from "vue"
import FactorRouter from "vue-router"
import qs from "qs"
Factor.use(FactorRouter)

export function createRouter({ target }) {
  const routes = Factor.$filters.get("routes", []).filter(_ => _) // remove undefined

  const router = new FactorRouter({
    routes,
    mode: "history", // abstract
    scrollBehavior(to, from, savedPosition) {
      if (to.path == from.path && to.hash != from.hash) {
        return false
      } else if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    // set custom query resolver that allows for objects in GET requests
    parseQuery(query) {
      return qs.parse(query)
    },
    stringifyQuery(query) {
      var result = qs.stringify(query)

      return result ? "?" + result : ""
    }
  })

  Factor.$router = router

  if (target == "client") {
    router.beforeEach(clientRouterBefore)
    router.afterEach(clientRouterAfter)
  }

  return router
}

// Client-only checks before user navigates to a new route (e.g. auth)
export async function clientRouterBefore(to, from, next) {
  // The promises need to return "true" if navigation is to continue as usual
  const results = await Promise.all(Factor.$filters.apply("client-route-before-promises", [], { to, from, next }))

  // If a user needs to sign in (with modal) or be redirected after an action
  // Those hooks may not want the navigation to continue
  // As they will be handling with navigation with a redirect instead
  if (results.length == 0 || !results.some(_ => _ === false)) {
    next()
  } else {
    next(false)
  }
}

// Client-only checks after a route is loaded
// This applies when a page is loaded directly, the client may need to
// check for specifics related to the user
export function clientRouterAfter(to, from) {
  Factor.$filters.apply("client-route-loaded", [], { to, from })
}
