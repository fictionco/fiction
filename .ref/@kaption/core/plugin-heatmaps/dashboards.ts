import { Dashboard } from '../plugin-dashboards'

export function getDashboards() {
  return [
    new Dashboard({
      dashboardId: 'heatmaps',
      dashboardName: 'Heatmaps',
      layout: [
        { widgetKey: 'totalClicks', layoutHandling: 'mini' },
        { widgetKey: 'totalTouches', layoutHandling: 'mini' },
        { widgetKey: 'totalScrolls', layoutHandling: 'mini' },
        { widgetKey: 'averageScrollDepth', layoutHandling: 'mini' },
        { widgetKey: 'heatmap' },
        { widgetKey: 'topClickSelectors', layoutHandling: 'chart' },
        { widgetKey: 'clicksPerPage', layoutHandling: 'chart' },
      ],
      dashboardType: 'core',
    }),
  ]
}
