import { AppRoute } from '@factor/api'
import type { SitesQuerySettings } from './endpoint'

export function getRoutes(args: SitesQuerySettings) {
  return [
    new AppRoute({
      name: `sitePreview`,
      path: `${args.factorAdmin.adminBaseRoute}/preview/:selectorType/:selectorId/:viewId?/:itemId?`,
      component: () => import('./el/ViewPreview.vue'),
      priority: 20,
    }),
  ]
}
