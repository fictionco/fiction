import Factor from "@factor/core"
import extendApp from "@factor/extend"
import dbUtility from "../../db"
import mongoose from "mongoose"
jest.mock("mongoose")

let db
describe("db-connect", () => {
  beforeAll(async () => {
    await extendApp().extend()
  })

  it("debug mode", async () => {
    process.env.FACTOR_DEBUG = true

    db = dbUtility()

    expect(mongoose.set).toHaveBeenCalledWith("debug", true)
  })

  it("adds callback", async () => {
    const _s = jest.spyOn(Factor.$filters, "callback")

    db = dbUtility()

    expect(_s).toHaveBeenCalledWith("initialize-server", expect.any(Function))
  })
})
