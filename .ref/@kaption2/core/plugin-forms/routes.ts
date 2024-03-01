import { AppRoute } from '@factor/api'
import type { KaptionForms } from '.'

export function getRoutes(services: { kaptionForms: KaptionForms }) {
  return [
    new AppRoute({
      name: 'formIndex',
      niceName: () => 'Forms',
      parent: 'app',
      path: '/project/:projectId/forms',
      services,
      component: () => import('./ui/FormIndex.vue'),
    }),
    new AppRoute({
      name: 'formBuilder',
      niceName: () => 'Create Form',
      parent: 'app',
      path: '/project/:projectId/forms/:formId/:topic?',
      services,
      component: () => import('./ui/FormBuilder.vue'),
    }),
    new AppRoute({
      name: 'visualizer',
      path: '/visualizer/:formId?',
      services,
      component: () => import('./ui/VisualizerPage.vue'),
    }),
    new AppRoute({
      name: 'embedForm',
      path: '/visualizer-embed/:formId?',
      services,
      component: () => import('./ui/VisualizerEmbed.vue'),
    }),
  ]
}
