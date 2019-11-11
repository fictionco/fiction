/**
 * @jest-environment jsdom
 */
import { mount, createLocalVue } from "@vue/test-utils"
import { renderToString } from "@vue/server-test-utils"
import Site from "../../site.vue"
import VueRouter from "vue-router"

let localVue
let router
describe("site-wrapper", () => {
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

    // Server prefetch bug
    // https://github.com/vuejs/vue-test-utils/issues/1317
    Site.mixins = Site.mixins.map(_ => {
      if (_.serverPrefetch) delete _.serverPrefetch

      return _
    })

    const html = await renderToString(Site, { localVue, router })

    expect(html).toContain(`id="app"`)
  })

  it("adds ui class", () => {
    const wrapper = mount(Site, { localVue, router })

    expect(wrapper.vm["ui"]).toBe("factor-app")

    router.push({ path: "/alt" })

    expect(wrapper.vm["ui"]).toBe("factor-dashboard")
  })
})
