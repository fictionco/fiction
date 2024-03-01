// @unocss-include

import { vue } from '@factor/api'
import { CardTemplate } from '../../card'

export const templates = [
  new CardTemplate({
    templateId: 'area',
    category: ['basic'],
    description: 'container for other elements',
    icon: 'i-tabler-box-padding',
    iconTheme: 'blue',
    el: vue.defineAsyncComponent(() => import('./ElArea.vue')),
    isContainer: true, // ui drawer
    spacingClass: '',
    options: [],
  }),
] as const
