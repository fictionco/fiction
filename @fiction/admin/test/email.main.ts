import type { ServiceConfig } from '@fiction/core'
import type { FictionAi } from '@fiction/plugin-ai/index.js'
import CardSite from '@fiction/cards/CardSite.vue'
import { AppRoute } from '@fiction/core'
import { FictionStripe } from '@fiction/plugin-stripe/index.js'
import { createSiteTestUtils } from '@fiction/site/test/testUtils.js'
import * as adminTheme from '../theme/index.js'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const { context = 'node' } = args
  const mainFilePath = new URL(import.meta.url).pathname

  const testUtils = await createSiteTestUtils({ mainFilePath, context, themes: [adminTheme.theme] }) satisfies { fictionAi: FictionAi }

  const siteRouter = testUtils.fictionRouter
  const component = CardSite

  testUtils.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'admin' } }),
  ])

  // const fictionAdmin = new FictionAdmin({ ...testUtils })
  const fictionStripe = new FictionStripe({
    ...testUtils,
    secretKeyTest: testUtils.fictionEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyTest: testUtils.fictionEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    customerPortalUrl: '#',
    products: [{
      tier: 40,
      key: 'pro',
    }],
  })

  const service = { ...testUtils, fictionStripe }

  return {
    runVars: { },
    service,
    runCommand: async args => service.runApp(args),
    createMount: async args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
