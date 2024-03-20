import { AppRoute, type ServiceConfig, type ServiceList } from '@fiction/core'
import type { SiteTestUtils } from '../../../test/siteTestUtils'
import { createSiteTestUtils } from '../../../test/siteTestUtils'
import FiSite from '../../../engine/FiSite.vue'

export function setup(args: { context?: 'node' | 'app' } = {}): ServiceConfig & { testUtils: SiteTestUtils } {
  const { context = 'app' } = args
  const mainFilePath = new URL(import.meta.url).pathname

  const testUtils = createSiteTestUtils({ mainFilePath, context })

  testUtils.fictionRouter.update([
    new AppRoute({ name: 'dash', path: '/app/:viewId?/:itemId?', component: FiSite, props: { siteRouter: testUtils.fictionRouter, themeId: 'admin' } }),
    new AppRoute({ name: 'engine', path: '/:viewId?/:itemId?', component: FiSite, props: { siteRouter: testUtils.fictionRouter, themeId: 'fiction' } }),
  ])

  return {
    testUtils,
    fictionEnv: testUtils.fictionEnv,
    runCommand: async (args) => {
      await testUtils.runApp(args)
    },
    createService: async () => testUtils as ServiceList,
    createMount: async (args) => {
      return await testUtils.fictionApp.mountApp(args)
    },
  }
}
