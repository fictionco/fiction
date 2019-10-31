/**
 * @jest-environment node
 */

import { extendApp } from "@factor/extend"

import { createApp } from "../../app"
import * as tools from "@factor/tools"
let _app

describe("app", () => {
  beforeAll(async () => {
    await extendApp().extend()
    _app = await createApp({ extend: false })
    _app.app.$mount = jest.fn()
  })

  it("enters server correctly", async () => {
    jest.doMock("../../app", () => ({
      createApp: () => _app
    }))
    const ssrEntry = require("../../entry-server.js").default

    const spies = {
      callbacks: jest.spyOn(tools, "runCallbacks"),
      init: jest.spyOn(tools, "applyFilters"),
      ready: jest.spyOn(tools, "applyFilters")
    }

    await ssrEntry({ url: "/" })

    const expecter = () => {
      const exp = expect.objectContaining({
        app: expect.anything(),
        router: expect.anything(),
        store: expect.anything()
      })

      return exp
    }

    expect(spies.callbacks).toHaveBeenCalledWith("ssr-context-callbacks", expecter())

    expect(spies.init).toHaveBeenCalledWith(
      "ssr-context-init",
      expect.objectContaining({ url: expect.any(String) }),
      expecter()
    )

    expect(spies.ready).toHaveBeenCalledWith(
      "ssr-context-ready",
      expect.objectContaining({ url: expect.any(String) }),
      expecter()
    )

    return
  })
})
