import mongoose from "mongoose"
import * as tools from "@factor/tools"
import { extendApp } from "@factor/extend"
import log from "@factor/logger"
jest.mock("mongoose")

describe("db-connect", () => {
  beforeAll(async () => {
    await extendApp()
  })

  it("adds filters", async () => {
    const spyCallback = jest.spyOn(tools, "addCallback")

    expect(spyCallback).not.toHaveBeenCalled()

    process.env.DB_CONNECTION = "FAKECONNECTIONKEY"

    expect(spyCallback).toHaveBeenCalledWith("close-server", expect.any(Function))
    expect(spyCallback).toHaveBeenCalledWith("initialize-server", expect.any(Function))
  })

  it("connects correctly", async () => {
    mongoose.connection = {
      readyState: "disconnected",
      close: jest.fn(() => Promise.resolve())
    }
    mongoose.connect.mockImplementation(() => Promise.resolve())

    await tools.runCallbacks("initialize-server")

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_CONNECTION, {
      useNewUrlParser: true
    })
  })

  it("disconnects correctly", async () => {
    mongoose.connection = {
      readyState: 1, // connected
      close: jest.fn(() => Promise.resolve())
    }

    await tools.runCallbacks("close-server")

    expect(mongoose.connection.close).toHaveBeenCalled()

    mongoose.connection = {
      readyState: 0, // disconnected
      close: jest.fn(() => Promise.resolve())
    }

    await tools.runCallbacks("close-server")

    expect(mongoose.connection.close).not.toHaveBeenCalled()
  })

  it("handles connection error", async () => {
    const __s = jest.spyOn(log, "error").mockImplementation(_ => _)
    const __err = new Error("some error")
    mongoose.connect.mockImplementation(() => {
      throw __err
    })

    expect(__s).toHaveBeenCalledWith(__err)
  })
})
