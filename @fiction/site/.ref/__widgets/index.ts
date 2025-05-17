import { AnalyticsWidget } from '@fiction/admin/widgets/__widget'
import { vue } from '@fiction/core'

export function getWidgets() {
  const sites = new AnalyticsWidget({
    key: 'sites',
    title: 'Website',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./WidgetSites.vue')),
    layoutHandling: 'chart',
    priority: 15,
  })

  return { sites }
}
