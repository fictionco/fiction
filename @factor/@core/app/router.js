import Factor from "@factor/core"
import FactorRouter from "vue-router"
import { parse, stringify } from "qs"
Factor.use(FactorRouter)

export default () => {
  return new (class {
    constructor() {
      this.initialPageLoad = true
    }

    // Scroll: https://router.vuejs.org/guide/advanced/scroll-behavior.html#async-scrolling
    // Query: set custom query resolver that allows for objects in GET requests
    create() {
      const routes = Factor.$filters.apply("routes", []).filter(_ => _) // remove undefined

      const router = new FactorRouter({
        routes,
        mode: "history",
        scrollBehavior: (to, from, saved) => {
          return to.hash ? { selector: to.hash } : (saved ? saved : { x: 0, y: 0 })
        },
        parseQuery: query => parse(query),
        stringifyQuery: query => (stringify(query) ? `?${stringify(query)}` : "")
      })

      Factor.$router = router

      // Load hooks for client navigation handling
      // Don't run on server as this causes the hooks to run twice
      if (process.env.FACTOR_SSR == "client") {
        router.beforeEach((to, from, next) => this.clientRouterBefore(to, from, next))
        router.afterEach((to, from) => this.clientRouterAfter(to, from))
      }
      return router
    }

    // Only run this before navigations on the client, it should NOT run on initial page load
    async clientRouterBefore(to, from, next) {
      if (this.initialPageLoad) next()
      else {
        const doBefore = Factor.$filters.run("client-route-before", { to, from, next })
        Factor.$events.$emit("ssr-progress", "start")
        const results = await doBefore

        // If a user needs to sign in (with modal) or be redirected after an action
        // Those hooks may not want the navigation to continue
        // As they will be handling with navigation with a redirect instead
        if (results.length == 0 || !results.some(_ => _ === false)) next()
        else next(false)
      }
    }

    clientRouterAfter(to, from) {
      this.initialPageLoad = false
      Factor.$events.$emit("ssr-progress", "finish")
      Factor.$filters.apply("client-route-after", [], { to, from })

      const { query } = to

      if (query._action) {
        Factor.$filters.run(`route-query-action-${query._action}`, query)
      }
    }
  })()
}
