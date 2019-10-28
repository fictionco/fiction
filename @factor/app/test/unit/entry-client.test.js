/**
 * @jest-environment jsdom
 */
import Factor from "vue"
import extendApp from "@factor/extend"

import { createApp } from "../../app"
import { waitFor } from "@test/utils"

let _app

describe("app", () => {
  beforeAll(async () => {
    await extendApp().extend()
    _app = await createApp({ extend: false })
    _app.app.$mount = jest.fn()
  })

  it("enters client correctly", async () => {
    jest.doMock("../../app", () => ({
      createApp: () => _app
    }))

    require("../../entry-client.js")

    await waitFor(20)

    expect(window.FactorApp).toBeTruthy()

    await waitFor(20)

    expect(window.FactorReady).toBeTruthy()

    expect(_app.app.$mount).toHaveBeenCalled()

    return
  })
})
