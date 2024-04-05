// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { inputSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'features',
    category: ['marketing'],
    description: 'grid of text elements',
    icon: 'i-tabler-discount-check',
    iconTheme: 'indigo',
    el: vue.defineAsyncComponent(() => import('./ElFeatures.vue')),
    options: [
      ...inputSets.headers(),
      ...inputSets.mediaItemList({ label: 'Features', inputs: ['name', 'desc'] }),
      ...inputSets.actions(),
    ],
  }),
] as const
