// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { optionSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'map',
    category: ['other'],
    description: 'map with markers, powered by Mapbox',
    icon: 'i-tabler-map',
    iconTheme: 'amber',
    el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
    options: [
      ...optionSets.headers.toOptions({ refine: { } }),
      ...optionSets.actionItems.toOptions(),
    ],
    userConfig: { },
  }),
] as const
