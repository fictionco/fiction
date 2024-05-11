import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { standardOption } from '../inputSets'

export const templates = [
  new CardTemplate({
    templateId: 'features',
    category: ['marketing'],
    description: 'grid of text elements',
    icon: 'i-tabler-discount-check',
    colorTheme: 'indigo',
    el: vue.defineAsyncComponent(() => import('./ElFeatures.vue')),
    options: [
      standardOption.headers(),
      standardOption.mediaItems(),
      standardOption.actionItems(),
    ],
  }),
] as const
