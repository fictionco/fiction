import { createCard } from '@fiction/site/theme'
import { vue } from '@fiction/core'
import { templates } from '../templates'

export function page() {
  const homeCard = createCard({
    el: vue.defineAsyncComponent(() => import('./el/ElCard.vue')),
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
