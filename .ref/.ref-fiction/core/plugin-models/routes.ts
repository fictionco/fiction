// @unocss-include
import { AppRoute } from '@factor/api'

export function getRoutes() {
  return [
    new AppRoute({
      name: 'modelIndex',
      niceName: () => 'Models',
      icon: 'i-heroicons-cube',
      parent: 'app',
      path: '/org/:organizationId/model',
      component: () => import('./el/ModelIndex.vue'),
      isActive: ({ route }) => {
        return route.path.includes('model')
      },
    }),

    new AppRoute({
      name: 'modelNew',
      niceName: () => 'Custom Model',
      parent: 'app',
      path: '/org/:organizationId/model/new',
      component: () => import('./el/ModelCreate.vue'),
    }),
    new AppRoute({
      name: 'modelTrain',
      niceName: () => 'Custom Model',
      parent: 'app',
      path: '/org/:organizationId/model/train/:modelId?',
      component: () => import('./el/ModelCreate.vue'),
    }),

    new AppRoute({
      name: 'renderView',
      niceName: () => 'View Render',
      parent: 'app',
      path: '/org/:organizationId/render/view/:renderId?',
      component: () => import('./el/RenderCreate.vue'),
    }),
  ]
}
