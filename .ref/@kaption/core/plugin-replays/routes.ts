import { AppRoute } from '@factor/api'

const component = () => import('../plugin-analytics/el/PageIndex.vue')
export function getRoutes() {
  return [
    new AppRoute({
      name: 'replayIndex',
      niceName: () => 'Replays',
      parent: 'app',
      path: '/project/:projectId/replay',
      component,
      meta: { dashboardId: 'replays' },
    }),
    new AppRoute({
      name: 'replaySingle',
      niceName: () => 'View Replay',
      parent: 'app',
      path: '/project/:projectId/replay/:replayId',
      component: () => import('./el/ReplaySingle.vue'),
    }),
  ]
}
