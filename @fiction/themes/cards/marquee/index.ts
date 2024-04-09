// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'marquee',
    category: ['marketing'],
    description: 'animated image marquee',
    icon: 'i-tabler-carousel-horizontal',
    iconTheme: 'pink',
    el: vue.defineAsyncComponent(() => import('./ElMarquee.vue')),
    options: [
      standardOption.mediaItems(),
    ],
  }),
] as const
