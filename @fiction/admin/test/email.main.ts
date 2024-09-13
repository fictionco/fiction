import type { FictionAi } from '@fiction/plugin-ai/index.js'
import CardSite from '@fiction/cards/CardSite.vue'
import { AppRoute, type ServiceConfig } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils.js'
import { FictionAdmin } from '../index.js'
import * as adminTheme from '../theme'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const { context = 'node' } = args
  const mainFilePath = new URL(import.meta.url).pathname

  const testUtils = await createSiteTestUtils({ mainFilePath, context, themes: [adminTheme.setup] }) satisfies { fictionAi: FictionAi }

  const siteRouter = testUtils.fictionRouter
  const component = CardSite

  testUtils.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'admin' } }),
  ])

  const fictionAdmin = new FictionAdmin({ ...testUtils })

  const service = { ...testUtils, fictionAdmin }

  return {
    runVars: { },
    service,
    runCommand: async args => service.runApp(args),
    createMount: async args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
