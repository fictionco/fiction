// @unocss-include

import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { CardTemplate } from '@fiction/site'
import { mediaItemsOptionSet } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'logos',
    category: ['marketing'],
    description: 'image/logo grid',
    icon: 'i-tabler-input-check',
    iconTheme: 'cyan',
    el: vue.defineAsyncComponent(() => import('./ElLogos.vue')),
    options: [
      new InputOption({
        key: 'userConfig.label',
        label: 'Label',
        input: 'InputText',
      }),
      ...mediaItemsOptionSet.toOptions(),
    ],
  }),
] as const
