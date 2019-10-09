import Factor from "vue"
import extendApp from "@factor/extend"
import { createApp } from "../../app"
import { waitFor } from "@test/utils"

describe("app", () => {
  beforeAll(() => {
    extendApp(Factor)
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("adds router", async () => {
    createApp({ extend: false })
    expect(Factor.$router).toBeTruthy()
  })
  it("adds store", async () => {
    createApp({ extend: false })
    expect(Factor.$store).toBeTruthy()
  })
  it("calls 'before-app' hook", async () => {
    const spy = jest.spyOn(Factor.$filters, "run")
    createApp({ extend: false })
    expect(spy).toHaveBeenCalledWith("before-app")
  })

  it("mounts app wrapper", async () => {
    const spy = jest.spyOn(Factor.$events, "$emit")
    const { app, router } = createApp({ extend: false })
    await router.onReady()
    const mounted = app.$mount("#app")
    expect(mounted._isMounted).toBeTruthy()
    await waitFor(10)
    expect(spy).toHaveBeenCalledWith("app-mounted", expect.anything())
    return
  })

  it("sets default settings", async () => {
    const settings = require("../../factor-settings.js").default(Factor)
    const standardSettings = {
      error404: "component",
      content: "component",
      site: "component",
      templatePath: "string",
      faviconPath: "string",
      icon: "string"
    }

    for (let [key, value] of Object.entries(standardSettings)) {
      if (value == "component") {
        const { default: component } = await settings.app[key]()

        expect(typeof component.render).toBe("function")
      } else {
        expect(typeof settings.app[key]).toBe(value)
      }
    }
  })
})
