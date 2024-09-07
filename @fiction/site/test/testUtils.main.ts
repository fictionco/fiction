import { FictionAdmin } from '@fiction/admin'
import * as adminTheme from '@fiction/admin/theme'
import CardSite from '@fiction/cards/CardSite.vue'
import { AppRoute, type ServiceConfig } from '@fiction/core'
import * as fictionTheme from '@fiction/theme-fiction'
import { createSiteTestUtils } from './testUtils'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const { context = 'app' } = args
  const mainFilePath = new URL(import.meta.url).pathname

  const testUtils = await createSiteTestUtils({
    mainFilePath,
    context,
    themes: [fictionTheme.setup, adminTheme.setup],
    delaySiteRouterCreation: true, // created on editor start
  })

  const siteRouter = testUtils.fictionRouter
  const component = CardSite
  testUtils.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'admin' } }),
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'fiction' } }),
  ])

  const fictionAdmin = new FictionAdmin({ ...testUtils })

  const service = { ...testUtils, fictionAdmin }

  return {
    runVars: { },
    service,
    runCommand: async args => service.runApp(args),
    createMount: async args => service.fictionApp.mountApp(args),
    close: async () => service.close(),
  } satisfies ServiceConfig
}
