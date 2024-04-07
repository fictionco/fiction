// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { optionSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'team',
    category: ['marketing'],
    description: 'Team listing',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    iconTheme: 'orange',
    el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
    options: [
      ...optionSets.headers.toOptions({ refine: { } }),
      ...optionSets.mediaItems.toOptions({ refine: { } }),
      ...optionSets.actionItems.toOptions(),
    ],
    userConfig: {},
  }),
] as const
