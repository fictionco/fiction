// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'

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
