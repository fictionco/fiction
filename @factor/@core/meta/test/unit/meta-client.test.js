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
import FactorStore from "@factor/app/store"
import FactorRouter from "@factor/app/router"
import appSettings from "@factor/app/factor-settings"
import factorMeta from "../.."

describe("meta info client", () => {
  beforeAll(async () => {
    document.open()
    document.write(indexHtml())
    document.close()

    await extendApp({
      plugins: { factorMeta },
      settings: { app: appSettings }
    }).extend()
    Factor.config.devtools = false
  })

  it("loads title correctly", async () => {
    Factor.$filters.push("routes", {
      path: "/meta",
      component: () => import("./meta.vue")
    })

    const store = FactorStore(Factor).create()
    const router = FactorRouter(Factor).create()

    const { default: site } = await Factor.$setting.get("app.site")()

    const app = new Factor({
      router,
      store,
      render: h => h(site)
    })

    app.$mount("#app")

    //await new Promise(resolve => router.onReady(() => resolve()))

    await router.push("/meta")

    // Is triggered by lifecycle hook
    await waitFor(100)

    expect(document.title).toContain(`meta title template`)
  })
})
