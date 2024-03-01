// @unocss-include
import { AppRoute } from '@factor/api'

export function getRoutes() {
  return [
    new AppRoute({
      name: 'collectionIndex',
      niceName: () => 'Collections',
      icon: 'i-heroicons-bookmark',
      parent: 'app',
      path: '/org/:organizationId/collections',
      component: () => import('./CollectionIndex.vue'),
      isActive: ({ route }) => {
        return route.path.includes('collection')
      },
    }),
    new AppRoute({
      name: 'collectionEdit',
      niceName: () => 'Edit Collection',
      icon: 'i-heroicons-cube',
      parent: 'app',
      path: '/org/:organizationId/collections/edit/:collectionId?',
      component: () => import('./CollectionEdit.vue'),
    }),
  ]
}
