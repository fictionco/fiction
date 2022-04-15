import { describe, it, expect, beforeAll } from "vitest"
import * as vite from "vite"
import { createServer } from "../../entry/serverEntry"
import { getUserConfig, userConfigSetting } from "../../config/plugins"
import { getServerUserConfig } from "../../config/entry"
import { getViteConfig } from "../vite.config"
import { getStandardPaths } from "../../cli/utils"
import { UserConfig } from "../../config"
import { getTestCwd } from "../../test-utils"
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
        "endpoints",
        "paths",
        "port",
        "portApp",
        "root",
        "routes",
        "serverOnlyImports",
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
        "FACTOR_APP_EMAIL": "hi@factorjs.org",
        "FACTOR_APP_NAME": "FactorJS",
        "FACTOR_APP_PORT": "3000",
        "FACTOR_APP_URL": "https://www.factorjs.org",
        "FACTOR_SERVER_PORT": "9191",
        "FACTOR_SERVER_URL": "",
        "HTTP_PROTOCOL": "",
        "NODE_ENV": "development",
        "TEST_BLOG_PLUGIN": "TEST_BLOG_PLUGIN",
        "TEST_ENV": "unit",
        "TEST_SERVER": "TEST",
      }
    `)
    expect(userConfig?.variables?.["FACTOR_SERVER_PORT"]).toBe("9191")

    expect(userConfig?.variables).toMatchInlineSnapshot(`
      {
        "FACTOR_APP_EMAIL": "hi@factorjs.org",
        "FACTOR_APP_NAME": "FactorJS",
        "FACTOR_APP_PORT": "3000",
        "FACTOR_APP_URL": "https://www.factorjs.org",
        "FACTOR_SERVER_PORT": "9191",
        "FACTOR_SERVER_URL": "",
        "HTTP_PROTOCOL": "",
        "NODE_ENV": "development",
        "TEST_BLOG_PLUGIN": "TEST_BLOG_PLUGIN",
        "TEST_ENV": "unit",
        "TEST_SERVER": "TEST",
      }
    `)
    expect(Object.keys(userConfig ?? {}).sort()).toMatchInlineSnapshot(`
      [
        "endpoints",
        "paths",
        "port",
        "portApp",
        "root",
        "routes",
        "serverOnlyImports",
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
        "process.env.FACTOR_APP_EMAIL": "\\"hi@factorjs.org\\"",
        "process.env.FACTOR_APP_NAME": "\\"FactorJS\\"",
        "process.env.FACTOR_APP_PORT": "\\"3000\\"",
        "process.env.FACTOR_APP_URL": "\\"https://www.factorjs.org\\"",
        "process.env.FACTOR_SERVER_PORT": "\\"9191\\"",
        "process.env.FACTOR_SERVER_URL": "\\"\\"",
        "process.env.HTTP_PROTOCOL": "\\"\\"",
        "process.env.IS_VITE": "\\"yes\\"",
        "process.env.NODE_ENV": "\\"development\\"",
        "process.env.TEST_BLOG_PLUGIN": "\\"TEST_BLOG_PLUGIN\\"",
        "process.env.TEST_ENV": "\\"unit\\"",
        "process.env.TEST_SERVER": "\\"TEST\\"",
      }
    `)
    expect(viteConfig).toMatchInlineSnapshot(`
      {
        "build": {
          "emptyOutDir": true,
          "manifest": true,
          "minify": false,
          "sourcemap": true,
        },
        "css": {
          "postcss": {
            "plugins": [
              {
                "plugins": [
                  [Function],
                ],
                "postcssPlugin": "tailwindcss",
              },
              [Function],
            ],
          },
        },
        "define": {
          "process.env.FACTOR_APP_EMAIL": "\\"hi@factorjs.org\\"",
          "process.env.FACTOR_APP_NAME": "\\"FactorJS\\"",
          "process.env.FACTOR_APP_PORT": "\\"3000\\"",
          "process.env.FACTOR_APP_URL": "\\"https://www.factorjs.org\\"",
          "process.env.FACTOR_SERVER_PORT": "\\"9191\\"",
          "process.env.FACTOR_SERVER_URL": "\\"\\"",
          "process.env.HTTP_PROTOCOL": "\\"\\"",
          "process.env.IS_VITE": "\\"yes\\"",
          "process.env.NODE_ENV": "\\"development\\"",
          "process.env.TEST_BLOG_PLUGIN": "\\"TEST_BLOG_PLUGIN\\"",
          "process.env.TEST_ENV": "\\"unit\\"",
          "process.env.TEST_SERVER": "\\"TEST\\"",
        },
        "optimizeDeps": {
          "exclude": [
            "@stripe/stripe-js",
            "@factor/api",
            "@factor/ui",
            "@factor/plugin-notify",
            "@factor/plugin-stripe",
            "@kaption/client",
            "vue",
            "@vueuse/head",
            "vue-router",
            "@medv/finder",
            "http",
            "knex",
            "knex-stringcase",
            "bcrypt",
            "chalk",
            "google-auth-library",
            "express",
            "ws",
            "nodemailer",
            "nodemailer-html-to-text",
            "prettyoutput",
            "consola",
            "jsonwebtoken",
            "lodash",
            "body-parser",
            "cors",
            "helmet",
            "fast-safe-stringify",
            "json-schema-to-typescript",
            "fs-extra",
            "module",
            "stripe",
          ],
          "include": [
            "github-buttons",
            "highlight.js",
            "path-browserify",
            "dayjs",
            "dayjs/plugin/timezone",
            "dayjs/plugin/utc",
            "dayjs/plugin/relativeTime",
            "spark-md5",
            "fast-json-stable-stringify",
            "deepmerge",
            "events",
            "js-cookie",
            "axios",
            "qs",
            "nanoid",
            "front-matter",
            "string-similarity",
            "markdown-it",
            "markdown-it-link-attributes",
            "markdown-it-video",
            "markdown-it-anchor",
            "markdown-it-implicit-figures",
            "remove-markdown",
            "gravatar",
            "validator",
          ],
        },
        "plugins": [
          {
            "buildStart": [Function],
            "config": [Function],
            "configResolved": [Function],
            "configureServer": [Function],
            "handleHotUpdate": [Function],
            "load": [Function],
            "name": "vite:vue",
            "resolveId": [Function],
            "transform": [Function],
          },
          {
            "enforce": "pre",
            "name": "vite-plugin-markdown",
            "transform": [Function],
          },
          {
            "config": [Function],
            "enforce": "pre",
            "name": "serverModuleReplacer",
            "transform": [Function],
          },
        ],
        "publicDir": "/Users/arpowers/Projects/factor/packages/site/src/public",
        "resolve": {
          "alias": {
            "@cwd": "/Users/arpowers/Projects/factor",
            "@entry": "/Users/arpowers/Projects/factor/packages/api/entry",
            "@src": "/Users/arpowers/Projects/factor/packages/site/src",
            "path": "path-browserify",
          },
        },
        "root": "/Users/arpowers/Projects/factor/packages/site/src",
        "server": {
          "watch": {
            "ignored": [
              "!**/node_modules/@factor/**",
            ],
          },
        },
      }
    `)
  })
})
