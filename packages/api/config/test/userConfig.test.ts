import { createRequire } from "module"
import { describe, it, expect } from "vitest"
import { getServerUserConfig, compileApplication } from "../entry"
import { userConfigSetting } from "../plugins"

const require = createRequire(import.meta.url)
describe("user config", () => {
  it("gets correct client-side user config", async () => {
    const mainFilePath = require.resolve("@factor/site")
    const { userConfig } = await compileApplication({
      mainFilePath,
      isApp: true,
    })
    expect(userConfig.variables?.TEST_SERVER).toBeFalsy()
    expect(userConfigSetting("routes")?.length).toMatchInlineSnapshot("12")
  })

  it("gets correct server user config", async () => {
    const userConfig = await getServerUserConfig({ moduleName: "@factor/site" })

    expect(userConfigSetting("port")).toBeTruthy()
    expect(userConfig.variables?.TEST_SERVER).toBe("TEST")
    expect(Object.keys(userConfig.variables ?? {})).toMatchInlineSnapshot(`
      [
        "TEST_SERVER",
        "TEST_BLOG_PLUGIN",
      ]
    `)
    expect(userConfig.endpoints?.map((_) => _.key)).toMatchInlineSnapshot(`
      [
        "UserGoogleAuth",
        "Login",
        "NewVerificationCode",
        "SetPassword",
        "ResetPassword",
        "UpdateCurrentUser",
        "SendOneTimeCode",
        "VerifyAccountEmail",
        "StartNewUser",
        "CurrentUser",
        "ManageUser",
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
    expect(userConfig.routes?.map((_) => _.name)).toMatchInlineSnapshot(`
      [
        "home",
        "plugins",
        "showcase",
        "showcaseSingle",
        "install",
        "testing",
        "blog",
        "blogIndex",
        "blogSingle",
        "docs",
        "docsIndex",
        "docsSingle",
      ]
    `)
    expect(userConfig.root).toMatchInlineSnapshot(
      '"/Users/arpowers/Projects/factor/packages/site"',
    )
    expect(userConfig.port).toBe(process.env.PORT)
    expect(userConfig.serverOnlyImports).toMatchInlineSnapshot(`
      [
        {
          "id": "html-to-text",
        },
        {
          "id": "stripe",
        },
      ]
    `)
    expect(userConfig.vite).toMatchInlineSnapshot(`
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
  })
})
