import { AppRoute, FictionApp, FictionAws, FictionMedia, FictionRouter, randomBetween } from '@fiction/core'
import { FictionAi } from '@fiction/plugin-ai'
import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { FictionAdmin } from '@fiction/plugin-admin'
import { testEnvFile } from '@fiction/core/test-utils'
import { FictionSites } from '..'
import SiteRender from '../engine/XSite.vue'
import { setup as testThemeSetup } from './test-theme'

export type SiteTestUtils = TestUtils & {
  fictionAdmin: FictionAdmin
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  fictionAppSites: FictionApp
  fictionMedia: FictionMedia
  fictionAws: FictionAws
  fictionAi: FictionAi
}
export async function createSiteTestUtils(): Promise<SiteTestUtils> {
  const testUtils = await createTestUtils({ envFiles: [testEnvFile], checkEnvVars: [
    'AWS_ACCESS_KEY',
    'AWS_ACCESS_KEY_SECRET',
    'FLY_API_TOKEN',
    'OPENAI_API_KEY',
  ] })
  const fictionEnv = testUtils.fictionEnv

  const awsAccessKey = fictionEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = fictionEnv.var('AWS_ACCESS_KEY_SECRET')
  const flyIoApiToken = fictionEnv.var('FLY_API_TOKEN')
  const openaiApiKey = fictionEnv.var('OPENAI_API_KEY')

  const flyIoAppId = 'fiction-sites'
  const routes = [
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: SiteRender }),
  ]

  const out = { ...testUtils } as Partial<SiteTestUtils> & TestUtils

  out.fictionAi = new FictionAi({ ...out, openaiApiKey })
  out.fictionAws = new FictionAws({ fictionEnv, awsAccessKey, awsAccessKeySecret })
  out.fictionMedia = new FictionMedia({ ...out, fictionAws: out.fictionAws, bucket: 'fiction-tests' })
  out.fictionRouterSites = new FictionRouter({ routerId: 'siteRouter', fictionEnv, baseUrl: 'https://www.test.com', routes, create: true })
  out.fictionAppSites = new FictionApp({
    port: randomBetween(10_000, 20_000),
    ...out,
    fictionRouter: out.fictionRouterSites,
    isTest: true,
    liveUrl: 'https://*.test.com',
    localHostname: '*.lan.com',
  })
  out.fictionAdmin = new FictionAdmin(out)

  out.fictionSites = new FictionSites({ ...(out as SiteTestUtils), fictionAdmin: out.fictionAdmin, flyIoApiToken, flyIoAppId })

  out.fictionSites.themes.value = [...out.fictionSites.themes.value, testThemeSetup(out)]

  out.fictionEnv.log.info('sites test utils created')

  return out as SiteTestUtils
}
