/**
 * @jest-environment jsdom
 */

import * as app from "@factor/app/app"

import { waitFor, indexHtml } from "@test/utils"

let spies = {}
describe("browser-app", () => {
  beforeAll(() => {
    document.open()
    document.write(indexHtml())
    document.close()
    spies.createApp = jest.spyOn(app, "createApp")
  })
  it("enters application and mounts correctly", async () => {
    require("@factor/app/entry-browser")

    await waitFor(100)

    expect(spies.createApp).toHaveBeenCalled()
  })

  it("adds global variables to window (for reference)", async () => {
    await waitFor(20)

    expect(window.factorApp).toBeTruthy()

    await waitFor(20)

    expect(window.factorReady).toBeTruthy()
  })

  it.todo("fires appropriate hooks")

  it.todo("adds router and store")
})
