import { Dashboard } from '../plugin-dashboards'

export function getDashboards() {
  return [
    new Dashboard({
      dashboardId: 'replays',
      dashboardName: 'Replays',
      dashboardType: 'core',
      layout: [
        { widgetKey: 'totalReplays' },
        { widgetKey: 'replayTotalRecorded' },
        { widgetKey: 'replayIndex' },
      ],
    }),
  ]
}
