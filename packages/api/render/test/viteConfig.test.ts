import { describe, it, expect, beforeAll } from "vitest"
import * as vite from "vite"
import { createServer } from "@factor/api/entry/serverEntry"
import { getUserConfig, userConfigSetting } from "@factor/api/config/plugins"
import { getServerUserConfig } from "@factor/api/config/entry"
import { getStandardPaths } from "@factor/api/cli/utils"
import { UserConfig } from "@factor/api/config"
import { getTestCwd } from "@factor/api/test-utils"
import { getViteConfig } from "../vite.config"
let userConfig: UserConfig | undefined = undefined
let viteConfig: vite.InlineConfig | undefined = undefined
const standardPaths = getStandardPaths({ cwd: getTestCwd() })
describe("vite config", () => {
  beforeAll(async () => {
    userConfig = await getServerUserConfig({
      mainFilePath: standardPaths.mainFilePath,
      userConfig: { port: "9191" },
    })
    await createServer({ userConfig })
  })
  it("gets and merges vite config", async () => {
    const userConfigStored = getUserConfig()

    viteConfig = await getViteConfig({ ...standardPaths, userConfig })

    expect(Object.keys(userConfigStored ?? {}).sort()).toMatchInlineSnapshot(`
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

    expect(userConfigSetting("port")).toBe("9191")

    expect(standardPaths).toMatchInlineSnapshot(`
      {
        "cwd": "/Users/arpowers/Projects/factor/packages/site",
        "dist": "/Users/arpowers/Projects/factor/packages/site/dist",
        "distClient": "/Users/arpowers/Projects/factor/packages/site/dist/client",
        "distServer": "/Users/arpowers/Projects/factor/packages/site/dist/server",
        "distServerEntry": "/Users/arpowers/Projects/factor/packages/site/dist/server/mount",
        "distStatic": "/Users/arpowers/Projects/factor/packages/site/dist/static",
        "entryDir": "/Users/arpowers/Projects/factor/packages/api/entry",
        "mainFilePath": "/Users/arpowers/Projects/factor/packages/site/src/index.ts",
        "publicDir": "/Users/arpowers/Projects/factor/packages/site/src/public",
        "sourceDir": "/Users/arpowers/Projects/factor/packages/site/src",
      }
    `)

    expect(userConfig?.variables).toMatchInlineSnapshot(`
      {
        "TEST_BLOG_PLUGIN": "TEST_BLOG_PLUGIN",
        "TEST_SERVER": "TEST",
      }
    `)

    expect(userConfig?.variables).toMatchInlineSnapshot(`
      {
        "TEST_BLOG_PLUGIN": "TEST_BLOG_PLUGIN",
        "TEST_SERVER": "TEST",
      }
    `)
    expect(Object.keys(userConfig ?? {}).sort()).toMatchInlineSnapshot(`
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
    expect(userConfig?.vite?.optimizeDeps?.exclude ?? []).toContain(
      "@stripe/stripe-js",
    )
    expect(userConfig?.vite).toMatchInlineSnapshot(`
      {
        "optimizeDeps": {
          "exclude": [
            "@stripe/stripe-js",
          ],
          "include": [
            "highlight.js",
          ],
        },
      }
    `)

    expect(viteConfig).toBeTruthy()
    expect(viteConfig.optimizeDeps?.exclude).toContain("@stripe/stripe-js")
    expect(viteConfig?.define).toMatchInlineSnapshot(`
      {
        "process.env.FACTOR_APP_URL": "\\"https://www.factorjs.org\\"",
        "process.env.FACTOR_SERVER_URL": "\\"http://localhost:7781\\"",
        "process.env.IS_VITE": "\\"yes\\"",
        "process.env.TEST_BLOG_PLUGIN": "\\"TEST_BLOG_PLUGIN\\"",
        "process.env.TEST_SERVER": "\\"TEST\\"",
      }
    `)
    expect(Object.keys(viteConfig)).toMatchInlineSnapshot(`
      [
        "root",
        "publicDir",
        "server",
        "css",
        "build",
        "resolve",
        "define",
        "plugins",
        "optimizeDeps",
      ]
    `)
  })
})
