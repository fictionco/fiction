// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '../../card'
import { inputSets } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'doc',
    category: ['content'],
    description: 'Long form document',
    icon: 'i-tabler-file-description',
    iconTheme: 'pink',
    el: vue.defineAsyncComponent(() => import('./ElDoc.vue')),
    options: [
      ...inputSets.post({ prefix: 'userConfig.post' }),
    ],
  }),
] as const
