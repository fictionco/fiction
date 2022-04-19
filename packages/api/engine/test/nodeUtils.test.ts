import { createRequire } from "module"
import path from "path"
import { expect, it, describe, beforeAll } from "vitest"
import { getMainFilePath, importIfExists } from "../nodeUtils"
import { getServerUserConfig } from "../../config/entry"
const require = createRequire(import.meta.url)

let cwd = ""
describe("node utils", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "development"
    cwd = path.dirname(require.resolve("@factor/site/package.json"))
  })
  it("gets correct main file path", async () => {
    const filePath = getMainFilePath({ cwd })

    expect(filePath).toMatchInlineSnapshot(
      '"/Users/arpowers/Projects/factor/packages/site/src/index.ts"',
    )
  })

  it("imports files if it exists", async () => {
    const importFile = (await importIfExists(cwd)) as Record<string, any>
    expect(Object.keys(importFile).sort()).toMatchInlineSnapshot(`
      [
        "blogPlugin",
        "docsPlugin",
        "factorEmail",
        "factorUser",
        "setup",
        "stripePlugin",
      ]
    `)
  })

  it("gets correct server entry config", async () => {
    const cwd = path.dirname(require.resolve("@factor/site/package.json"))

    const entryConfig = await getServerUserConfig({ cwd })

    expect(entryConfig.routes?.length).toBeGreaterThan(0)
    expect(entryConfig.variables?.TEST_SERVER).toEqual("TEST")

    expect(entryConfig.root).toEqual(cwd)

    expect(entryConfig.port).toBe(process.env.PORT)
    expect(entryConfig.serverUrl).toBe(`http://localhost:${process.env.PORT}`)
    expect(Object.keys(entryConfig).sort()).toMatchInlineSnapshot(`
      [
        "appEmail",
        "appName",
        "appUrl",
        "endpoints",
        "mode",
        "paths",
        "port",
        "portApp",
        "root",
        "routes",
        "serverOnlyImports",
        "serverUrl",
        "sitemaps",
        "variables",
        "vite",
      ]
    `)
  })
})
