/**
 * @jest-environment jsdom
 */

import Factor from "vue"
import { mount, shallowMount, createLocalVue } from "@vue/test-utils"
import { render, renderToString } from "@vue/server-test-utils"
import extendApp from "@factor/extend"
import { waitFor } from "@test/utils"
import VueRouter from "vue-router"

let _app
let localVue
let router
describe("site component", () => {
  beforeAll(async () => {
    await extendApp().extend()
    localVue = createLocalVue()
    localVue.use(VueRouter)
    router = new VueRouter({
      routes: [
        { path: "/", meta: { ui: "app" } },
        { path: "/alt", meta: { ui: "dashboard" } }
      ]
    })
    router.push("/")
  })
  beforeEach(() => {})
  it("loads site", async () => {
    const { default: site } = await import("../../site.vue")

    // Server prefetch bug
    // https://github.com/vuejs/vue-test-utils/issues/1317
    site.mixins = site.mixins.map(_ => {
      if (_.serverPrefetch) delete _.serverPrefetch

      return _
    })

    const options = { localVue, router }
    const html = await renderToString(site, options)

    expect(html).toContain(`id="app"`)

    const wrapper = mount(site, options)

    expect(wrapper.vm.ui).toBe("factor-app")

    wrapper.vm.$router.push({ path: "/alt" })

    expect(wrapper.vm.ui).toBe("factor-dashboard")
  })
})
