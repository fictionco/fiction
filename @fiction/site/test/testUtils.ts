import type { TestUtils } from '@fiction/core/test-utils/init'
import type { CardConfigPortable, Theme } from '../index.js'

import { FictionAdmin } from '@fiction/admin'
import { FictionAnalytics } from '@fiction/analytics/index.js'
import FSite from '@fiction/cards/CardSite.vue'
import { FictionCards } from '@fiction/cards/index.js'
import { AppRoute, FictionApp, FictionAws, FictionMedia, FictionRouter, getEnvVars, randomBetween, shortId, waitFor } from '@fiction/core'
import { runServicesSetup } from '@fiction/core/plugin-env/entry'
import { testEnvFile } from '@fiction/core/test-utils'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { FictionOnboard } from '@fiction/onboard/index.js'
import { FictionAi } from '@fiction/plugin-ai'
import { FictionContact } from '@fiction/plugin-contact'
import { FictionTransactions } from '@fiction/plugin-transactions'
import { FictionPosts } from '@fiction/posts/index.js'
import * as minimalTheme from '@fiction/theme-minimal'

import { FictionSites } from '../index.js'
import { Site } from '../site.js'
import * as testTheme from './test-theme'
import { setup } from './testUtils.main.js'

export type SiteTestUtils = TestUtils & {
  fictionSites: FictionSites
  fictionCards: FictionCards
  fictionRouterSites: FictionRouter
  fictionAppSites: FictionApp
  fictionMedia: FictionMedia
  fictionPosts: FictionPosts
  fictionAws: FictionAws
  fictionAi: FictionAi
  fictionTransactions: FictionTransactions
  fictionContact: FictionContact
  fictionAdmin: FictionAdmin
  fictionOnboard: FictionOnboard
  fictionAnalytics: FictionAnalytics
  runApp: (args: { context: 'app' | 'node', isProd?: boolean }) => Promise<void>
  close: () => Promise<void>
  createSite: (args?: { themeId?: string, pages?: CardConfigPortable[] }) => Promise<Site>
}

export async function createSiteTestUtils(args: {
  mainFilePath?: string
  context?: 'node' | 'app'
  themes?: Theme[]
  delaySiteRouterCreation?: boolean
} = {}): Promise<SiteTestUtils> {
  const { mainFilePath, context = 'node', delaySiteRouterCreation = false } = args

  const testUtils = createTestUtils({ mainFilePath, envFiles: [testEnvFile], ...args })

  const envVarNames = [
    'AWS_BUCKET_MEDIA',
    'AWS_ACCESS_KEY',
    'AWS_ACCESS_KEY_SECRET',
    'FLY_API_TOKEN',
    'OPENAI_API_KEY',
    'CLICKHOUSE_URL',
    'PROXYCURL_API_KEY',
  ] as const
  const v = getEnvVars(testUtils.fictionEnv, envVarNames)

  const fictionEnv = testUtils.fictionEnv

  const { awsAccessKey, awsAccessKeySecret, openaiApiKey, awsBucketMedia, proxycurlApiKey } = v

  const routes = [new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: FSite })]

  const out = { ...testUtils } as Partial<SiteTestUtils> & TestUtils
  const sitePort = randomBetween(10000, 50000)
  const cdnUrl = 'https://media.fiction.com'

  const clickhouseUrl = v.clickhouseUrl

  out.fictionAnalytics = new FictionAnalytics({ ...out, clickhouseUrl, beaconPort: 8080 })
  out.fictionAi = new FictionAi({ ...out, openaiApiKey })
  out.fictionAws = new FictionAws({ fictionEnv, awsAccessKey, awsAccessKeySecret })
  out.fictionMedia = new FictionMedia({ ...out, fictionAws: out.fictionAws, awsBucketMedia, cdnUrl })
  out.fictionTransactions = new FictionTransactions({ ...out })
  out.fictionRouterSites = new FictionRouter({
    routerId: 'siteRouter',
    fictionEnv,
    baseUrl: 'https://www.test.com',
    routes,
    // regular tests need initialized router
    // ux test needs to delay if testing editor as it creates in memoryMode to prevent browser interaction
    create: !delaySiteRouterCreation,
  })
  out.fictionAppSites = new FictionApp({ port: sitePort, ...out, fictionRouter: out.fictionRouterSites, isTest: true, liveUrl: 'https://*.test.com', localHostname: '*.lan.com' })
  out.fictionAdmin = new FictionAdmin({ ...(out as SiteTestUtils), proxycurlApiKey })
  out.fictionContact = new FictionContact({ ...(out as SiteTestUtils) })

  out.fictionPosts = new FictionPosts({ ...(out as SiteTestUtils) })

  const themes = async () => Promise.all([
    minimalTheme.theme,
    testTheme.theme,
    ...(args.themes || []),
  ])

  out.fictionSites = new FictionSites({ ...(out as SiteTestUtils), themes })
  out.fictionCards = new FictionCards({ ...out, fictionSites: out.fictionSites, fictionRouterSites: out.fictionRouterSites })

  out.fictionOnboard = new FictionOnboard({ ...(out as SiteTestUtils), proxycurlApiKey: v.proxycurlApiKey })

  await runServicesSetup(out, { context: 'test' })

  out.fictionEnv.log.info(`Site Test Utils Created (${context})`)

  out.createSite = async (args: { themeId?: string, pages?: CardConfigPortable[] } = {}) => {
    const { themeId = 'test', pages = [] } = args
    const service = out as SiteTestUtils
    const siteRouter = service.fictionRouterSites
    const fictionSites = service.fictionSites
    return Site.create({ siteRouter, fictionSites, themeId, isProd: false, siteId: `test-${shortId()}`, pages })
  }

  const runOnStart = async (args: { context: 'app' | 'node', isProd?: boolean }) => {
    const { context } = args
    await out.fictionAnalytics?.init()
    // wait out.fictionSites?.ensureAppDefaults({ context, defaultId: 'test' })
  }

  out.init = async () => {
    const r = await testUtils.init()
    await runOnStart({ context })
    return r
  }

  out.runApp = async (args) => {
    const r = await testUtils.runApp(args)
    await runOnStart({ context })
    return r
  }

  out.close = async () => {
    await waitFor(100)
    await out.fictionAnalytics?.close()
    await testUtils.close()
  }

  return out as SiteTestUtils
}

export async function createSiteUiTestingKit(args: { initUser?: boolean, headless?: boolean, slowMo?: number } = {}) {
  return createUiTestingKit({ ...args, setup })
}
