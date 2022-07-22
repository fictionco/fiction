import { createRequire } from "module"
import path from "path"
import { expect, it, describe, beforeAll } from "@factor/api/testUtils"
import { getMainFilePath, importIfExists } from "../nodeUtils"
import { getServerServiceConfig } from "../../plugin-env/entry"
const require = createRequire(import.meta.url)

let cwd = ""
describe("node utils", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "development"
    cwd = path.dirname(require.resolve("@factor/www/package.json"))
  })
  it("gets correct main file path", async () => {
    const filePath = getMainFilePath({ cwd })

    expect(filePath).toMatchInlineSnapshot(
      '"/Users/arpowers/Projects/factor/@factor/www/src/index.ts"',
    )
  })

  it("imports files if it exists", async () => {
    const importFile = (await importIfExists(cwd)) as Record<string, any>
    expect(Object.keys(importFile).sort()).toMatchInlineSnapshot(`
      [
        "appEmail",
        "appName",
        "factorApp",
        "factorDb",
        "factorEmail",
        "factorEnv",
        "factorRouter",
        "factorServer",
        "factorStripe",
        "factorUser",
        "productionUrl",
        "service",
        "setup",
      ]
    `)
  })

  it("gets correct server entry config", async () => {
    const cwd = path.dirname(require.resolve("@factor/www/package.json"))

    const entryConfig = await getServerServiceConfig({ cwd })

    expect(Object.keys(entryConfig).sort()).toMatchInlineSnapshot(`
      [
        "name",
        "paths",
        "service",
        "vite",
      ]
    `)
  })
})
