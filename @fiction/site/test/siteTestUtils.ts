import { AppRoute, FictionApp, FictionAws, FictionMedia, FictionRouter, randomBetween } from '@fiction/core'
import { FictionAi } from '@fiction/plugin-ai'
import type { TestUtils } from '@fiction/core/test-utils/init'
import { createTestUtils } from '@fiction/core/test-utils/init'
import type { FictionAdmin } from '@fiction/plugin-admin'
import { testEnvFile } from '@fiction/core/test-utils'
import { FictionSites } from '..'
import FSite from '../engine/FSite.vue'
import { setup as testThemeSetup } from './test-theme'

export type SiteTestUtils = TestUtils & {
  fictionAdmin: FictionAdmin
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  fictionAppSites: FictionApp
  fictionMedia: FictionMedia
  fictionAws: FictionAws
  fictionAi: FictionAi
  runApp: (args: { context: 'app' | 'node' }) => Promise<{ port: number }>
  close: () => Promise<void>
}
export function createSiteTestUtils(args: { mainFilePath?: string, context?: 'node' | 'app' } = {}): SiteTestUtils {
  const { mainFilePath, context = 'node' } = args

  const testUtils = createTestUtils({
    mainFilePath,
    envFiles: [testEnvFile],
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

  out.fictionSites = new FictionSites({ ...(out as SiteTestUtils), flyIoApiToken, flyIoAppId, themes: [testThemeSetup(out)] })

  out.fictionEnv.log.info('sites test utils created')

  out.runApp = async () => {
    await out.fictionDb.init()
    const srv = await out.fictionServer.initServer({ useLocal: true, fictionUser: out.fictionUser })

    await out.fictionApp.ssrServerSetup({
      expressApp: srv?.expressApp,
      isProd: false,
    })

    await srv?.run()

    out.fictionApp.logReady({ serveMode: 'comboSSR' })

    return { port: out.fictionServer.port.value }
  }

  out.close = async () => {
    await testUtils.close()
  }

  return out as SiteTestUtils
}
