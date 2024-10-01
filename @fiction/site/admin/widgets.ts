import type { SitesPluginSettings } from '..'

import { AnalyticsWidget, Widget } from '@fiction/admin/dashboard/widget'
import { vue } from '@fiction/core'

export function getWidgets(service: SitesPluginSettings) {
  const siteVisitors = new AnalyticsWidget({
    key: 'siteVisitors',
    title: 'Visitors',
    description: 'Unique visitors to your site',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('@fiction/admin/dashboard/WidgetChart.vue')),
    layoutHandling: 'chart',
  })

  const siteReferrers = new AnalyticsWidget({
    key: 'siteReferrers',
    title: 'Referrers',
    description: 'Where your visitors are coming from',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('@fiction/admin/dashboard/WidgetChart.vue')),
    layoutHandling: 'chart',
  })

  const sitesWelcome = new Widget({
    key: 'sitesWelcome',
    title: 'Welcome to Sites',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('@fiction/admin/dashboard/WidgetVideo.vue')),
  })

  return { siteVisitors, siteReferrers, sitesWelcome }
}
