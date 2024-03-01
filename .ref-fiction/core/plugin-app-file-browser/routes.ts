// @unocss-include
import { AppRoute } from '@factor/api'

export function getRoutes() {
  return [
    new AppRoute({
      name: 'fileBrowser',
      niceName: () => 'Server Files',
      icon: 'i-heroicons-clipboard-document-list',
      parent: 'app',
      path: '/org/:organizationId/files',
      component: () => import('./PageFileBrowser.vue'),
      isActive: ({ route }) => {
        return route.path.includes('files')
      },
    }),
  ]
}
