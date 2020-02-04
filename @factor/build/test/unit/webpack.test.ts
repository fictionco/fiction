import { dirname, resolve } from "path"
import { browserReplaceModule, findFileOperator } from "@factor/build/webpack-overrides"
import { getDefinedValues, getWebpackConfig } from "@factor/build/webpack-config"

import { deepMerge } from "@factor/api"
import { existsSync } from "fs-extra"
import jsdom from "jsdom"
import { waitFor } from "@test/utils"
import webpack from "webpack"
describe("webpack", () => {
  describe("webpack-config", () => {
    it("returns the correct development config", async () => {
      process.env.NODE_ENV = "development"
      process.env.FACTOR_CWD = dirname(require.resolve("./test-files/package.json"))
      const serverConfig = await getWebpackConfig({ target: "server" })

      expect(Object.keys(serverConfig)).toEqual(
        expect.arrayContaining([
          "output",
          "resolve",
          "plugins",
          "module",
          "externals",
          "target"
        ])
      )

      expect(serverConfig.target).toBe("node")
      expect(serverConfig.mode).toBe("development")
      expect(serverConfig.entry).toContain("entry-server")

      const clientConfig = await getWebpackConfig({ target: "client" })

      expect(Object.keys(clientConfig)).toEqual(
        expect.arrayContaining(["output", "resolve", "plugins", "module"])
      )

      expect(clientConfig.entry).toContain("entry-browser")

      expect(clientConfig.resolve?.alias?.__SRC__).toContain("test-files")
      expect(clientConfig.resolve?.alias?.__CWD__).toContain("test-files")
    })

    it("returns the correct production config", async () => {
      process.env.NODE_ENV = "production"

      const serverConfig = await getWebpackConfig({ target: "server" })
      expect(serverConfig.mode).toBe("production")

      const clientConfig = await getWebpackConfig({ target: "client" })
      expect(clientConfig.mode).toBe("production")
    })

    it("Compiles vue and image files", async () => {
      process.env.NODE_ENV = "development"
      const clientConfig = await getWebpackConfig({ target: "client", clean: true })

      const compiler = webpack(
        deepMerge([
          clientConfig,
          {
            entry: `${process.env.FACTOR_CWD}/entry`,
            output: { filename: "js/[name].js" }
          }
        ])
      )

      await new Promise(resolve => {
        compiler.run(() => resolve())
      })

      const { window } = await jsdom.JSDOM.fromFile(
        resolve(__dirname, "./test-files/index.html"),
        { resources: "usable", runScripts: "dangerously" }
      )

      await waitFor(50)

      const html = window.document.body.innerHTML
      expect(html).toContain(`<span class="message">hello</span>`)
      expect(html).toContain(`/test-image`)
    })

    it("supports bundle analysis", async () => {
      const config = await getWebpackConfig({ analyze: true, target: "client" })
      const plugins = config.plugins?.map(_ => _.constructor.name)

      if (plugins) expect(plugins.includes("BundleAnalyzerPlugin")).toBe(true)
    })

    it("defines application ENV variables", () => {
      process.env.NODE_ENV = "development"
      const defined = getDefinedValues({ target: "client" })

      // all should be string
      expect(Object.values(defined).some(_ => typeof _ != "string")).toBe(false)

      expect(Object.keys(defined).map(_ => _.replace("process.env.", ""))).toEqual(
        expect.arrayContaining([
          "FACTOR_APP_CONFIG",
          "NODE_ENV",
          "FACTOR_ENV",
          "VUE_ENV",
          "FACTOR_BUILD_ENV"
        ])
      )
    })
  })
  describe("webpack-override", () => {
    it("recognizes the override alias and uses correct override hierarchy", () => {
      const resource = findFileOperator({
        request: "__FIND__/test-files/test-image.jpg",
        context: __dirname
      })
      expect(existsSync(resource.request)).toBe(true)
    })
    it("allows for browser/webpack overrides '-browser'", () => {
      const resource = browserReplaceModule({
        request: "./test-files/entry.js",
        context: __dirname
      })

      expect(resource.request.includes("entry-browser")).toBe(true)
    })
  })

  describe("webpack-production-build", () => {
    it.todo("logs correct information from production build")
    it.todo("empties and then recreates dist folder")
    it.todo("builds dist SSR bundles")
    it.todo("builds client chunks")
    it.todo("moves static files")
  })

  describe("webpack-development-build", () => {
    it.todo("logs errors correctly")
  })
})
