// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'

export const templates = [
  new CardTemplate({
    templateId: 'area',
    category: ['basic'],
    description: 'container for other elements',
    icon: 'i-tabler-box-padding',
    iconTheme: 'blue',
    el: vue.defineAsyncComponent(() => import('./ElArea.vue')),
    isContainer: true, // ui drawer
    userConfig: {
      spacing: {
        spacingClass: '',
      },
    },
    options: [],
  }),
] as const
