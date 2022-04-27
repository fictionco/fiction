import { compileApplication } from "@factor/api/plugin-env/entry"
import { expect, it, describe } from "vitest"
describe("server entry handling", () => {
  it("gets entry and runs server function if exists", async () => {
    const { userConfig } = await compileApplication({ isApp: true })

    expect(userConfig.server).toBe(undefined)
    expect(userConfig.plugins).toBe(undefined)

    expect(userConfig).toMatchInlineSnapshot(`
      {
        "paths": [
          "/Users/arpowers/Projects/factor/packages/plugin-notify/",
          "/Users/arpowers/Projects/factor/packages/plugin-highlight-code/",
        ],
        "serverOnlyImports": [
          {
            "id": "html-to-text",
          },
          {
            "id": "http",
          },
          {
            "id": "body-parser",
          },
        ],
        "vite": {
          "optimizeDeps": {
            "include": [
              "highlight.js",
            ],
          },
        },
      }
    `)
  }, 10_000)
})
