import type { FactorRouter } from '@factor/api'
import { AppRoute } from '@factor/api'

import type { FactorDashboard } from '.'

export function routes({
  factorDashboard,
}: {
  factorDashboard: FactorDashboard
}) {
  return [
  // new AppRoute({
  //   name: "home",
  //   path: "/",
  //   parent: "app",
  //   icon: "i-heroicons-home",
  //   component: () => import("./app/DashboardMain.vue"),
  // }),
  // new AppRoute({
  //   name: "dashboard",
  //   parent: "app",
  //   priority: 70,
  //   path: "/org/:organizationId",
  //   isActive: ({ route, appRoute }) => {
  //     return route.path.includes("dash") || route.name === appRoute?.name
  //   },
  //   component: () => import("./app/DashboardMain.vue"),
  // }),
    new AppRoute({
      name: 'dashboardSingle',
      niceName: (args: { factorRouter: FactorRouter }) => {
        const dashboardId = args.factorRouter.params.value.dashboardId as string
        return factorDashboard.getDashboardName(dashboardId)
      },
      parent: 'app',
      path: '/org/:organizationId/dash/:dashboardId',
      component: () => import('./app/DashboardMain.vue'),
      isActive: ({ route, appRoute }) => {
        return route.path.includes('dash') || route.name === appRoute?.name
      },
    }),
  ]
}
