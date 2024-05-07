import { AppRoute, type ServiceConfig, type ServiceList } from '@fiction/core'
import FSite from '@fiction/cards/CardSite.vue'
import * as fictionTheme from '@fiction/theme-fiction'
import * as adminTheme from '@fiction/admin/theme'
import { createSiteTestUtils } from './siteTestUtils'

export async function setup(args: { context?: 'node' | 'app' } = {}): Promise<ServiceConfig> {
  const { context = 'app' } = args
  const mainFilePath = new URL(import.meta.url).pathname

  const service = await createSiteTestUtils({ mainFilePath, context, themes: [fictionTheme.setup, adminTheme.setup] })

  service.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component: FSite, props: { siteRouter: service.fictionRouter, themeId: 'admin' } }),
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: FSite, props: { siteRouter: service.fictionRouter, themeId: 'fiction' } }),
  ])

  return {
    service,
    fictionEnv: service.fictionEnv,
    runCommand: async args => service.runApp(args),
    createService: async () => service as ServiceList,
    createMount: args => service.fictionApp.mountApp(args),
  }
}
