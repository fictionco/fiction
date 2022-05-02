import { createRequire } from "module"
import path from "path"
import { expect, it, describe, beforeAll } from "vitest"
import * as mainFile from "@factor/site"
import { getMainFilePath } from "@factor/api/utils"

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
      '"/Users/arpowers/Projects/factor/@factor/site/src/index.ts"',
    )
  })

  it("gets correct server entry config", async () => {
    expect(mainFile.factorServer.endpoints?.map((_) => _.key).sort())
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
  })
})
