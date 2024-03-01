// @unocss-include

import { vue } from '@factor/api'
import { CardTemplate } from '../../card'

export const templates = [
  new CardTemplate({
    templateId: 'metrics',
    category: ['stats'],
    description: 'display stats/metrics',
    icon: 'i-tabler-number',
    iconTheme: 'sky',
    el: vue.defineAsyncComponent(() => import('./ElMetrics.vue')),
    options: [
    ],
  }),
] as const
