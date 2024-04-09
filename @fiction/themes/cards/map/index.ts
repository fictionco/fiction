// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'map',
    category: ['other'],
    description: 'map with markers, powered by Mapbox',
    icon: 'i-tabler-map',
    iconTheme: 'amber',
    el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
    options: [
      standardOption.headers(),
      standardOption.actionItems(),
    ],
    userConfig: { },
  }),
] as const
