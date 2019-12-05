/**
 * @jest-environment jsdom
 */

declare module "@vue/test-utils" {}
import { createLocalVue, mount } from "@vue/test-utils"
import { Renderer, createRenderer } from "vue-server-renderer"
import Vue, { VueConstructor, VNode, CreateElement } from "vue"

//import { renderToString } from "@vue/server-test-utils"
import VueRouter from "vue-router"
import factorSite from "../../site.vue"

let localVue: VueConstructor
let router: VueRouter
let renderer: Renderer
describe("site-wrapper", () => {
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

    Vue.$router = router

    // Needs router as it assumes $route is there
    const vm = new Vue({ router, render: (h: CreateElement): VNode => h(factorSite) })

    const html = await renderer.renderToString(vm)

    expect(html).toContain(`id="app"`)

    const wrapper = mount(factorSite, { localVue, router })

    expect(wrapper.vm.ui).toBe("factor-app")

    router.push({ path: "/alt" })

    expect(wrapper.vm.ui).toBe("factor-dashboard")
  })

  it("adds ui class", () => {})
})
