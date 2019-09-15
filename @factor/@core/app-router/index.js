import Factor from "vue"
import FactorRouter from "vue-router"
import qs from "qs"
Factor.use(FactorRouter)

export default Factor => {
  return new (class {
    constructor() {
      this.initialPageLoad = true
    }
    create() {
      const routes = Factor.$filters.apply("routes", []).filter(_ => _) // remove undefined

      const router = new FactorRouter({
        routes,
        mode: "history", // abstract
        scrollBehavior(to, from, savedPosition) {
          if (to.hash) {
            return {
              selector: to.hash
            }
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

      // Register routes needed for generation functionality e.g. sitemap
      router.registerRoute = r => {
        if (!router._registeredRoutes) {
          router._registeredRoutes = []
        }

        router._registeredRoutes.push(r)
      }

      router.getRegisteredRoutes = () => {
        return router._registeredRoutes
      }

      Factor.$router = router

      if (Factor.FACTOR_SSR == "client") {
        router.beforeEach((to, from, next) => this.clientRouterBefore(to, from, next))
        router.afterEach((to, from) => this.clientRouterAfter(to, from))
      }

      return router
    }

    async clientRouterBefore(to, from, next) {
      if (!this.initialPageLoad) {
        const doBefore = Factor.$filters.run("client-route-before", { to, from, next })
        Factor.$events.$emit("ssr-progress", "start")
        const results = await doBefore

        // If a user needs to sign in (with modal) or be redirected after an action
        // Those hooks may not want the navigation to continue
        // As they will be handling with navigation with a redirect instead
        if (results.length == 0 || !results.some(_ => _ === false)) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
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
