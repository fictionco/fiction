import type { SitesQuerySettings } from './endpoint'
import { AppRoute } from '@fiction/core'

export function getRoutes(args: SitesQuerySettings) {
  return [
    new AppRoute({
      name: `sitePreview`,
      path: `${args.fictionSites.previewRoute}/:selectorType/:selectorId/:viewId?/:itemId?`,
      component: async () => import('./plugin-builder/ViewPreview.vue'),
      priority: 20,
    }),
  ]
}
