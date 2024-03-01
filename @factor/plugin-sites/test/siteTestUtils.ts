import { AppRoute, FactorApp, FactorAws, FactorMedia, FactorRouter, randomBetween } from '@factor/api'
import { FactorAi } from '@factor/plugin-ai'
import type { TestUtils } from '@factor/api/test-utils/init'
import { createTestUtils } from '@factor/api/test-utils/init'
import { FactorAdmin } from '@factor/plugin-admin'
import { testEnvFile } from '@factor/api/test-utils'
import { FactorSites } from '..'
import SiteRender from '../engine/XSite.vue'
import { setup as testThemeSetup } from './test-theme'

export type SiteTestUtils = TestUtils & {
  factorAdmin: FactorAdmin
  factorSites: FactorSites
  factorRouterSites: FactorRouter
  factorAppSites: FactorApp
  factorMedia: FactorMedia
  factorAws: FactorAws
  factorAi: FactorAi
}
export async function createSiteTestUtils(): Promise<SiteTestUtils> {
  const testUtils = await createTestUtils({ envFiles: [testEnvFile], checkEnvVars: [
    'AWS_ACCESS_KEY',
    'AWS_ACCESS_KEY_SECRET',
    'FLY_API_TOKEN',
    'OPENAI_API_KEY',
  ] })
  const factorEnv = testUtils.factorEnv

  const awsAccessKey = factorEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = factorEnv.var('AWS_ACCESS_KEY_SECRET')
  const flyIoApiToken = factorEnv.var('FLY_API_TOKEN')
  const openaiApiKey = factorEnv.var('OPENAI_API_KEY')

  const flyIoAppId = 'fiction-sites'
  const routes = [
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: SiteRender }),
  ]

  const out = { ...testUtils } as Partial<SiteTestUtils> & TestUtils

  out.factorAi = new FactorAi({ ...out, openaiApiKey })
  out.factorAws = new FactorAws({ factorEnv, awsAccessKey, awsAccessKeySecret })
  out.factorMedia = new FactorMedia({ ...out, factorAws: out.factorAws, bucket: 'factor-tests' })
  out.factorRouterSites = new FactorRouter({ routerId: 'siteRouter', factorEnv, baseUrl: 'https://www.test.com', routes, create: true })
  out.factorAppSites = new FactorApp({
    port: randomBetween(10_000, 20_000),
    ...out,
    factorRouter: out.factorRouterSites,
    isTest: true,
    liveUrl: 'https://*.test.com',
    localHostname: '*.lan.com',
  })
  out.factorAdmin = new FactorAdmin(out)

  out.factorSites = new FactorSites({ ...(out as SiteTestUtils), factorAdmin: out.factorAdmin, flyIoApiToken, flyIoAppId })

  out.factorSites.themes.value = [...out.factorSites.themes.value, testThemeSetup(out)]

  out.factorEnv.log.info('sites test utils created')

  return out as SiteTestUtils
}
