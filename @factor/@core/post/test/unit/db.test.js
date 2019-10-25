import Factor from "@factor/core"
import extender from "@factor/extend/server"
import DB from "../../db"
import mongoose from "mongoose"
import { getModel } from "../../server"
import { dirname } from "path"

let db
describe("db-utility", () => {
  beforeAll(async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("@test/loader-basic"))
    await extender().extend()
  })

  it.skip("debug mode", async () => {
    process.env.FACTOR_DEBUG = true

    const s = jest.spyOn(mongoose, "set")

    db = dbUtility()

    expect(s).toHaveBeenCalledWith("debug", true)
  })

  it("loads models", async () => {
    const _s = jest.spyOn(Factor.$filters, "callback")

    expect(_s).toHaveBeenCalledWith("initialize-server", expect.any(Function))

    await Factor.$filters.run("initialize-server")

    expect(DB.__schemas.post).toBeTruthy()
    expect(DB.__models.post).toBeTruthy()

    const postModel = DB.model("post")

    expect(postModel).toBe(getModel("post"))
  })
})
