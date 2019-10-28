import Factor from "@factor/core"

import mongoose from "mongoose"

jest.mock("mongoose")

let connector
describe.skip("db-connect", () => {
  beforeAll(async () => {
    await extendApp().extend()
  })

  it("adds filters", async () => {
    const spyCallback = jest.spyOn(filters, "addCallback")
    connector = connectorUtility()

    expect(spyCallback).not.toHaveBeenCalled()

    process.env.DB_CONNECTION = "FAKECONNECTIONKEY"

    connector = connectorUtility()

    expect(spyCallback).toHaveBeenCalledWith("close-server", expect.any(Function))
    expect(spyCallback).toHaveBeenCalledWith("initialize-server", expect.any(Function))
  })

  it("connects correctly", async () => {
    mongoose.connection = {
      readyState: "disconnected",
      close: jest.fn(() => Promise.resolve())
    }
    mongoose.connect.mockImplementation(() => Promise.resolve())

    await filters.runCallbacks("initialize-server")

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_CONNECTION, {
      useNewUrlParser: true
    })
  })

  it("disconnects correctly", async () => {
    mongoose.connection = {
      readyState: 1, // connected
      close: jest.fn(() => Promise.resolve())
    }

    await filters.runCallbacks("close-server")

    expect(mongoose.connection.close).toHaveBeenCalled()

    mongoose.connection = {
      readyState: 0, // disconnected
      close: jest.fn(() => Promise.resolve())
    }

    await filters.runCallbacks("close-server")

    expect(mongoose.connection.close).not.toHaveBeenCalled()
  })

  it("handles connection error", async () => {
    const __s = jest.spyOn(errors, "logError").mockImplementation(_ => _)
    const __err = new Error("some error")
    mongoose.connect.mockImplementation(() => {
      throw __err
    })

    await dbConnect()

    expect(__s).toHaveBeenCalledWith(__err)
  })
})
