import "@factor/tools" // prevent load order issues
import { emitEvent } from "@factor/tools/events"
import { createRouter } from "@factor/app/router"
import { getStore } from "@factor/app/store"
import { runCallbacks } from "@factor/tools/filters"
import { setting } from "@factor/tools/settings"
import Vue from "vue"

import { extendApp } from "./extend-app"

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export async function createApp() {
  process.env.FACTOR_TARGET = "app"

  await extendApp()

  const store = getStore()
  const router = createRouter()

  // Extend with mixin, etc... happens after router and store
  runCallbacks("before-app")

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  // App Entry Component
  const site = setting("app.site")

  const app = new Vue({
    router,
    store,
    mounted() {
      // Fire a mounted event so plugins that need to wait for SSR to be fully loaded can then fire
      // The is the primary mechanism for initializing users since authenticated content isn't SSR'd
      setTimeout(() => emitEvent("app-mounted"), 0)
    },
    render: h => h(site)
  })

  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, vm: app, router, store }
}
