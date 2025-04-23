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
        "fictionRevision",
        "fictionUser",
        "fictionMonitor",
        "fictionAnalytics",
        "fictionCache",
        "fictionAppSites",
        "fictionStripe",
        "fictionRouterSites",
        "fictionAws",
        "fictionMedia",
        "fictionAi",
        "fictionTransactions",
        "fictionAdmin",
        "fictionForms",
        "fictionBrand",
        "fictionSites",
        "fictionCards",
        "fictionTeam",
        "fictionUi",
        "fictionContact",
        "fictionNewsletter",
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
          "CheckHandle",
          "ManageUser",
          "ManageOrganization",
          "ManageMemberRelation",
          "OrganizationsByUserId",
          "GetTopValues",
          "ManageRevision",
          "CompiledMetrics",
          "EventTrack",
          "MetricAnalytics",
          "GetDimensionList",
          "GetClientSessions",
          "GetTotalSessions",
          "SaveMedia",
          "MediaIndex",
          "ManageMedia",
          "EmailAction",
          "ManageVectors",
          "AiCompletion",
          "AiImage",
          "ManageCustomer",
          "PortalSession",
          "CheckoutSession",
          "StripeTrial",
          "oAuthEndpoint",
          "hostnameVerify",
          "CardQuery",
          "ManageSite",
          "ManageSites",
          "ManagePage",
          "ManageDomain",
          "OrgMembers",
          "TeamInvite",
          "SeekInviteFromUser",
          "ManageForm",
          "ManageSubmission",
          "ManageContact",
          "SubscriptionAnalytics",
          "ManagePost",
          "ManageCampaign",
          "ManageSend",
          "emailTrackingEndpoint",
          "ManageBrandGuide",
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
          "dash",
          "engine",
          "renderTest",
          "sitePreview",
        ]
      `)
  })
})
