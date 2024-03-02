import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { compileApplication } from '@factor/api/plugin-env/entry'
import type { MainFile } from '@factor/api/plugin-env/types'
import * as mainFile from '../src'

const require = createRequire(import.meta.url)
describe('user config', () => {
  it('gets correct client-side user config', async () => {
    const mainFilePath = require.resolve('@factor/www')
    const mainFileImports = (await import(mainFilePath)) as MainFile

    const serviceConfig = await mainFileImports.setup()
    await compileApplication({ context: 'node', serviceConfig, cliVars: {} })

    expect(
      mainFile.factorApp?.factorRouter.routes.value?.length,
    ).toMatchInlineSnapshot(`7`)
  })

  it('gets correct server user config', async () => {
    expect(mainFile.factorServer.port).toBeTruthy()

    expect(mainFile.factorServer.endpoints?.map(_ => _.key))
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
          "ManageOrganization",
          "ManageMemberRelation",
          "GenerateApiSecret",
          "FindOneOrganization",
          "OrganizationsByUserId",
          "UpdateOrganizationMemberStatus",
          "ManageOnboard",
          "ManageCustomer",
          "ListSubscriptions",
          "GetInvoices",
          "ManageSubscription",
          "ManagePaymentMethod",
          "GetCustomerData",
          "AllProducts",
          "GetProduct",
          "GetCoupon",
          "ManageUsage",
          "stripeWebhooks",
          "oAuthEndpoint",
          "SaveMedia",
          "MediaIndex",
          "ManageMedia",
          "Unsplash",
        ]
      `)
    expect(mainFile.factorApp.factorRouter.routes.value?.map(_ => _.name))
      .toMatchInlineSnapshot(`
        [
          "home",
          "plugins",
          "showcase",
          "showcaseSingle",
          "install",
          "testing",
          "testInputs",
        ]
      `)
  })
})
