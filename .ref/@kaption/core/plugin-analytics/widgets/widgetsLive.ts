import { Widget } from '@factor/api/plugin-dashboards'
import type { KaptionPluginSettings } from '../../utils'
import { QueryVisitorLocation, QueryWidgetActiveUser } from './queryRealtime'

export function widgets(service: KaptionPluginSettings) {
  return [
    new Widget({
      params: { isRealtime: true, period: 'hour' },
      widgetKey: 'activeUsers',
      queryHandler: widget =>
        new QueryWidgetActiveUser({ key: 'activeUsers', service, widget }),
      layoutHandling: 'chart',
      title: 'Active Users',
      description: 'Watch traffic and behavior in realtime',
      el: () => import('./WidgetLiveUser.vue'),
      category: ['traffic'],
    }),
    new Widget({
      params: { isRealtime: true, period: 'hour' },
      widgetKey: 'activeConversions',
      queryHandler: widget =>
        new QueryWidgetActiveUser({
          key: 'activeConversions',
          service,
          widget,
        }),
      layoutHandling: 'chart',
      title: 'Active Conversions',
      description: 'Watch conversions and goals in realtime',
      el: () => import('./WidgetLiveConversions.vue'),
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'globalVisitors',
      queryHandler: widget => new QueryVisitorLocation({ service, widget }),
      title: 'Global Visitors',
      description: 'Visualize traffic by geographic location',
      layoutHandling: 'theater',
      el: () => import('./WidgetGlobal.vue'),
      category: ['traffic'],
    }),
  ]
}
