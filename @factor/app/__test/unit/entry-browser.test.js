/**
 * @jest-environment jsdom
 */

import { extendApp } from "@factor/extend"

import { createApp } from "../../app"
import { waitFor } from "@test/utils"

let _app

describe("app", () => {
  beforeAll(async () => {
    await extendApp()
    _app = await createApp({ extend: false })
    _app.app.$mount = jest.fn()
  })

  it("enters client correctly", async () => {
    jest.doMock("../../app", () => ({
      createApp: () => _app
    }))

    require("../../entry-browser.js")

    await waitFor(20)

    expect(window.FactorApp).toBeTruthy()

    await waitFor(20)

    expect(window.FactorReady).toBeTruthy()

    expect(_app.app.$mount).toHaveBeenCalled()

    return
  })
})
