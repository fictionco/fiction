import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templates = [
  cardTemplate({
    templateId: 'mediaGrid',
    category: ['marketing'],
    description: 'grid of text elements',
    icon: 'i-tabler-layout-grid',
    colorTheme: 'red',
    isPublic: false,
    el: vue.defineAsyncComponent(async () => import('./ElMediaGrid.vue')),
    options: [
    ],
  }),
] as const
