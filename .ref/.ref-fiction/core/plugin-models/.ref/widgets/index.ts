import { Widget } from '../../plugin-dashboards'

export function getWidgets() {
  return [
    new Widget({
      title: 'AI Template Overview',
      widgetKey: 'templateOverview',
      el: () => import('./WidgetTemplates.vue'),
      layoutHandling: 'full',
    }),
    new Widget({
      title: 'Latest Image Renders',
      description: 'A listing of recently generated content.',
      widgetKey: 'renderOverview',
      el: () => import('./WidgetRenders.vue'),
      layoutHandling: 'full',
    }),
    new Widget({
      title: 'Custom AI Models',
      widgetKey: 'modelOverview',
      el: () => import('./WidgetModels.vue'),
      layoutHandling: 'full',
    }),
  ]
}
