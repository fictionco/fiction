import Factor from "@factor/core"

import { extendApp } from "./extend-app"
import { createStore } from "@factor/app/store"
import { createRouter } from "@factor/app/router"
import { emitEvent, runCallbacks, setting } from "@factor/tools"
Factor.FACTOR_APP_CONFIG = process.env.FACTOR_APP_CONFIG
Factor.FACTOR_SSR = process.env.FACTOR_SSR
process.env.FACTOR_TARGET = "app"

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export async function createApp(options = {}) {
  const { extend = true } = options

  if (extend) await extendApp()

  const store = createStore()
  const router = createRouter()

  // Extend with mixins, etc... happens after router and store
  runCallbacks("before-app")

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  // App Entry Component
  const site = setting("app.site")

  const app = new Factor({
    router,
    store,
    render: h => h(site),
    mounted() {
      // Fire a mounted event so plugins that need to wait for SSR to be fully loaded can then fire
      // The is the primary mechanism for initializing users since authenticated content isn't SSR'd
      setTimeout(() => {
        emitEvent("app-mounted", { router, store })
      }, 0)
    }
  })

  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, vm: app, router, store }
}
