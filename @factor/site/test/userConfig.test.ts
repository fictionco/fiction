import { createRequire } from "module"
import { describe, it, expect } from "@factor/api/testUtils"
import { compileApplication } from "@factor/api/plugin-env/entry"
import * as mainFile from "../src"
const require = createRequire(import.meta.url)
describe("user config", () => {
  it("gets correct client-side user config", async () => {
    const mainFilePath = require.resolve("@factor/site")

    await compileApplication({
      mainFilePath,
      isApp: true,
    })

    expect(
      mainFile.factorApp.factorRouter.routes.value?.length,
    ).toMatchInlineSnapshot("12")
  })

  it("gets correct server user config", async () => {
    expect(mainFile.factorServer.port).toBeTruthy()

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
    expect(mainFile.factorApp.factorRouter.routes.value?.map((_) => _.name))
      .toMatchInlineSnapshot(`
        [
          "home",
          "plugins",
          "showcase",
          "showcaseSingle",
          "install",
          "testing",
          "blog",
          "docs",
          "blogIndex",
          "blogSingle",
          "docsIndex",
          "docsSingle",
        ]
      `)
  })
})
