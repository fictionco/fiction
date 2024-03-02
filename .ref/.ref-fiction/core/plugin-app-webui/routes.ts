// @unocss-include
import { AppRoute } from '@factor/api'

export function getRoutes() {
  return [
    new AppRoute({
      name: 'webui',
      niceName: () => 'Image Editor',
      icon: 'i-heroicons-bolt',
      parent: 'app',
      path: '/org/:organizationId/webui',
      component: () => import('./PageWebUi.vue'),
      isActive: ({ route }) => {
        return route.path.includes('webui')
      },
    }),
  ]
}
