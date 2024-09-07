import { FictionAdmin } from '@fiction/admin'
import FSite from '@fiction/cards/CardSite.vue'
import { AppRoute, FictionApp, FictionAws, FictionMedia, FictionRouter, getEnvVars, randomBetween, shortId } from '@fiction/core'
import { runServicesSetup } from '@fiction/core/plugin-env/entry'
import { testEnvFile } from '@fiction/core/test-utils'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import { FictionAi } from '@fiction/plugin-ai'
import { FictionSubscribe } from '@fiction/plugin-subscribe'
import { FictionTransactions } from '@fiction/plugin-transactions'
import * as minimalTheme from '@fiction/theme-minimal'
import type { TestUtils } from '@fiction/core/test-utils/init'
import { FictionSites } from '..'
import { Site } from '../site.js'
import * as testTheme from './test-theme'
import { setup } from './testUtils.main.js'
import type { ThemeSetup } from '../index.js'

export type SiteTestUtils = TestUtils & {
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  fictionAppSites: FictionApp
  fictionMedia: FictionMedia
  fictionAws: FictionAws
  fictionAi: FictionAi
  fictionTransactions: FictionTransactions
  fictionSubscribe: FictionSubscribe
  fictionAdmin: FictionAdmin
  runApp: (args: { context: 'app' | 'node', isProd?: boolean }) => Promise<void>
  close: () => Promise<void>
  createSite: (args?: { themeId?: string }) => Promise<Site>
}

export async function createSiteTestUtils(args: { mainFilePath?: string, context?: 'node' | 'app', themes?: ThemeSetup[], delaySiteRouterCreation?: boolean } = {}): Promise<SiteTestUtils> {
  const { mainFilePath, context = 'node', delaySiteRouterCreation = false } = args

  const testUtils = createTestUtils({ mainFilePath, envFiles: [testEnvFile], ...args })

  const envVarNames = ['AWS_BUCKET_MEDIA', 'AWS_ACCESS_KEY', 'AWS_ACCESS_KEY_SECRET', 'FLY_API_TOKEN', 'OPENAI_API_KEY'] as const
  const v = getEnvVars(testUtils.fictionEnv, envVarNames)

  const fictionEnv = testUtils.fictionEnv

  const { awsAccessKey, awsAccessKeySecret, flyApiToken, openaiApiKey, awsBucketMedia } = v
  const flyAppId = 'fiction-sites'

  const routes = [new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: FSite })]

  const out = { ...testUtils } as Partial<SiteTestUtils> & TestUtils
  const sitePort = randomBetween(1100, 50_000)
  const cdnUrl = 'https://media.fiction.com'
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
  out.fictionAdmin = new FictionAdmin({ ...(out as SiteTestUtils) })
  out.fictionSubscribe = new FictionSubscribe({ ...(out as SiteTestUtils) })

  const themes = async () => Promise.all([
    minimalTheme.setup(out),
    testTheme.setup(out),
    ...(args.themes || []).map(async _ => _(out as SiteTestUtils)),
  ])

  out.fictionSites = new FictionSites({ ...(out as SiteTestUtils), flyApiToken, flyAppId, themes })

  await runServicesSetup(out, { context: 'test' })

  out.fictionEnv.log.info(`Site Test Utils Created (${context})`)

  out.close = async () => testUtils.close()

  out.createSite = async (args: { themeId?: string } = {}) => {
    const { themeId = 'test' } = args
    const service = out as SiteTestUtils
    const siteRouter = service.fictionRouterSites
    const fictionSites = service.fictionSites
    return Site.create({ siteRouter, fictionSites, themeId, isProd: false, siteId: `test-${shortId()}` })
  }

  out.init = async () => {
    const r = await testUtils.init()
    await out.fictionSites?.ensureDefaults({ context: args.context, defaultId: 'test' })
    return r
  }

  out.runApp = async (args) => {
    const r = await testUtils.runApp(args)
    await out.fictionSites?.ensureDefaults({ context: args.context, defaultId: 'test' })
    return r
  }

  return out as SiteTestUtils
}

export async function createSiteUiTestingKit(args: { initUser?: boolean, headless?: boolean, slowMo?: number } = {}) {
  return createUiTestingKit({ ...args, setup })
}
