import { AppRoute, type ServiceConfig, type ServiceList } from '@fiction/core'

import * as adminTheme from '@fiction/admin/theme'
import FSite from '@fiction/cards/CardSite.vue'
import { createSiteTestUtils } from '@fiction/site/test/siteTestUtils.js'
import { FictionEmailActions } from '@fiction/plugin-email-actions'
import { crossVar } from '@fiction/core/utils/vars'
import { FictionAdmin } from '../../index.js'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const { context = 'node' } = args
  const mainFilePath = new URL(import.meta.url).pathname



  console.warn('SERVER_PORT', crossVar.get('SERVER_PORT'), context)

  const testUtils = await createSiteTestUtils({ mainFilePath, context, themes: [adminTheme.setup] })

  testUtils.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/:viewId?/:itemId?', component: FSite, props: { siteRouter: testUtils.fictionRouter, themeId: 'admin' } }),
  ])

  const fictionEmailActions = new FictionEmailActions({ ...testUtils })
  const fictionAdmin = new FictionAdmin({ ...testUtils, fictionEmailActions })

  const service = { ...testUtils, fictionEmailActions, fictionAdmin }

  return {
    service,
    fictionEnv: service.fictionEnv,
    runCommand: async args => service.runApp(args),
    createService: async () => service as ServiceList,
    createMount: args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
