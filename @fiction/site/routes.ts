import type { SitesQuerySettings } from './endpoint'
import { AppRoute } from '@fiction/core'

export function getRoutes(args: SitesQuerySettings) {
  return [
    new AppRoute({
      name: `sitePreview`,
      path: `${args.fictionSites.adminBaseRoute}/preview/:selectorType/:selectorId/:viewId?/:itemId?`,
      component: async () => import('./plugin-builder/ViewPreview.vue'),
      priority: 20,
    }),
  ]
}
