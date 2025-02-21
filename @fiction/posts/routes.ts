import { AppRoute } from '@fiction/core'

export function getRoutes() {
  return [
    new AppRoute({
      name: `postPreview`,
      path: `/post-preview/:postId`,
      component: async () => import('./admin/ViewPreview.vue'),
      priority: 20,
    }),
  ]
}
