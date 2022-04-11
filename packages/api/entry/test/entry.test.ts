import { expect, it, describe } from "vitest"
import { setupAppFromMainFile } from "../../engine/setup"
import * as mainFile from "./mainFile"
describe("server entry handling", () => {
  it("gets entry and runs server function if exists", async () => {
    expect(process.env.PORT).toBeDefined()
    const config = await setupAppFromMainFile({ mainFile })

    expect(config.variables?.TEST_BLOG_PLUGIN).toBe(undefined)
    expect(config.server).toBe(undefined)
    expect(config.plugins).toBe(undefined)
    expect(Object.keys(config)).toMatchInlineSnapshot(`
      [
        "port",
        "portApp",
        "routes",
      ]
    `)
    expect(config.port).toBe(process.env.PORT)
  })
})
