import "@factor/app"
import "@factor/meta"
import "@factor/api" // prevent load order issues

import Vue, { CreateElement, VNode, VueConstructor } from "vue"
import VueRouter from "vue-router"
import Vuex from "vuex"
import VueMeta from "vue-meta"
import { emitEvent } from "@factor/api/events"
import { createFactorRouter } from "@factor/app/router"
import { createFactorStore } from "@factor/app/store"
import { runCallbacks } from "@factor/api/hooks"
import { setting } from "@factor/api/settings"
import { extendApp } from "./extend-app"
import { ApplicationComponents } from "./types"

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueMeta, { keyName: "metaInfoCore" })

export const getPrimaryApp = (): VueConstructor => {
  return Vue
}

/**
 * Expose a factory function that creates a fresh set of store, router,
 * app instances on each call (which is called for each SSR request)
 */
export const createApp = async ({
  url = "/",
}: {
  url?: string
} = {}): Promise<ApplicationComponents> => {
  process.env.FACTOR_TARGET = "app"

  await extendApp()

  const store = createFactorStore()
  const router = createFactorRouter()

  /**
   * Extend with mixin, etc... happens after router and store
   */
  runCallbacks("before-app")

  /**
   * The global site component that wraps everything
   */

  const site = setting("app.components.site")

  const vm = new Vue({
    mounted(): void {
      /**
       * Fire a mounted event so plugins that need to wait for SSR to be fully loaded can then fire
       * The is the primary mechanism for initializing users since authenticated content isn't server rendered
       */
      setTimeout(() => emitEvent("app-mounted"), 0)
    },
    render: (h: CreateElement): VNode => h(site),
    router,
    store,
  })

  /**
   * @note
   * we are not mounting the app here, since bootstrapping will be
   * different depending on whether we are in a browser or on the server.
   */
  return { vm, router, store, context: { url } }
}
