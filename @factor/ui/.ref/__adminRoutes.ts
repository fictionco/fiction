// @unocss-include
import { AppRoute } from '@factor/api'
import type { FactorUi } from '..'

export function getAdminRoutes(factorUi: FactorUi) {
  if (!factorUi.AdminWrap)
    return
  return [
    new AppRoute({
      name: 'app',
      niceName: () => 'App',
      path: '/app',
      priority: 10,
      auth: async ({ user, factorRouter, route }) => {
        const paramOrganizationId = route.params?.organizationId
        // if not logged in, redirect to login
        if (!user && paramOrganizationId !== 'example') {
          return {
            navigate: { path: factorRouter?.link('authLogin').value || '/404' },
            id: 'appParent',
            reason: `user: ${!!user} and paramOrganizationId: ${paramOrganizationId}`,
          }
        }
      },
      component: factorUi.AdminWrap,
    }),
    new AppRoute({
      name: 'notFound404',
      niceName: () => '404',
      path: '/:pathMatch(.*)*',
      priority: 1000,
      parent: 'app',
      component: () => import('./AdminPanelNotFound.vue'),
    }),
  ]
}
