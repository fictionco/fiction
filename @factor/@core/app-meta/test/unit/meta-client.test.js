/**
 * @jest-environment jsdom
 */

import Factor from "vue"
Factor.config.devtools = false
import extendApp from "@factor/extend"
// import { createApp } from "@factor/app/app"
// import { mount, shallowMount, createLocalVue } from "@vue/test-utils"
// import { render, renderToString } from "@vue/server-test-utils"

import { waitFor, indexHtml } from "@test/utils"
import { createStore } from "@factor/app-store"
import FactorRouter from "@factor/app-router"

describe("site component", () => {
  beforeAll(() => {
    document.open()
    document.write(indexHtml())
    document.close()

    extendApp(Factor, {
      plugins: {
        factorMeta: require("../..").default
      },
      settings: {
        app: require("@factor/app/factor-settings.js").default
      }
    })
    Factor.config.devtools = false
  })

  it("loads title correctly", async () => {
    Factor.$filters.push("routes", {
      path: "/meta",
      component: () => import("./meta.vue")
    })

    const store = createStore()
    const router = FactorRouter(Factor).create()

    const site = await Factor.$setting.get("app.site")()

    const app = new Factor({
      router,
      store,
      render: h => h(site.default)
    })

    app.$mount("#app")

    //await new Promise(resolve => router.onReady(() => resolve()))

    await router.push("/meta")

    // Is triggered by lifecycle hook
    await waitFor(100)

    expect(document.title).toContain(`meta title template`)
  })
})
