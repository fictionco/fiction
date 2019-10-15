import Factor from "@factor/core"
import extendApp from "@factor/extend"
import connectorUtility from "../../connect-db"
import mongoose from "mongoose"
jest.mock("mongoose")

let connector
describe("db-connect", () => {
  beforeAll(async () => {
    await extendApp().extend()
  })

  it("adds filters", async () => {
    const spyCallback = jest.spyOn(Factor.$filters, "callback")
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
    await Factor.$filters.run("initialize-server")

    expect(connector.isConnected).toBe(true)

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_CONNECTION, {
      useNewUrlParser: true
    })
  })

  it("disconnects correctly", async () => {
    const mock1 = mongoose.connection.close.mockImplementation(() => Promise.resolve())
    await Factor.$filters.run("close-server")

    expect(mongoose.connection.close).toHaveBeenCalled()

    mock1.mockClear()

    connector.isConnected = false

    await Factor.$filters.run("close-server")

    expect(mongoose.connection.close).not.toHaveBeenCalled()
  })

  it("handles connection error", async () => {
    const __s = jest.spyOn(Factor.$log, "error").mockImplementation(_ => _)
    const __err = new Error("some error")
    mongoose.connect.mockImplementation(() => {
      throw __err
    })

    await connector.connectDb()

    expect(__s).toHaveBeenCalledWith(__err)
  })

  it("debug mode", async () => {
    process.env.FACTOR_DEBUG = true

    connector = connectorUtility()

    expect(mongoose.set).toHaveBeenCalledWith("debug", true)
  })
})
