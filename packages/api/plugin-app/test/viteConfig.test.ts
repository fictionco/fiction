import { describe, it, expect, beforeAll } from "vitest"
import * as vite from "vite"
import { getUserConfig, userConfigSetting } from "@factor/api/config/plugins"
import { getServerUserConfig } from "@factor/api/config/entry"
import { getStandardPaths, StandardPaths } from "@factor/api/cli/utils"
import { UserConfig } from "@factor/api/config"
import { getTestCwd } from "@factor/api/test-utils"

let userConfig: UserConfig | undefined = undefined
let viteConfig: vite.InlineConfig | undefined = undefined
let standardPaths: StandardPaths | undefined = undefined

describe("vite config", () => {
  beforeAll(async () => {
    standardPaths = getStandardPaths({ cwd: getTestCwd() })
    userConfig = await getServerUserConfig({
      mainFilePath: standardPaths.mainFilePath,
      userConfig: { port: "9191" },
    })
    await createServer({ userConfig })
  })
  it("gets and merges vite config", async () => {
    if (!standardPaths) throw new Error("standardPaths is required")
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
        "mainFilePath": "/Users/arpowers/Projects/factor/packages/site/src/index.ts",
        "mountFilePath": "/Users/arpowers/Projects/factor/packages/api/entry/mount.ts",
        "publicDir": "/Users/arpowers/Projects/factor/packages/site/src/public",
        "rootComponentPath": "/Users/arpowers/Projects/factor/packages/site/src/App.vue",
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
        "process.env.FACTOR_SERVER_URL": "\\"http://localhost:9191\\"",
        "process.env.IS_VITE": "\\"true\\"",
        "process.env.MAIN_FILE": "\\"/Users/arpowers/Projects/factor/packages/site/src/index.ts\\"",
        "process.env.ROOT_COMPONENT": "\\"/Users/arpowers/Projects/factor/packages/site/src/App.vue\\"",
        "process.env.TEST_BLOG_PLUGIN": "\\"TEST_BLOG_PLUGIN\\"",
        "process.env.TEST_SERVER": "\\"TEST\\"",
      }
    `)
    expect(Object.keys(viteConfig)).toMatchInlineSnapshot(`
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
