import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'

export const templates = [
  new CardTemplate({
    templateId: 'mediaGrid',
    category: ['marketing'],
    description: 'grid of text elements',
    icon: 'i-tabler-layout-grid',
    colorTheme: 'red',
    el: vue.defineAsyncComponent(async () => import('./ElMediaGrid.vue')),
    options: [
    ],
  }),
] as const
