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
        "fictionAdmin",
        "fictionSites",
        "fictionCards",
        "fictionThemes",
        "fictionTeam",
        "fictionUi",
        "fictionContact",
        "fictionPosts",
        "fictionOnboard",
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
          "ManageUserEmail",
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
          "QueryAi",
          "ManageCustomer",
          "PortalSession",
          "CheckoutSession",
          "StripeTrial",
          "oAuthEndpoint",
          "ManageContact",
          "SubscriptionAnalytics",
          "OrgMembers",
          "TeamInvite",
          "CardQuery",
          "ManageSite",
          "ManageSites",
          "ManagePage",
          "ManageDomain",
          "ManagePost",
          "PostComments",
          "PostLikes",
          "emailTrackingEndpoint",
          "ManageOnboard",
        ]
      `)

    expect(service.fictionApp.settings.fictionRouter.routes.value?.map(_ => _.name))
      .toMatchInlineSnapshot(`
        [
          "dash",
          "engine",
          "renderTest",
          "sitePreview",
          "postPreview",
          "postPreview",
        ]
      `)
  })
})
