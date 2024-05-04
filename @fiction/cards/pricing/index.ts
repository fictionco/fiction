// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'

export const templates = [
  new CardTemplate({
    templateId: 'pricing',
    category: ['marketing'],
    description: 'Pricing table',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    iconTheme: 'orange',
    el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
    options: [
    ],
    userConfig: {},
  }),
] as const
