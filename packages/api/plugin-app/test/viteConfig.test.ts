import { describe, it, expect, beforeAll } from "vitest"
import * as vite from "vite"

import { createTestUtils, TestUtils } from "@factor/api/test-utils"

let viteConfig: vite.InlineConfig | undefined = undefined
let testUtils: TestUtils | undefined = undefined
describe("vite config", () => {
  beforeAll(async () => {
    testUtils = await createTestUtils({ port: 9191 })
  })
  it("gets and merges vite config", async () => {
    viteConfig = await testUtils?.factorApp.getViteConfig()

    expect(testUtils?.factorApp.portApp).toBe("9191")

    expect(testUtils?.factorApp.standardPaths).toMatchInlineSnapshot(`
      {
        "cwd": "/Users/arpowers/Projects/factor/packages/site",
        "dist": "/Users/arpowers/Projects/factor/packages/site/dist",
        "distClient": "/Users/arpowers/Projects/factor/packages/site/dist/client",
        "distServer": "/Users/arpowers/Projects/factor/packages/site/dist/server",
        "distServerEntry": "/Users/arpowers/Projects/factor/packages/site/dist/server/mount",
        "distStatic": "/Users/arpowers/Projects/factor/packages/site/dist/static",
        "mainFilePath": "/Users/arpowers/Projects/factor/packages/site/src/index.ts",
        "mountFilePath": "/Users/arpowers/Projects/factor/packages/api/entry/mount.ts",
        "publicDir": "/Users/arpowers/Projects/factor/packages/site/src/public",
        "rootComponentPath": "/Users/arpowers/Projects/factor/packages/site/src/App.vue",
        "sourceDir": "/Users/arpowers/Projects/factor/packages/site/src",
      }
    `)

    expect(viteConfig).toBeTruthy()
    expect(viteConfig?.optimizeDeps?.exclude).toContain("@stripe/stripe-js")

    expect(viteConfig?.define).toMatchInlineSnapshot(`
      {
        "process.env.FACTOR_APP_URL": "\\"https://www.factorjs.org\\"",
        "process.env.FACTOR_SERVER_URL": "\\"http://localhost:9191\\"",
        "process.env.IS_VITE": "\\"true\\"",
        "process.env.MAIN_FILE": "\\"/Users/arpowers/Projects/factor/packages/site/src/index.ts\\"",
        "process.env.ROOT_COMPONENT": "\\"/Users/arpowers/Projects/factor/packages/site/src/App.vue\\"",
        "process.env.TEST_BLOG_PLUGIN": "\\"TEST_BLOG_PLUGIN\\"",
        "process.env.TEST_SERVER": "\\"TEST\\"",
      }
    `)
    expect(Object.keys(viteConfig ?? {})).toMatchInlineSnapshot(`
      [
        "define",
        "root",
        "publicDir",
        "server",
        "css",
        "build",
        "resolve",
        "plugins",
        "optimizeDeps",
      ]
    `)
  })
})
