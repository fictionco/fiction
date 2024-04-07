import { createCard } from '@fiction/site/theme'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { templates } from '../templates'
import people from './people2.webp'

const topHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Company',
    subHeading: `The platform built to help you tell your story.`,
    heading: `About`,
    splash: { format: 'url', url: people },
    layout: 'justified',
  },
})

const teamCard = createCard({
  templates,
  templateId: 'team',
  userConfig: {
    subHeading: `People helping build your story`,
    heading: `Team`,
    splash: { format: 'url', url: people },
    layout: 'justified',
  },
})

const aboutCard = createCard({
  templates,
  tpl: new CardTemplate({
    templateId: 'sites',
    el: vue.defineAsyncComponent(() => import('./AboutPage.vue')),
  }),
  userConfig: {},
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
          teamCard,
          aboutCard,
        ],
      }),

    ],
  })
}
