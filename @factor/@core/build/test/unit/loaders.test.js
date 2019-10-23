import extendServer from "@factor/extend/server"
import buildLoaders from "@factor/build/loaders"
import { dirname } from "path"
import Factor from "@factor/core"

jest.mock("fs-extra")

let builder
let spies
describe("files", () => {
  beforeAll(async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("@test/loaders"))

    await extendServer().extend()

    builder = buildLoaders()

    spies = {
      writeFile: jest.spyOn(builder, "writeFile")
    }
  })
  it("gets extensions", () => {
    expect(builder.extensions.length).toBeGreaterThan(0)
  })

  it("generates loaders", () => {
    builder.generateLoaders()

    expect(spies.writeFile).toHaveBeenCalledTimes(4)
  })

  it("gets directories for dev watcher", () => {
    const dirs = builder.getFactorDirectories()
    expect(dirs.length).toBeGreaterThan(0)
  })

  it("gets extensions by extension type", () => {
    const exts = builder.getExtensions()
    expect(exts.length).toBeGreaterThan(0)
  })
})
