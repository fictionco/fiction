// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { inputSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'marquee',
    category: ['marketing'],
    description: 'animated image marquee',
    icon: 'i-tabler-carousel-horizontal',
    iconTheme: 'pink',
    el: vue.defineAsyncComponent(() => import('./ElMarquee.vue')),
    options: [
      ...inputSets.mediaItemList(),
    ],
  }),
] as const
