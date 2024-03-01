// @unocss-include

import { vue } from '@factor/api'
import { CardTemplate } from '../../card'

export const templates = [
  new CardTemplate({
    templateId: 'tour',
    category: ['marketing'],
    description: 'list of tour hero elements',
    icon: 'i-tabler-compass',
    iconTheme: 'green',
    el: vue.defineAsyncComponent(() => import('./ElTour.vue')),
    options: [
    ],
  }),
] as const
