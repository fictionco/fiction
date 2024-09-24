import type { FictionApp, FictionEnv } from '@fiction/core'
import type { MainFile, ServiceList } from '@fiction/core/plugin-env/types.js'
import { compileApplication } from '@fiction/core/plugin-env/entry.js'
import { describe, expect, it } from 'vitest'
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
        "fictionForms",
        "fictionAnalytics",
        "fictionSites",
        "fictionTeam",
        "fictionUi",
        "fictionStripe",
        "fictionSubscribe",
        "fictionSend",
        "fictionPosts",
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
          "ManageCustomer",
          "ListSubscriptions",
          "GetCustomerData",
          "oAuthEndpoint",
          "GetDimensionList",
          "GetClientSessions",
          "GetTotalSessions",
          "CardQuery",
          "ManageSite",
          "ManageSites",
          "ManagePage",
          "ManageCert",
          "OrgMembers",
          "TeamInvite",
          "SeekInviteFromUser",
          "ManageForm",
          "ManageSubmission",
          "ManageSubscription",
          "SubscriptionAnalytics",
          "ManagePost",
          "ManagePostIndex",
          "ManageTaxonomy",
          "ManageCampaign",
          "ManageSend",
          "posts",
          "SubscriptionAnalytics",
        ]
      `)

    expect(service.fictionApp.settings.fictionRouter.routes.value?.map(_ => _.name))
      .toMatchInlineSnapshot(`
        [
          "buttonsDemo",
          "chartTest",
          "email",
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
