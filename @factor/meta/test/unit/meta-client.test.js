/**
 * @jest-environment jsdom
 */

import Factor from "vue"
Factor.config.devtools = false
import { extendApp } from "@factor/extend"

import { pushToFilter, setting } from "@factor/tools"
import { waitFor, indexHtml } from "@test/utils"
import { createStore } from "@factor/app/store"
import { createRouter } from "@factor/app/router"
import appSettings from "@factor/app/core-settings"

describe("meta info client", () => {
  beforeAll(async () => {
    document.open()
    document.write(indexHtml())
    document.close()

    await extendApp({
      settings: { app: appSettings }
    })
    Factor.config.devtools = false
  })

  it("loads title correctly", async () => {
    pushToFilter("routes", {
      path: "/meta",
      component: () => import("./meta.vue")
    })

    const store = createStore()
    const router = createRouter()

    const { default: site } = await setting("app.site")()

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
