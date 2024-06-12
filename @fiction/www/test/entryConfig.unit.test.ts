import { describe, expect, it } from 'vitest'
import { compileApplication } from '@fiction/core/plugin-env/entry.js'
import type { MainFile, ServiceList } from '@fiction/core/plugin-env/types.js'
import type { FictionApp, FictionEnv } from '@fiction/core'
import { setup } from '../src/index.js'

describe('user config', async () => {
  const serviceConfig = setup()
  const service = serviceConfig.service as { fictionApp: FictionApp, fictionEnv: FictionEnv } & ServiceList

  it('gets correct client-side user config', async () => {
    const mainFileImports = (await import('../src/index.js')) as MainFile

    const serviceConfig = await mainFileImports.setup()
    const service = await compileApplication({ serviceConfig, context: 'node', cliVars: {} })

    expect(
      Object.keys(service || {}),
    ).toMatchInlineSnapshot(`
      [
        "fictionEnv",
        "fictionApp",
        "fictionServer",
        "fictionDb",
        "fictionEmail",
        "fictionRouter",
        "fictionUser",
        "fictionMonitor",
        "fictionCache",
        "fictionAppSites",
        "fictionRouterSites",
        "fictionAws",
        "fictionMedia",
        "fictionAi",
        "fictionTransactions",
        "fictionAdmin",
        "fictionSites",
        "fictionTeam",
        "fictionUi",
        "fictionStripe",
        "fictionSubscribe",
        "fictionExtend",
      ]
    `)
  })

  it('gets correct server user config', async () => {
    expect(service.fictionServer?.port).toBeTruthy()

    expect(service.fictionServer?.endpoints?.map(_ => _.key))
      .toMatchInlineSnapshot(`
        [
          "CheckUsername",
          "ManageUser",
          "ManageOrganization",
          "ManageMemberRelation",
          "OrganizationsByUserId",
          "SaveMedia",
          "MediaIndex",
          "ManageMedia",
          "EmailAction",
          "ManageVectors",
          "AiCompletion",
          "AiImage",
          "ManageSubscription",
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
          "email",
          "themeMinimal",
          "testEditor",
          "testInputs",
          "dash",
          "engine",
          "renderTest",
          "emailTransaction",
          "sitePreview",
        ]
      `)
  })
})
