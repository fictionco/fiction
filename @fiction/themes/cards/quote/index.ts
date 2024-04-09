// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'quotes',
    category: ['marketing'],
    description: 'display quotes',
    icon: 'i-tabler-quote',
    iconTheme: 'green',
    el: vue.defineAsyncComponent(() => import('./ElQuote.vue')),
    options: [
      standardOption.ai(),
      standardOption.quotes(),
    ],
  }),
] as const
