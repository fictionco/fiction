import { describe, expect, it } from 'vitest'
import { compileApplication } from '@factor/api/plugin-env/entry'
import type { MainFile } from '@factor/api/plugin-env/types'
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
        "factorEnv",
        "factorApp",
        "factorRouter",
        "factorServer",
        "factorDb",
        "factorUser",
        "factorEmail",
        "factorMonitor",
        "factorAppSites",
        "factorRouterSites",
        "factorAws",
        "factorMedia",
        "factorAdmin",
        "factorTeam",
        "factorUi",
      ]
    `)
  })

  it('gets correct server user config', async () => {
    expect(service.factorServer.port).toBeTruthy()

    expect(service.factorServer.endpoints?.map(_ => _.key))
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
          "OrgMembers",
          "TeamInvite",
          "SeekInviteFromUser",
          "ManageSite",
          "ManageIndex",
          "ManagePage",
          "ManageCert",
        ]
      `)

    expect(service.factorApp.factorRouter.routes.value?.map(_ => _.name))
      .toMatchInlineSnapshot(`
        [
          "testInputs",
          "dash",
          "engine",
          "sitePreview",
        ]
      `)
  })
})
