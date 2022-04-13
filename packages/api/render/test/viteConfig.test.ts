import { describe, it, expect, beforeAll } from "vitest"
import { setup } from "../../server"
import { getUserConfig } from "../../engine/plugins"
import { getViteConfig } from "../vite.config"
describe("vite config", () => {
  beforeAll(async () => {
    await setup({ moduleName: "@factor/site", port: "9191" })
  })
  it("gets and merges vite config", async () => {
    const userConfig = getUserConfig()
    expect(userConfig?.vite?.optimizeDeps?.exclude).toContain(
      "@stripe/stripe-js",
    )
    expect(userConfig?.vite).toMatchInlineSnapshot(`
      {
        "optimizeDeps": {
          "exclude": [
            "@stripe/stripe-js",
          ],
        },
      }
    `)
    const viteConfig = await getViteConfig()

    expect(viteConfig).toBeTruthy()
    expect(viteConfig.optimizeDeps?.exclude).toContain("@stripe/stripe-js")
    expect(viteConfig?.define?.["process.env.FACTOR_SERVER_PORT"]).toContain(
      "9191",
    )
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
          "process.env.FACTOR_APP_PORT": "\\"\\"",
          "process.env.FACTOR_APP_URL": "\\"https://www.factorjs.org\\"",
          "process.env.FACTOR_SERVER_PORT": "\\"9191\\"",
          "process.env.FACTOR_SERVER_URL": "\\"\\"",
          "process.env.HTTP_PROTOCOL": "\\"\\"",
          "process.env.NODE_ENV": "\\"development\\"",
          "process.env.TEST_BLOG_PLUGIN": "\\"TEST_BLOG_PLUGIN\\"",
          "process.env.TEST_ENV": "\\"unit\\"",
          "process.env.TEST_SERVER": "\\"TEST\\"",
        },
        "optimizeDeps": {
          "exclude": [
            "@stripe/stripe-js",
            "@factor/api",
            "@factor/plugin-notify",
            "@factor/plugin-stripe",
            "@kaption/client",
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
            "module",
            "stripe",
            "vue",
            "@vueuse/head",
            "vue-router",
            "@medv/finder",
          ],
          "include": [
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
        "publicDir": "/Users/arpowers/Projects/factor/public",
        "resolve": {
          "alias": {
            "@cwd": "/Users/arpowers/Projects/factor",
            "@entry": "/Users/arpowers/Projects/factor/packages/api/entry",
            "@src": "/Users/arpowers/Projects/factor",
            "path": "path-browserify",
          },
        },
        "root": "/Users/arpowers/Projects/factor",
        "server": {
          "fs": {
            "strict": false,
          },
          "port": 3000,
        },
      }
    `)
  })
})
