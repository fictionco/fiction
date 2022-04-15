import { createRequire } from "module"
import path from "path"
import { expect, it, describe, beforeAll } from "vitest"
import { getMainFilePath } from "../../engine/nodeUtils"
import { setUserConfig, userConfigSetting } from "../plugins"
import { getServerUserConfig } from "../entry"
const require = createRequire(import.meta.url)

let cwd = ""
describe("plugin and config tests", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "development"
    cwd = path.dirname(require.resolve("@factor/site/package.json"))
  })
  it("gets correct main file path", async () => {
    const filePath = getMainFilePath({ cwd })

    expect(filePath).toMatchInlineSnapshot(
      '"/Users/arpowers/Projects/factor/packages/site/src/index.ts"',
    )
  })

  it("gets correct server entry config", async () => {
    const entryConfig = await getServerUserConfig({ cwd })

    expect(entryConfig.routes?.length).toBeGreaterThan(0)
    expect(entryConfig.variables?.TEST_SERVER).toEqual("TEST")

    expect(entryConfig.root).toEqual(cwd)

    const userConfig = await setUserConfig(entryConfig)

    expect(userConfigSetting("port")).toBe(process.env.PORT)

    expect(userConfig.endpoints?.map((_) => _.key).sort())
      .toMatchInlineSnapshot(`
        [
          "AllProducts",
          "CurrentUser",
          "GetCoupon",
          "GetCustomerData",
          "GetInvoices",
          "GetProduct",
          "ListSubscriptions",
          "Login",
          "ManageCustomer",
          "ManagePaymentMethod",
          "ManageSubscription",
          "ManageUser",
          "NewVerificationCode",
          "ResetPassword",
          "SendOneTimeCode",
          "SetPassword",
          "StartNewUser",
          "UpdateCurrentUser",
          "UserGoogleAuth",
          "VerifyAccountEmail",
          "stripeWebhooks",
        ]
      `)

    expect(userConfig.routes?.map((r) => r.path).sort()).toMatchInlineSnapshot(`
      [
        "/",
        "/blog",
        "/blog",
        "/blog/:slug",
        "/docs",
        "/docs",
        "/docs/:slug",
        "/install",
        "/plugins",
        "/showcase",
        "/showcase/:slug",
        "/testing",
      ]
    `)

    expect(userConfig.paths?.sort()).toMatchInlineSnapshot(`
      [
        "/Users/arpowers/Projects/factor/packages/plugin-blog-engine/",
        "/Users/arpowers/Projects/factor/packages/plugin-docs-engine/",
        "/Users/arpowers/Projects/factor/packages/plugin-highlight-code/",
        "/Users/arpowers/Projects/factor/packages/plugin-notify/",
        "/Users/arpowers/Projects/factor/packages/plugin-stripe/",
        "/Users/arpowers/Projects/factor/packages/ui/",
      ]
    `)
  })
})
