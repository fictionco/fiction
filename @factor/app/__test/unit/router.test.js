/**
 * @jest-environment jsdom
 */

import Factor from "@factor/core"
import { extendApp } from "@factor/app/extend-app"
import { waitFor } from "@test/utils"
import { createRouter } from "@factor/app/router"
import * as tools from "@factor/tools"
describe("router", () => {
  beforeAll(async () => {
    await extendApp()
  })
  it("loads correctly", () => {
    createRouter()

    expect(Factor.$router).toBeTruthy()
  })

  it("loads hooks/filters", async () => {
    const spies = {
      action: jest.spyOn(tools, "runCallbacks"),
      emitEvent: jest.spyOn(tools, "emitEvent")
    }
    process.env.FACTOR_SSR = "client"
    const router = createRouter()

    router.push("/meta")

    await waitFor(20)

    router.push("/")

    await waitFor(20)

    expect(spies.emitEvent).toHaveBeenCalledWith("ssr-progress", "start")
    expect(spies.emitEvent).toHaveBeenCalledWith("ssr-progress", "finish")

    const q = "/s?_action=example"
    router.push(q)

    await waitFor(20)

    expect(spies.action).toHaveBeenCalledWith(`route-query-action-example`, {
      _action: "example"
    })

    spies.action.mockImplementationOnce(async () => [false])

    await router.push("/no")

    await waitFor(20)

    expect(router.currentRoute.fullPath).toBe(q)
  })
})
