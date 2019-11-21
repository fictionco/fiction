/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from "@vue/test-utils"
//import { renderToString } from "@vue/server-test-utils"
import factorSite from "../../site.vue"
import VueRouter from "vue-router"
import Vue from "vue"
import { createRenderer } from "vue-server-renderer"
let localVue
let router
let renderer
describe("dashboard", () => {
  beforeAll(() => {
    renderer = createRenderer()
  })

  it("renders", async () => {
    localVue = createLocalVue()
    localVue.use(VueRouter)
    router = new VueRouter({
      routes: [
        { path: "/", meta: { ui: "app" } },
        { path: "/alt", meta: { ui: "dashboard" } }
      ]
    })
    router.push("/")

    // Needs router as it assumes $route is there
    const vm = new Vue({ router, render: h => h(factorSite) })

    const html = await renderer.renderToString(vm)

    expect(html).toContain(`id="app"`)
  })

  it("adds ui class", () => {
    const wrapper = mount(factorSite, { localVue, router })

    expect(wrapper.vm["ui"]).toBe("factor-app")

    router.push({ path: "/alt" })

    expect(wrapper.vm["ui"]).toBe("factor-dashboard")
  })
})
