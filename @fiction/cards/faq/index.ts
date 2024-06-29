import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'faq',
    category: ['basic'],
    description: 'A list element great for FAQs, values, etc. ',
    icon: 'i-tabler-map',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options: [
      standardOption.headers(),
      standardOption.actionItems(),
    ],
    userConfig: { },
  }),
] as const
