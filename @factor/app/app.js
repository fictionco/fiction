import Factor from "vue"

// SSR
//import metatagsMixin from "../lib/plugin-ssr-metatags"

// mixin for handling metatags
// Must be OUTSIDE of create APP or gets added on every page load
//Factor.mixin(metatagsMixin)

import init from "./init"

// App Entry Component
import site from "./site"

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export function createApp({ target }) {
  //const site = () => import("@theme/site")
  const appComponents = init({ target })
  const { router, store } = appComponents

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Factor({
    router,
    store,
    render: h => h(site),
    mounted() {
      // Fire a mounted event so plugins that need to wait for SSR to be fully loaded can then fire
      // The is the primary mechanism for initializing users since authenticated content isn't SSR'd
      setTimeout(() => {
        Factor.$events.$emit("app-mounted", appComponents)
      }, 0)
    }
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, ...appComponents }
}
