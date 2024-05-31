import { AppRoute, type ServiceConfig, type ServiceList } from '@fiction/core'

import * as adminTheme from '@fiction/admin/theme'
import FSite from '@fiction/cards/CardSite.vue'
import { createSiteTestUtils } from '@fiction/site/test/testUtils.js'
import { FictionEmailActions } from '@fiction/plugin-email-actions'
import { FictionAdmin } from '../index.js'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const { context = 'node' } = args
  const mainFilePath = new URL(import.meta.url).pathname

  const testUtils = await createSiteTestUtils({ mainFilePath, context, themes: [adminTheme.setup] })

  testUtils.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/:viewId?/:itemId?', component: FSite, props: { siteRouter: testUtils.fictionRouter, themeId: 'admin' } }),
  ])

  const fictionAdmin = new FictionAdmin({ ...testUtils })

  const service = { ...testUtils, fictionAdmin }

  return {
    runVars: { },
    service,
    runCommand: async args => service.runApp(args),
    createMount: args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
