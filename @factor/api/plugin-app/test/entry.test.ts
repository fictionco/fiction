import { compileApplication } from "@factor/api/plugin-env/entry"
import { expect, it, describe } from "vitest"
describe("server entry handling", () => {
  it("gets entry and runs server function if exists", async () => {
    const { serviceConfig } = await compileApplication({ isApp: true })

    expect(serviceConfig.server).toBe(undefined)

    expect(serviceConfig).toMatchInlineSnapshot(`
      {
        "paths": [
          "/Users/arpowers/Projects/factor/@factor/plugin-notify/",
          "/Users/arpowers/Projects/factor/@factor/plugin-highlight-code/",
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
