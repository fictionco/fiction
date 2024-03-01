// @unocss-include

import { vue } from '@factor/api'
import { CardTemplate } from '../../card'
import { inputSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'quotes',
    category: ['marketing'],
    description: 'display quotes',
    icon: 'i-tabler-quote',
    iconTheme: 'green',
    el: vue.defineAsyncComponent(() => import('./ElQuote.vue')),
    options: [
      ...inputSets.quote({ prefix: 'userConfig.quote.' }),
    ],
  }),
] as const
