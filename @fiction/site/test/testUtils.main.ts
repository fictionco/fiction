import { AppRoute, type ServiceConfig } from '@fiction/core'
import CardSite from '@fiction/cards/CardSite.vue'
import * as fictionTheme from '@fiction/theme-fiction'
import * as adminTheme from '@fiction/admin/theme'
import { createSiteTestUtils } from './testUtils'

export async function setup(args: { context?: 'node' | 'app' } = {}) {
  const { context = 'app' } = args
  const mainFilePath = new URL(import.meta.url).pathname

  const service = await createSiteTestUtils({ mainFilePath, context, themes: [fictionTheme.setup, adminTheme.setup] })

  const siteRouter = service.fictionRouter
  const component = CardSite
  service.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'admin' } }),
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component, props: { siteRouter, themeId: 'fiction' } }),
  ])

  return {
    runVars: { },
    service,
    runCommand: async args => service.runApp(args),
    createMount: args => service.fictionApp.mountApp(args),
  } satisfies ServiceConfig
}
