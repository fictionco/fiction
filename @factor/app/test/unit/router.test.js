/**
 * @jest-environment jsdom
 */

import Factor from "@factor/core"
import extendApp from "@factor/extend"
import { waitFor } from "@test/utils"
import FactorRouter from "@factor/app/router"
import { emitEvent } from "@factor/tools"
describe("router", () => {
  beforeAll(async () => {
    await extendApp().extend()
  })
  it("loads correctly", () => {
    const router = FactorRouter(Factor).create()

    expect(Factor.$router).toBeTruthy()
  })

  it("loads hooks/filters", async () => {
    const spies = {
      ssrProgress: jest.spyOn(Factor.$events, "$emit"),
      action: jest.spyOn(Factor.$filters, "run")
    }
    process.env.FACTOR_SSR = "client"
    const router = FactorRouter(Factor).create()

    router.push("/meta")

    await waitFor(20)

    router.push("/")

    await waitFor(20)

    expect(spies.ssrProgress).toHaveBeenCalledWith("ssr-progress", "start")
    expect(spies.ssrProgress).toHaveBeenCalledWith("ssr-progress", "finish")

    const q = "/s?_action=example"
    router.push(q)

    await waitFor(20)

    expect(spies.action).toHaveBeenCalledWith(`route-query-action-example`, {
      _action: "example"
    })

    spies.action.mockImplementationOnce(async () => [false])

    try {
      await router.push("/no")
    } catch (error) {}

    await waitFor(20)

    expect(router.currentRoute.fullPath).toBe(q)
  })
})
