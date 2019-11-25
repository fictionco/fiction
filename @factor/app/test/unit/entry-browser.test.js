/**
 * @jest-environment jsdom
 */

import * as app from "@factor/app/app"
import * as events from "@factor/tools/events"
import { waitFor, indexHtml } from "@test/utils"

const spies = {}
describe("browser-app", () => {
  beforeAll(() => {
    document.open()
    document.write(indexHtml())
    document.close()
    spies.createApp = jest.spyOn(app, "createApp")
    spies.emitEvent = jest.spyOn(events, "emitEvent")
  })
  it("enters application and mounts correctly", async () => {
    require("@factor/app/entry-browser")

    await waitFor(100)

    expect(spies.createApp).toHaveBeenCalled()
  })

  it("adds global variables to window (for reference)", async () => {
    await waitFor(20)

    expect(window.factorApp).toBeTruthy()

    expect(window.factorReady).toBeTruthy()
  })

  it("fires appropriate hooks", async () => {
    await waitFor(200)
    expect(spies.emitEvent).toHaveBeenCalledWith("app-mounted")
  })
})
