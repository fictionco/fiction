import { AppRoute } from '@fiction/core'

export function getRoutes() {
  return [
    new AppRoute({
      name: `postPreview`,
      path: `/post-preview/:postId`,
      component: async () => import('./admin/ViewPreview.vue'),
      priority: 20,
    }),
    new AppRoute({
      name: `postPreview`,
      path: `/email-dev`,
      component: async () => import('@fiction/core/plugin-email/test/EmailPreview.vue'),
      priority: 20,
    }),
  ]
}
