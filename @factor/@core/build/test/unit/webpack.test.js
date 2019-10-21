import { dirname } from "path"
import extender from "@factor/extend/server"
import buildLoaders from "@factor/build/loaders"
import webpackBuilder from "../../webpack-config"
import Factor from "vue"
describe("webpack", () => {
  beforeAll(async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("@test/loaders"))

    await extender(Factor).extend({ loadPlugins: false })
    buildLoaders(Factor).makeEmptyLoaders()
  })

  it("generated production app", async () => {
    const builder = webpackBuilder(Factor)
    const results = await builder.buildProduction()

    expect(results).toEqual([true, true])
  })

  it("gets appropriate config", async () => {
    const builder = webpackBuilder(Factor)
    let config = builder.getConfig({ analyze: true, target: "client" })

    let plugins = config.plugins.map(_ => _.constructor.name)
    expect(plugins).toEqual(expect.arrayContaining(["BundleAnalyzerPlugin"]))

    process.env.NODE_ENV = "production"

    // test for ignore modules
    Factor.$filters.push("webpack-ignore-modules", "mongoose")
    config = builder.getConfig({ target: "server" })
    plugins = config.plugins.map(_ => _.constructor.name)
    expect(plugins).toEqual(
      expect.arrayContaining(["CleanWebpackPlugin", "IgnorePlugin"])
    )
  })
})
