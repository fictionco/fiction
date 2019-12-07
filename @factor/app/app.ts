import "@factor/app"
import "@factor/meta"
import "@factor/tools" // prevent load order issues

import Vue, { CreateElement, VNode } from "vue"

import { createRouter } from "@factor/app/router"
import { emitEvent } from "@factor/tools/events"
import { getStore } from "@factor/app/store"
import { runCallbacks } from "@factor/tools/filters"
import { setting } from "@factor/tools/settings"
import { extendApp } from "./extend-app"
import { ApplicationComponents } from "./types"

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export const createApp = async (): Promise<ApplicationComponents> => {
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
  const factorSite = setting("app.components.site")

  const vm = new Vue({
    mounted(): void {
      // Fire a mounted event so plugins that need to wait for SSR to be fully loaded can then fire
      // The is the primary mechanism for initializing users since authenticated content isn't SSR'd
      setTimeout(() => emitEvent("app-mounted"), 0)
    },
    render: (h: CreateElement): VNode => h(factorSite),
    router,
    store
  })

  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { vm, router, store, context: {} }
}
