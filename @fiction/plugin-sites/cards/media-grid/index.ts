// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '../../card'

export const templates = [
  new CardTemplate({
    templateId: 'mediaGrid',
    category: ['marketing'],
    description: 'grid of text elements',
    icon: 'i-tabler-layout-grid',
    iconTheme: 'red',
    el: vue.defineAsyncComponent(() => import('./ElMediaGrid.vue')),
    options: [
    ],
  }),
] as const
