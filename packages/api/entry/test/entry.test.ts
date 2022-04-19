import { expect, it, describe } from "vitest"
import { setupAppFromMainFile } from "../setupApp"
import * as mainFile from "./mainFile"
describe("server entry handling", () => {
  it("gets entry and runs server function if exists", async () => {
    expect(process.env.PORT).toBeDefined()
    const config = await setupAppFromMainFile({ mainFile })

    expect(config.variables?.TEST_BLOG_PLUGIN).toBe(undefined)
    expect(config.server).toBe(undefined)
    expect(config.plugins).toBe(undefined)
    expect(config.variables).toBe(undefined)

    expect(config.port).toBe(process.env.PORT)
    expect(Object.keys(config)).toMatchInlineSnapshot(`
      [
        "port",
        "portApp",
        "serverUrl",
        "appUrl",
        "mode",
        "routes",
      ]
    `)
    expect(config.port).toBe(process.env.PORT)
  })
})
