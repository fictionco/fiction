// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'doc',
    category: ['content'],
    description: 'Long form document',
    icon: 'i-tabler-file-description',
    iconTheme: 'pink',
    el: vue.defineAsyncComponent(() => import('./ElDoc.vue')),
    options: [
      standardOption.post(),
    ],
  }),
] as const
