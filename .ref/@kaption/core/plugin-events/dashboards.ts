import { Dashboard } from '../plugin-dashboards'

export function getDashboards() {
  return [
    new Dashboard({
      dashboardId: 'events',
      dashboardName: 'Events',
      dashboardType: 'core',
      params: {
        filters: [{ name: 'isCustom', value: 1, operator: '=' }],
      },
      layout: [
        {
          widgetKey: 'events',
          title: 'Custom Events',
          layoutHandling: 'fullShort',
        },
        {
          widgetKey: 'topEvents',
          title: 'Top Custom Events',
        },
        {
          widgetKey: 'topEventLabel',
        },
        {
          widgetKey: 'topEventCategory',
        },
        {
          widgetKey: 'topEventAction',
        },
        {
          widgetKey: 'topEventValue',
        },
        {
          widgetKey: 'topConversionEvents',
        },
        {
          widgetKey: 'topGoalEvents',
        },
      ],
    }),
  ]
}
