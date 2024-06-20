import { createCard } from '@fiction/site/theme.js'
import type { FictionStripe } from '@fiction/plugin-stripe/plugin.js'
import { templates } from '../templates.js'

const topHeroCard = createCard({
  templates,
  templateId: 'hero',
  userConfig: {
    superHeading: 'Simple Premium Pricing',
    subHeading: `40% Discount When Paying Annually`,
    heading: `Plans &amp; Pricing`,
  },
})

const valueCard = createCard({
  templates,
  templateId: 'faq',
  userConfig: {
    heading: `Frequently Asked Questions`,
    items: [
      { name: 'Can I Cancel My Subscription At Any Time?', desc: `Of course! If you decide that Fiction  isn't the right fit for your business, you can easily cancel your account from your dashboard at any time.` },
      { name: `Does Fiction Take A Cut Of My Revenue?`, desc: `No! When you make a sale with Fiction, we don't take a percentage cut of your revenue from that sale (unlike most creator platforms). If you use Stripe or Paypal to collect payments, you will still pay their merchant processing fees (for example, Stripe's merchant processing fee is 2.9% + 30 cents per transaction).` },
      { name: `What should my personal marketing platform include?`, desc: `A successful platform should feature a consistent stream of content that your audience finds valuable. This could include articles, videos, audios, courses, live webinars, downloadable resources, perks (like event tickets or physical merchandise), and/or a community section or forum.` },

    ],
  },
})

export async function page(args: { fictionStripe?: FictionStripe }) {
  const { fictionStripe } = args
  const url = await fictionStripe?.getCheckoutUrl({ priceId: '#', loginPath: '/auth/login' })

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
          href: url,
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
          href: url,
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
          href: url,
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
