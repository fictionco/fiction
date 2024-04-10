import { createCard } from '@fiction/site/theme'
import { templates } from '../templates'

const topHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Pricing',
    subHeading: `Save 40% on annual plans`,
    heading: `Choose Your Plan`,
  },
})

const pricingCard = createCard({
  templates,
  templateId: 'pricing',
  userConfig: {
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
    slug: 'pricing',
    cards: [
      createCard({
        templates,
        templateId: 'area',
        cards: [
          topHeroCard,
          pricingCard,
          valueCard,
        ],
      }),

    ],
  })
}
