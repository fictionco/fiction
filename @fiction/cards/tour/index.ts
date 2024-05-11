import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'

export const templates = [
  new CardTemplate({
    templateId: 'tour',
    category: ['marketing'],
    description: 'list of tour hero elements',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(() => import('./ElTour.vue')),
    options: [
    ],
  }),
] as const
