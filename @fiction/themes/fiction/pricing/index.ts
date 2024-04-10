import { createCard } from '@fiction/site/theme'
import { templates } from '../templates'

const topHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Simple Premium Pricing',
    subHeading: `40% Discount When Paying Annually`,
    heading: `Plans &amp; Pricing`,
  },
})

const pricingCard = createCard({
  templates,
  templateId: 'pricing',
  userConfig: {
    annualDiscountPercent: 40,
    prices: [
      {
        name: 'Basic',
        price: 0,
        desc: `What's included...`,
        href: '#',
        features: [
          { name: 'Up to 2,500 Subscribers' },
          { name: 'Web Hosting' },
          { name: 'Custom Newsletters' },
          { name: 'Free Plugins' },
        ],
      },
      {
        name: 'Standard',
        price: 99,
        desc: `Everything in Basic, plus...`,
        href: '#',
        badge: 'Most Popular',
        features: [
          { name: 'Up to 10,000 subscribers' },
          { name: 'Up to 1,000 customers' },
          { name: 'Products' },
          { name: 'Remove Branding' },
          { name: 'Custom domains' },
          { name: 'Pro Plugins' },
        ],
      },
      {
        name: 'Pro',
        price: 199,
        desc: `Everything in Basic, plus...`,
        href: '#',
        features: [
          { name: 'Up to 25,000 subscribers' },
          { name: 'Up to 5,000 customers' },
          { name: 'AI Tools' },
          { name: 'Remove Branding' },
          { name: 'Custom domains' },
          { name: 'Pro Plugins' },
        ],
      },
      {
        name: 'Advanced',
        price: 299,
        desc: `Everything in Pro, plus...`,
        badge: 'Gets Best Results',
        features: [
          { name: 'Up to 100,000 subscribers' },
          { name: 'Up to 10,000 customers' },
          { name: 'Remove Branding' },
          { name: 'Custom domains' },
          { name: 'Pro Plugins' },
          { name: 'Faster AI Tools' },
          { name: 'Behavioral Analytics' },
          { name: 'Referral program' },
          { name: 'Advanced Plugins' },
        ],
      },
    ],
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
