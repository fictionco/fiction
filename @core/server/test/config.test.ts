import { createRequire } from "module"
import path from "path"
import { expect, it, describe } from "vitest"
import { getFactorConfig } from "../globals"
const require = createRequire(import.meta.url)

describe("config tests", () => {
  it("get config with cwd", async () => {
    const cwd = path.dirname(require.resolve("@factor/site/package.json"))

    const config = await getFactorConfig({
      cwd,
    })

    expect(config.variables?.FACTOR_APP_EMAIL).toBeTruthy()
    expect(config.variables?.FACTOR_APP_NAME).toBeTruthy()
    expect(config.variables?.FACTOR_APP_URL).toBeTruthy()

    expect(config).toMatchInlineSnapshot(`
      {
        "variables": {
          "FACTOR_APP_EMAIL": "hi@factorjs.org",
          "FACTOR_APP_NAME": "FactorJS",
          "FACTOR_APP_PORT": "",
          "FACTOR_APP_URL": "https://www.factorjs.org",
          "FACTOR_SERVER_PORT": "",
          "FACTOR_SERVER_URL": "",
          "NODE_ENV": "test",
        },
      }
    `)
  })
})
