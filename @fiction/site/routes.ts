import { AppRoute } from '@fiction/core'
import type { SitesQuerySettings } from './endpoint'

export function getRoutes(args: SitesQuerySettings) {
  return [
    new AppRoute({
      name: `sitePreview`,
      path: `${args.fictionSites.adminBaseRoute}/preview/:selectorType/:selectorId/:viewId?/:itemId?`,
      component: () => import('./el/ViewPreview.vue'),
      priority: 20,
    }),
  ]
}
