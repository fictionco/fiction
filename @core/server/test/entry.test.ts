import { createRequire } from "module"
import path from "path"
import { expect, it, describe } from "vitest"
import { setup } from ".."
const require = createRequire(import.meta.url)

describe("server entry handling", () => {
  it("gets entry and runs server function if exists", async () => {
    process.env.NODE_ENV = "development"
    const cwd = path.dirname(require.resolve("@factor/site/package.json"))

    const config = await setup({
      cwd,
    })

    expect(config.variables?.TEST_BLOG_PLUGIN).toBe("TEST_BLOG_PLUGIN")

    expect(Object.keys(config)).toMatchInlineSnapshot(`
      [
        "routes",
        "plugins",
        "variables",
        "endpoints",
        "port",
        "sitemaps",
      ]
    `)
  })
})
