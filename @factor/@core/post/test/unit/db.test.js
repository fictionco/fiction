import Factor from "@factor/core"

import { $DB, FactorDB } from "../../database"
import mongoose from "mongoose"
import { getModel } from "../../server"
import { dirname } from "path"

mongoose.connection = {
  readyState: 0, // disconnected
  close: jest.fn(() => Promise.resolve())
}

let db
describe("db-utility", () => {
  beforeAll(async () => {
    db = new FactorDB()
  })

  it("creates singleton", () => {
    expect($DB).toBeInstanceOf(FactorDB)
  })

  it("initializes DB", async () => {
    await db.initialize()

    expect(mongoose.connect).toHaveBeenCalled()
  })

  // it("loads models", async () => {
  //   expect(db.__schemas.post).toBeTruthy()
  //   expect(db.__models.post).toBeTruthy()
  // })

  // it("getModel()", () => {
  //   const postModel = db.model("post")

  //   expect(postModel).toBe(getModel("post"))
  // })
})
