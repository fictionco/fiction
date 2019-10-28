import Factor from "@factor/core"
import extendApp from "@factor/extend"
import { createApp } from "../../app"
import { waitFor } from "@test/utils"
import * as tools from "@factor/tools"

describe("app", () => {
  beforeAll(async () => {
    await extendApp().extend()
  })
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("adds router", async () => {
    await createApp({ extend: false })
    expect(Factor.$router).toBeTruthy()
  })
  it("adds store", async () => {
    await createApp({ extend: false })
    expect(Factor.$store).toBeTruthy()
  })
  it("calls 'before-app' hook", async () => {
    const spy = jest.spyOn(Factor.$filters, "run")
    await createApp({ extend: false })
    expect(spy).toHaveBeenCalledWith("before-app")
  })

  it("mounts app wrapper", async () => {
    const spy = jest.spyOn(tools, "emitEvent")

    const { app, router } = await createApp({ extend: false })

    await router.onReady()
    await waitFor(10)
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
