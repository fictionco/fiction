import { createCard } from '@fiction/site/theme.js'
import { vue } from '@fiction/core/index.js'
import { templates } from '../templates.js'

export function page() {
  const homeCard = createCard({
    el: vue.defineAsyncComponent(async () => import('./el/ElCard.vue')),
    userConfig: { spacing: { spacingClass: 'p-0' } },
  })

  return createCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: 'affiliate',
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
