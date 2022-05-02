import { describe, it, expect, beforeAll } from "vitest"
import * as vite from "vite"

import { createTestUtils, TestUtils } from "@factor/api/testUtils"

let viteConfig: vite.InlineConfig | undefined = undefined
let testUtils: TestUtils | undefined = undefined
describe("vite config", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils({ serverPort: 20_220, appPort: 1234 })
  })
  it("gets and merges vite config", async () => {
    expect(testUtils?.factorServer.port).toBe(20_220)

    expect(testUtils?.factorApp.standardPaths).toMatchInlineSnapshot(`
      {
        "cwd": "/Users/arpowers/Projects/factor/@factor/api/",
        "dist": "/Users/arpowers/Projects/factor/@factor/api/dist",
        "distClient": "/Users/arpowers/Projects/factor/@factor/api/dist/client",
        "distServer": "/Users/arpowers/Projects/factor/@factor/api/dist/server",
        "distServerEntry": "/Users/arpowers/Projects/factor/@factor/api/dist/server/mount",
        "distStatic": "/Users/arpowers/Projects/factor/@factor/api/dist/static",
        "mainFilePath": "/Users/arpowers/Projects/factor/@factor/api/index.ts",
        "mountFilePath": "/Users/arpowers/Projects/factor/@factor/api/plugin-app/mount.ts",
        "publicDir": "/Users/arpowers/Projects/factor/@factor/api/public",
        "rootComponentPath": "/Users/arpowers/Projects/factor/@factor/api/App.vue",
        "sourceDir": "/Users/arpowers/Projects/factor/@factor/api",
      }
    `)

    viteConfig = await testUtils?.factorApp.getViteConfig()

    expect(viteConfig).toBeTruthy()

    expect(viteConfig?.define).toMatchInlineSnapshot(`
      {
        "process.env.FACTOR_APP_URL": "\\"http://localhost:1234\\"",
        "process.env.FACTOR_SERVER_URL": "\\"http://localhost:20220\\"",
        "process.env.IS_TEST": "true",
        "process.env.IS_VITE": "\\"true\\"",
        "process.env.MODE": "\\"development\\"",
      }
    `)
    expect(Object.keys(viteConfig ?? {})).toMatchInlineSnapshot(`
      [
        "mode",
        "root",
        "publicDir",
        "server",
        "build",
        "resolve",
        "plugins",
        "optimizeDeps",
        "css",
        "define",
      ]
    `)
  })
})
