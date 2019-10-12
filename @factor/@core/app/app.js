import Factor from "vue"

import extendApp from "@factor/extend"
import FactorStore from "@factor/app/store"
import FactorRouter from "@factor/app/router"

Factor.FACTOR_APP_CONFIG = process.env.FACTOR_APP_CONFIG
Factor.FACTOR_SSR = process.env.FACTOR_SSR
process.env.FACTOR_TARGET = "app"

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp(options = {}) {
  const { extend = true } = options

  if (extend) extendApp(Factor)

  const store = FactorStore(Factor).create()
  const router = FactorRouter(Factor).create()

  // Extend with mixins, etc... happens after router and store
  Factor.$filters.run("before-app")

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  // App Entry Component
  const site = Factor.$setting.get("app.site")

  const app = new Factor({
    router,
    store,
    render: h => h(site),
    mounted() {
      // Fire a mounted event so plugins that need to wait for SSR to be fully loaded can then fire
      // The is the primary mechanism for initializing users since authenticated content isn't SSR'd
      setTimeout(() => {
        Factor.$events.$emit("app-mounted", { router, store })
      }, 0)
    }
  })

  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, vm: app, router, store }
}
