import { describe, it, expect } from "vitest"
import { getServerUserConfig, createUserConfig } from "../entry"
import { userConfigSetting } from "../plugins"
describe("user config", () => {
  it("gets correct client-side user config", async () => {
    const mainFile = await import("@factor/site")
    const userConfig = await createUserConfig({ mainFile, isApp: true })
    expect(userConfig.variables?.TEST_SERVER).toBeFalsy()
    expect(userConfigSetting("routes")?.length).toMatchInlineSnapshot("12")
  })

  it("gets correct server user config", async () => {
    const userConfig = await getServerUserConfig({ moduleName: "@factor/site" })

    expect(userConfigSetting("port")).toBeTruthy()
    expect(process.env.TEST_SERVER).toBeTruthy()
    expect(process.env.TEST_SERVER).toMatchInlineSnapshot('"TEST"')
    expect(userConfig.variables?.TEST_SERVER).toBe("TEST")
    expect(Object.keys(userConfig.variables ?? {})).toMatchInlineSnapshot(`
      [
        "FACTOR_APP_NAME",
        "FACTOR_APP_EMAIL",
        "FACTOR_APP_URL",
        "FACTOR_SERVER_URL",
        "FACTOR_SERVER_PORT",
        "FACTOR_APP_PORT",
        "NODE_ENV",
        "TEST_ENV",
        "HTTP_PROTOCOL",
        "TEST_SERVER",
        "TEST_BLOG_PLUGIN",
      ]
    `)
    expect(userConfig.endpoints?.map((_) => _.key)).toMatchInlineSnapshot(`
      [
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
        "UserGoogleAuth",
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
