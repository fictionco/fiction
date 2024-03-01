// @unocss-include

import { vue } from '@factor/api'
import { CardTemplate } from '../../card'
import { optionSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'hero',
    category: ['basic'],
    description: 'standard hero section',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    iconTheme: 'orange',
    el: vue.defineAsyncComponent(() => import('./ElHero.vue')),
    options: [
      ...optionSets.headers.toOptions({ refineOption: { } }),
      ...optionSets.actionItems.toOptions(),
    ],
    userConfig: { heading: 'Hero', subHeading: 'Subheading' },
  }),
] as const
