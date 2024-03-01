import { AppRoute } from '@factor/api'

const component = () => import('../plugin-analytics/el/PageIndex.vue')
export function getRoutes() {
  return [
    new AppRoute({
      name: 'heatmapIndex',
      niceName: () => 'Heatmaps',
      parent: 'app',
      path: '/project/:projectId/heatmap',
      component,
      meta: { dashboardId: 'heatmaps' },
    }),
  ]
}
