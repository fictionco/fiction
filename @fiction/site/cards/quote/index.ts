// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '../../card'
import { optionSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'quotes',
    category: ['marketing'],
    description: 'display quotes',
    icon: 'i-tabler-quote',
    iconTheme: 'green',
    el: vue.defineAsyncComponent(() => import('./ElQuote.vue')),
    options: [
      ...optionSets.ai.toOptions(),
      ...optionSets.quotes.toOptions({ mode: 'single', basePath: 'userConfig.quote' }),
    ],
  }),
] as const
