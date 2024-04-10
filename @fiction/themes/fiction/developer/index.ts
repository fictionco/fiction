import { createCard } from '@fiction/site/theme'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { templates } from '../templates'

export function page() {
  const homeCard = createCard({
    el: vue.defineAsyncComponent(() => import('./home/ElCard.vue')),
    userConfig: { spacing: { spacingClass: 'p-0' } },
  })

  return createCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: 'developer',
    cards: [
      createCard({
        templates,
        templateId: 'area',
        cards: [
          homeCard,
        ],
      }),

    ],
  })
}
