import type { FictionSiteBuilderSettings } from '../index.js'
import { AnalyticsWidget } from '@fiction/admin/dashboard/widget'
import { vue } from '@fiction/core'

export function getWidgets(_service: FictionSiteBuilderSettings) {
  const sites = new AnalyticsWidget({
    key: 'sites',
    title: 'Sites',
    description: 'Your websites and their status',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./WidgetSites.vue')),
    layoutHandling: 'chart',
  })

  return { sites }
}
