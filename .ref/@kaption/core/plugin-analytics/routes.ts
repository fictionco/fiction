import { AppRoute } from '@factor/api'

export function getRoutes() {
  return [
    new AppRoute({
      name: 'analyticsIndex',
      niceName: () => 'Overview',
      menuName: 'Analytics',
      parent: 'app',
      path: '/project/:projectId/analytics',
      component: () => import('./el/PageIndex.vue'),
      meta: { dashboardId: 'analyticsIndex' },
    }),
    new AppRoute({
      name: 'analyticsRealtime',
      niceName: () => 'Realtime',
      parent: 'app',
      path: '/project/:projectId/analytics/realtime',
      component: () => import('./el/PageIndex.vue'),
      meta: { dashboardId: 'analyticsRealtime' },
    }),
    new AppRoute({
      name: 'analyticsReports',
      niceName: () => 'Reports',
      parent: 'app',
      path: '/project/:projectId/analytics/reports',
      component: () => import('./el/PageIndex.vue'),
      meta: { dashboardId: 'analyticsReports' },
    }),
    new AppRoute({
      name: 'analyticsBehavior',
      niceName: () => 'Behavior',
      parent: 'app',
      path: '/project/:projectId/analytics/behavior',
      component: () => import('./el/PageIndex.vue'),
      meta: { dashboardId: 'analyticsBehavior' },
    }),
    new AppRoute({
      name: 'analyticsConversion',
      niceName: () => 'Conversion',
      parent: 'app',
      path: '/project/:projectId/analytics/conversion',
      component: () => import('./el/PageIndex.vue'),
      meta: { dashboardId: 'analyticsConversion' },
    }),
    new AppRoute({
      name: 'analyticsTechnical',
      niceName: () => 'Technical',
      parent: 'app',
      path: '/project/:projectId/analytics/technical',
      component: () => import('./el/PageIndex.vue'),
      meta: { dashboardId: 'analyticsTechnical' },
    }),
    new AppRoute({
      name: 'analyticsSettings',
      niceName: () => 'Settings',
      parent: 'app',
      path: '/project/:projectId/analytics/settings',
      component: () => import('./el/PageSettings.vue'),
    }),
  ]
}
