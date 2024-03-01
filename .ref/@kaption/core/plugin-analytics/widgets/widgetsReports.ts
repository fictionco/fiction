import { Widget } from '@factor/api/plugin-dashboards'
import type { KaptionPluginSettings } from '../../utils'
import { QueryReport, QueryReportChart } from './queryReports'

export function widgets(service: KaptionPluginSettings) {
  return [
    new Widget({
      widgetKey: 'reportTable',
      queryHandler: widget => new QueryReport({ widget, service }),
      el: () => import('./WidgetReportTable.vue'),
      title: 'Report Table',
      description: 'A table for aggregated data reports',
      layoutHandling: 'full',
      category: ['general'],
    }),
    new Widget({
      widgetKey: 'reportChart',
      queryHandler: widget => new QueryReportChart({ widget, service }),
      el: () => import('./WidgetDateChart.vue'),
      title: 'Report Chart',
      description: 'A time series chart for the current report',
      layoutHandling: 'fullShort',
      category: ['general'],
    }),
  ]
}
