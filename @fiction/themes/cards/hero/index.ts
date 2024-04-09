// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'hero',
    category: ['basic'],
    description: 'standard hero section',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    iconTheme: 'orange',
    el: vue.defineAsyncComponent(() => import('./ElHero.vue')),
    options: [
      standardOption.headers({}),
      standardOption.layout(),
      standardOption.actionItems(),
      standardOption.ai(),
    ],
    userConfig: { heading: 'Hero', subHeading: 'Subheading' },
  }),
] as const
