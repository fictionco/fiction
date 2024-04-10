import { createCard } from '@fiction/site/theme'
import { templates } from '../templates'

const topHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Support',
    subHeading: `Get in touch! We'll be back to you within 24 hours.`,
    heading: `We're here to help`,
  },
})

const valueCard = createCard({
  templates,
  templateId: 'faq',
  userConfig: {
    heading: `Values`,
    items: [
      { name: 'Focused', desc: `Create big value for a small group of people. Don't try and be everything to everyone.` },
      { name: `Karma`, desc: `Focus on making a contribution, the rest takes care of itself.` },
      { name: `Crafted`, desc: `Take the time to do things extremely well. It's better to do nothing, than release something below our standards.` },
      { name: `Minimal`, desc: `Simplicity is the ultimate form of elegance. Do what's needed and nothing more.` },

    ],
  },
})

export function page() {
  return createCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: 'support',
    cards: [
      createCard({
        templates,
        templateId: 'area',
        cards: [
          topHeroCard,
          valueCard,
        ],
      }),

    ],
  })
}
