import { createCard } from '@fiction/site/theme'
import { templates } from '../templates'

const topHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Tour',
    subHeading: `Fiction was c`,
    heading: `A Company Built Around Your Success`,
    actions: [
      {
        name: 'Start Now',
        href: '/auth/login?reload=1',
      },
    ],
  },
})

export function page() {
  return createCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: 'about',
    cards: [
      createCard({
        templates,
        templateId: 'area',
        cards: [
          topHeroCard,
        ],
      }),

    ],
  })
}
