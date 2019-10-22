import Factor from "@factor/core"
import extender from "@factor/extend/server"
import dbUtility from "../../db"
import mongoose from "mongoose"
import { getModel } from "../../util-server"
import { dirname } from "path"

let db
describe("db-utility", () => {
  beforeAll(async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("@test/loader-basic"))
    await extender().extend()
  })

  it("debug mode", async () => {
    process.env.FACTOR_DEBUG = true

    const s = jest.spyOn(mongoose, "set")

    db = dbUtility()

    expect(s).toHaveBeenCalledWith("debug", true)
  })

  it("loads models", async () => {
    const _s = jest.spyOn(Factor.$filters, "callback")

    db = dbUtility()

    expect(_s).toHaveBeenCalledWith("initialize-server", expect.any(Function))

    await Factor.$filters.run("initialize-server")

    expect(db.__schemas.post).toBeTruthy()
    expect(db.__models.post).toBeTruthy()

    const postModel = db.model("post")

    expect(postModel).toBe(getModel("post"))
  })
})
