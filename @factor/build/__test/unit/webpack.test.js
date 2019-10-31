import { dirname } from "path"
import { extendServer } from "@factor/extend/server"
import buildLoaders from "@factor/cli/extension-loader"
import { buildProduction, getConfig } from "../../webpack-config"
import Factor from "@factor/core"
import { pushToFilter } from "@factor/tools"

describe("webpack", () => {
  beforeAll(async () => {
    process.env.FACTOR_CWD = dirname(require.resolve("@test/loaders"))

    await extendServer()
    buildLoaders(Factor).makeEmptyLoaders()
  })

  it("generated production app", async () => {
    const results = await buildProduction()

    expect(results).toEqual([true, true])
  })

  it("gets appropriate config", async () => {
    let config = getConfig({ analyze: true, target: "client" })

    let plugins = config.plugins.map(_ => _.constructor.name)
    expect(plugins).toEqual(expect.arrayContaining(["BundleAnalyzerPlugin"]))

    process.env.NODE_ENV = "production"

    // test for ignore modules
    pushToFilter("webpack-ignore-modules", "mongoose")
    config = getConfig({ target: "server" })
    plugins = config.plugins.map(_ => _.constructor.name)
    expect(plugins).toEqual(
      expect.arrayContaining(["CleanWebpackPlugin", "IgnorePlugin"])
    )
  })
})
