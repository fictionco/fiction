import { expect, it, describe } from "vitest"
import * as mainFile from "@factor/site"
import { setupAppFromMainFile } from "../../engine"
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
        "sitemaps",
        "paths",
      ]
    `)
    expect(config.port).toBe(process.env.PORT)
    expect(config.routes?.length).toBeGreaterThan(0)
    expect(config.sitemaps?.length).toBeGreaterThan(0)
  })
})
