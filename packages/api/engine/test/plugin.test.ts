import { createRequire } from "module"
import path from "path"
import { expect, it, describe, beforeAll } from "vitest"
import { mainFilePath, serverRenderEntryConfig } from "../nodeUtils"
import { setUserConfig, userConfigSetting } from "../plugins"
const require = createRequire(import.meta.url)

let cwd = ""
describe("plugin and config tests", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "development"
    cwd = path.dirname(require.resolve("@factor/site/package.json"))
  })
  it("gets correct main file path", async () => {
    const filePath = mainFilePath({ cwd })

    expect(filePath).toMatchInlineSnapshot(
      '"/Users/arpowers/projects/factor/packages/site/src/index.ts"',
    )
  })

  it("gets correct server entry config", async () => {
    const entryConfig = await serverRenderEntryConfig({ cwd })

    expect(entryConfig.plugins?.length).toBeGreaterThan(0)
    expect(entryConfig.routes?.length).toBeGreaterThan(0)
    expect(entryConfig.variables?.TEST_SERVER).toEqual("TEST")

    expect(entryConfig.root).toEqual(cwd)

    const userConfig = await setUserConfig(entryConfig, { isServer: true })

    expect(userConfigSetting("port")).toBe(process.env.PORT)

    expect(userConfig.endpoints?.map((_) => _.key)).toMatchInlineSnapshot(`
      [
        "ManageCustomer",
        "ListSubscriptions",
        "GetInvoices",
        "ManageSubscription",
        "ManagePaymentMethod",
        "GetCustomerData",
        "AllProducts",
        "GetProduct",
        "GetCoupon",
        "stripeWebhooks",
      ]
    `)

    expect(userConfig.routes?.map((r) => r.path)).toMatchInlineSnapshot(`
      [
        "/",
        "/plugins",
        "/showcase",
        "/showcase/:slug",
        "/install",
        "/testing",
        "/blog",
        "/blog",
        "/blog/:slug",
        "/docs",
        "/docs",
        "/docs/:slug",
      ]
    `)

    expect(userConfig.paths).toMatchInlineSnapshot(`
      [
        "/Users/arpowers/projects/factor/packages/plugin-stripe/",
        "/Users/arpowers/projects/factor/packages/plugin-notify/",
        "/Users/arpowers/projects/factor/packages/plugin-highlight-code/",
        "/Users/arpowers/projects/factor/packages/plugin-blog-engine/",
        "/Users/arpowers/projects/factor/packages/plugin-docs-engine/",
      ]
    `)
  })
})
