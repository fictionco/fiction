// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { actionItemOptionSet, headerOptionSet, mediaItemsOptionSet } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'features',
    category: ['marketing'],
    description: 'grid of text elements',
    icon: 'i-tabler-discount-check',
    iconTheme: 'indigo',
    el: vue.defineAsyncComponent(() => import('./ElFeatures.vue')),
    options: [
      ...headerOptionSet.toOptions(),
      ...mediaItemsOptionSet.toOptions(),
      ...actionItemOptionSet.toOptions(),
    ],
  }),
] as const
