import { AppRoute } from '@factor/api'

export default [
  new AppRoute({
    name: 'trackingCode',
    niceName: () => 'Tracking Code',
    path: '/project/:projectId/code',
    parent: 'app',
    component: () => import('./ProjectTrackingCode.vue'),
  }),
]
