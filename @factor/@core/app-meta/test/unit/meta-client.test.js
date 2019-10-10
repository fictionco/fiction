/**
 * @jest-environment jsdom
 */

import Factor from "vue"
import extendApp from "@factor/extend"
import { createApp } from "@factor/app/app"
import { mount, shallowMount, createLocalVue } from "@vue/test-utils"
import { render, renderToString } from "@vue/server-test-utils"

import { waitFor, indexHtml } from "@test/utils"
import { createStore } from "@factor/app-store"
import FactorRouter from "@factor/app-router"

let App
let localVue
let router
describe("site component", () => {
  beforeAll(() => {
    extendApp(Factor)
    Factor.$setting.addFactory({
      key: "app",
      factory: require("@factor/app/factor-settings.js").default
    })
    //document.body.innerHTML = `<div id="app"></div>`
    document.open()
    document.write(indexHtml())
    document.close()
  })

  it("loads title correctly", async () => {
    const meta = await import("./meta.vue")

    Factor.$filters.push("routes", {
      path: "/meta",
      component: meta.default
    })

    const store = createStore()
    const router = FactorRouter(Factor).create()

    const site = await Factor.$setting.get("app.site")()

    console.log(site)
    const app = new Factor({
      router,
      store,
      render: h => h(site.default)
    })

    const App = app.$mount("#app")

    await new Promise(resolve => router.onReady(() => resolve()))

    const r = await router.push("/meta")

    waitFor(1000)

    console.log("document.title", r, document.title.length, document.body.innerHTML)

    debugger

    // expect(Factor.$store).toBeTruthy()
  })
})
