import { createRequire } from "module"
import { describe, it, expect } from "vitest"
import * as mainFile from "@factor/site"
import { getServerUserConfig, compileApplication } from "../../plugin-env/entry"
const require = createRequire(import.meta.url)
describe("user config", () => {
  it("gets correct client-side user config", async () => {
    const mainFilePath = require.resolve("@factor/site")

    const { userConfig } = await compileApplication({
      mainFilePath,
      isApp: true,
    })
    expect(userConfig.variables?.TEST_SERVER).toBeFalsy()
    expect(mainFile.factorApp.routes?.length).toMatchInlineSnapshot("12")
  })

  it("gets correct server user config", async () => {
    const userConfig = await getServerUserConfig({ moduleName: "@factor/site" })

    expect(mainFile.factorServer.port).toBeTruthy()
    expect(userConfig.variables?.TEST_SERVER).toBe("TEST")
    expect(Object.keys(userConfig.variables ?? {})).toMatchInlineSnapshot(`
      [
        "TEST_SERVER",
        "TEST_BLOG_PLUGIN",
      ]
    `)
    expect(mainFile.factorServer.endpoints?.map((_) => _.key))
      .toMatchInlineSnapshot(`
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
    expect(mainFile.factorApp.routes?.map((_) => _.name))
      .toMatchInlineSnapshot(`
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

    expect(mainFile.factorApp.serverOnlyImports).toMatchInlineSnapshot(`
      [
        {
          "id": "html-to-text",
        },
        {
          "id": "stripe",
        },
      ]
    `)
  })
})
