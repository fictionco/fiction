import type { MainFileSetup } from '@fiction/core'
import { AppRoute, FictionApp, FictionAws, FictionMedia, FictionRouter, isCi, randomBetween } from '@fiction/core'
import { FictionAi } from '@fiction/plugin-ai'
import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'
import { testEnvFile } from '@fiction/core/test-utils'
import FSite from '@fiction/cards/CardSite.vue'
import { runServicesSetup } from '@fiction/core/plugin-env/entry'
import type { performActions } from '@fiction/core/test-utils/buildTest'
import { createTestBrowser } from '@fiction/core/test-utils/buildTest'
import type { Browser } from 'playwright'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import type { ThemeSetup } from '..'
import { FictionSites } from '..'
import * as testTheme from './test-theme'
import { setup as mainFileSetup } from './siteTestMainFile'

export type SiteTestUtils = TestUtils & {
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  fictionAppSites: FictionApp
  fictionMedia: FictionMedia
  fictionAws: FictionAws
  fictionAi: FictionAi
  runApp: (args: { context: 'app' | 'node', isProd?: boolean }) => Promise<void>
  close: () => Promise<void>
}
export async function createSiteTestUtils(args: { mainFilePath?: string, context?: 'node' | 'app', themes?: ThemeSetup[] } = {}): Promise<SiteTestUtils> {
  const { mainFilePath, context = 'node', themes = [] } = args

  const testUtils = createTestUtils({
    mainFilePath,
    envFiles: [testEnvFile],
    ...args,
    checkEnvVars: context === 'node'
      ? [
          'AWS_ACCESS_KEY',
          'AWS_ACCESS_KEY_SECRET',
          'FLY_API_TOKEN',
          'OPENAI_API_KEY',
        ]
      : [],
  })
  const fictionEnv = testUtils.fictionEnv

  const awsAccessKey = fictionEnv.var('AWS_ACCESS_KEY')
  const awsAccessKeySecret = fictionEnv.var('AWS_ACCESS_KEY_SECRET')
  const flyIoApiToken = fictionEnv.var('FLY_API_TOKEN')
  const openaiApiKey = fictionEnv.var('OPENAI_API_KEY')

  const flyIoAppId = 'fiction-sites'

  const routes = [
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: FSite }),
  ]

  const out = { ...testUtils } as Partial<SiteTestUtils> & TestUtils

  out.fictionAi = new FictionAi({ ...out, openaiApiKey })
  out.fictionAws = new FictionAws({ fictionEnv, awsAccessKey, awsAccessKeySecret })
  out.fictionMedia = new FictionMedia({ ...out, fictionAws: out.fictionAws, bucket: 'factor-tests' })
  out.fictionRouterSites = new FictionRouter({ routerId: 'siteRouter', fictionEnv, baseUrl: 'https://www.test.com', routes, create: true })
  out.fictionAppSites = new FictionApp({
    port: randomBetween(1100, 50_000),
    ...out,
    fictionRouter: out.fictionRouterSites,
    isTest: true,
    liveUrl: 'https://*.test.com',
    localHostname: '*.lan.com',
  })

  out.fictionSites = new FictionSites({
    ...(out as SiteTestUtils),
    flyIoApiToken,
    flyIoAppId,
    themes: () => Promise.all([testTheme.setup(out), ...themes.map(_ => _(out))]),
  })

  await runServicesSetup(out, { context: 'test' })

  out.fictionEnv.log.info('sites test utils created')

  // out.runApp = async (args: { isProd?: boolean, context?: 'app' | 'node' }) => {
  //   const { context } = args

  //   const { isProd = false } = args
  //   await out.fictionDb.init()
  //   const srv = await out.fictionServer.initServer({ useLocal: true, fictionUser: out.fictionUser })

  //   const port = out.fictionApp.port.value = out.fictionServer.port.value

  //   await out.fictionApp.ssrServerSetup({ expressApp: srv?.expressApp, isProd })

  //   await srv?.run()

  //   out.fictionApp.logReady({ serveMode: 'comboSSR' })

  //   return { port }
  // }

  out.close = async () => {
    await testUtils.close()
  }

  return out as SiteTestUtils
}

export async function createSiteUiTestingKit(args: { headless?: boolean, setup?: MainFileSetup } = {}) {
  return createUiTestingKit({ ...args, setup: mainFileSetup })
}
