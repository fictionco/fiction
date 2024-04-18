// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: '404',
    category: ['special'],
    description: 'Shown when a page is not found',
    icon: 'i-tabler-error-404',
    iconTheme: 'red',
    el: vue.defineAsyncComponent(() => import('./El404.vue')),
    isPublic: false,
    options: [
      standardOption.headers(),
      standardOption.actionItems(),
    ],
  }),
] as const
