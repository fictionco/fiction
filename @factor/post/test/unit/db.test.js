import Factor from "@factor/core"

import { $DB, FactorDB } from "../../database"
import mongoose from "mongoose"
import { getModel } from "../../server"

// mongoose.connection = {
//   readyState: 0, // disconnected
//   close: jest.fn(() => Promise.resolve())
// }

let db
describe("db-utility", () => {
  beforeAll(async () => {})

  it("creates singleton", () => {
    expect($DB).toBeInstanceOf(FactorDB)
  })

  it("initializes DB", async () => {
    jest.spyOn(mongoose, "connect")

    await $DB.initialize()

    expect(mongoose.connect).toHaveBeenCalled()
  })

  it("loads models", async () => {
    expect($DB.__schemas.post).toBeTruthy()
    expect($DB.__models.post).toBeTruthy()

    const postModel = $DB.model("post")

    expect(postModel).toBe(getModel("post"))
  })
})
