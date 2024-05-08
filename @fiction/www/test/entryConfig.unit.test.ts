import { describe, expect, it } from 'vitest'
import { compileApplication } from '@fiction/core/plugin-env/entry'
import type { MainFile } from '@fiction/core/plugin-env/types'
import { service } from '../src'

describe('user config', () => {
  it('gets correct client-side user config', async () => {
    const mainFileImports = (await import('../src/index')) as MainFile

    const serviceConfig = await mainFileImports.setup()
    const service = await compileApplication({ serviceConfig, context: 'node', cliVars: {} })

    expect(
      Object.keys(service || {}),
    ).toMatchInlineSnapshot(`
      [
        "fictionEnv",
        "fictionApp",
        "fictionRouter",
        "fictionServer",
        "fictionDb",
        "fictionUser",
        "fictionEmail",
        "fictionMonitor",
        "fictionAppSites",
        "fictionRouterSites",
        "fictionAws",
        "fictionMedia",
        "fictionAi",
        "fictionSites",
        "fictionTeam",
        "fictionUi",
        "fictionStripe",
        "fictionExtend",
      ]
    `)
  })

  it('gets correct server user config', async () => {
    expect(service.fictionServer.port).toBeTruthy()

    expect(service.fictionServer.endpoints?.map(_ => _.key))
      .toMatchInlineSnapshot(`
        [
          "CheckUsername",
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
          "SaveMedia",
          "MediaIndex",
          "ManageMedia",
          "ManageVectors",
          "AiCompletion",
          "AiImage",
          "ManageCustomer",
          "ListSubscriptions",
          "GetCustomerData",
          "oAuthEndpoint",
          "ManageSite",
          "ManageIndex",
          "ManagePage",
          "ManageCert",
          "OrgMembers",
          "TeamInvite",
          "SeekInviteFromUser",
          "ManagePost",
          "ManagePostIndex",
          "ManageTaxonomy",
        ]
      `)

    expect(service.fictionApp.settings.fictionRouter.routes.value?.map(_ => _.name))
      .toMatchInlineSnapshot(`
        [
          "themeMinimal",
          "testEditor",
          "testInputs",
          "dash",
          "engine",
          "renderTest",
          "sitePreview",
        ]
      `)
  })
})
