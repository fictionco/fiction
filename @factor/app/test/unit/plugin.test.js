import Factor from "@factor/core"
import { extendApp } from "@factor/extend"
import plugin from "@factor/app"
import { waitFor } from "@test/utils"
import { generateLoaders } from "@factor/build/util"
import { dirname } from "path"

import * as tools from "@factor/tools"
let _app
let spies

describe("app", () => {
  beforeAll(async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("@test/loader-basic"))

    generateLoaders()
    await extendApp()
    spies = {
      routes: jest.spyOn(tools, "addFilter"),
      components: jest.spyOn(tools, "addFilter")
    }
    _app = plugin(Factor)
  })

  it("has initialization system", async () => {
    setTimeout(() => {
      tools.emitEvent("app-mounted")
    }, 40)

    const _p = _app.client()

    expect(_p instanceof Promise).toBe(true)
    await waitFor(60)
    expect(await _p).toBe(true)
  })

  it("adds global routes and components", async () => {
    expect(spies.routes).toHaveBeenCalledWith("routes", expect.anything())
    expect(spies.components).toHaveBeenCalledWith("components", expect.anything())

    const routes = tools.applyFilters("routes", [])
    const components = tools.applyFilters("components", [])

    expect(routes).toContainObject({ path: "/" })
    expect(routes).toContainObject({ path: "*" })
    expect(components).toHaveProperty("error-404")
  })
})
