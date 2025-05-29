import type { FictionStripe } from '@fiction/plugin-stripe/index.js'

import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'

import { cardConfig } from '@fiction/cards/index'
import { getCheckoutUrl } from '@fiction/plugin-stripe/utils.js'

async function purchaseUrl(args: { priceLookupKey: string, site: Site }) {
  const { site } = args

  const { fictionStripe, fictionUser } = site.fictionSites.fictionEnv.getService<{ fictionStripe: FictionStripe }>()

  const loginPath = '/app/auth/register?_reload=1'

  if (typeof window === 'undefined') {
    return loginPath
  }

  const user = await fictionUser.userInitialized({ caller: 'purchaseUrl' })

  if (!fictionStripe || !user) {
    return loginPath
  }

  return await getCheckoutUrl({ fictionStripe, query: { ...args, loginPath } })
}

export async function getPricingPage(args: { factory: CardFactory, site: Site }) {
  const { site, factory } = args

  const annualDiscountPercent = 30

  const pricingCard = cardConfig({
    templateId: 'cardPricingV1',
    userConfig: {
      hasAnnual: true,
      annualDiscountPercent,
      layout: 'standard',
      prices: [
        {
          title: 'Foundation',
          price: 29,
          description: `Establish your Brand`,
          variant: 'muted',
          icon: { class: 'i-tabler-rocket' },
          features: [
            { label: '1,000 Subscriber Limit' },
            { label: 'Custom Domain' },
            { label: 'Newsletter Studio' },
            { label: 'Analytics Dashboard' },
          ],
          button: {
            label: 'Start Trial',
            icon: { class: 'i-tabler-rocket' },
            href: await purchaseUrl({ site, priceLookupKey: 'starter_month' }),
            hrefAnnual: await purchaseUrl({ site, priceLookupKey: 'starter_year' }),
          },
        },
        {
          title: 'Leader',
          price: 89,
          description: `Advanced marketing tools`,
          variant: 'default',
          badge: 'Most Popular',
          icon: { class: 'i-tabler-stars' },
          features: [
            { label: '5,000 Subscribers' },
            { label: 'AI Content Engine' },
            { label: 'Automation Suite' },
            { label: 'Advanced Analytics' },
            { label: 'Priority Support' },
            { label: 'White Label' },
          ],
          button: {
            label: 'Start Trial',
            icon: { class: 'i-tabler-stars' },
            href: await purchaseUrl({ site, priceLookupKey: 'pro_month' }),
            hrefAnnual: await purchaseUrl({ site, priceLookupKey: 'pro_year' }),
          },
        },
        {
          title: 'Authority',
          price: 189,
          description: `For influencers & thought leaders`,
          icon: { class: 'i-tabler-crown' },
          variant: 'highlighted',
          badge: 'Best Results',
          features: [
            { label: '25,000 Subscribers' },
            { label: '1:1 Strategy Sessions' },
            { label: 'Growth Workshops' },
            { label: 'Custom Automation' },
            { label: 'API Access' },
            { label: 'Dedicated Support' },
          ],
          button: {
            label: 'Start Trial',
            icon: { class: 'i-tabler-crown' },
            href: await purchaseUrl({ site, priceLookupKey: 'elite_month' }),
            hrefAnnual: await purchaseUrl({ site, priceLookupKey: 'elite_year' }),
          },
        },
      ],
    },
  })

  const topHeroCard = cardConfig({
    templateId: 'cardHeroV1',
    userConfig: {
      items: [
        {
          superTitle: { text: 'Pricing', theme: 'green', icon: { class: 'i-tabler-credit-card' } },
          subTitle: `${annualDiscountPercent}% Discount When Paying Annually`,
          title: `Simple, Transparent Pricing`,
        },
      ],
    },
  })

  const valueCard = cardConfig({
    templateId: 'cardFaqV1',
    userConfig: {
      standard: { headers: { title: 'Frequently Asked Questions', subTitle: 'Get answers to common questions about Fiction' } },
      items: [
        { title: 'What exactly is Fiction?', content: 'Fiction is your complete personal marketing command center. Unlike scattered tools that fragment your brand presence, Fiction gives you everything needed to build a professional personal website, capture leads, and grow an engaged email audience - all from one seamless dashboard.' },
        { title: 'Which plan fits my needs?', content: `If you're just starting out, the Basic plan is a great place to start. If you're looking for more advanced features and support, the Pro plan is the way to go. If you're not sure, you can always start with the Basic plan and upgrade later.` },
        { title: 'Do you limit how many emails I can send?', content: `No! You can send as many emails as you want to your contacts, no matter which plan you're on. We don't believe in limiting your ability to communicate with your audience.` },
        { title: 'What happens if I exceed my contact limit?', content: `If you exceed your contact limit, we'll automatically upgrade you to the next plan that fits your needs. You'll receive an email notification before this happens, so you'll have time to adjust your plan if needed.` },
        { title: 'Is it difficult to move my existing email list to Fiction?', content: `No! We make it easy to import your existing email list into Fiction. You can upload a CSV file of your subscribers, or connect your existing email service provider to automatically import your list.` },
        { title: 'Can I use my own custom domain?', content: `Yes! You can use your own custom domain with any paid Fiction plan.` },
        { title: 'What if Fiction isn\'t right for me?', content: `While we'd hate to see you go, you can cancel anytime from your dashboard with no hassles. Pro plan users are backed by our 30-day money-back guarantee, giving you plenty of time to explore Fiction risk-free.` },
        { title: `Does Fiction Take A Cut Of My Revenue?`, content: `No! When you make a sale with Fiction, we don't take a percentage cut of your revenue from that sale (unlike most creator platforms). If you use Stripe or Paypal to collect payments, you will still pay their merchant processing fees (for example, Stripe's merchant processing fee is 2.9% + 30 cents per transaction).` },

      ],
    },
  })

  return factory.fromTemplate({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'pricing',
    title: 'Pricing',
    cards: [
      cardConfig({
        templateId: 'cardPageAreaV1',
        cards: [
          topHeroCard,
          pricingCard,
          valueCard,
        ],
      }),

    ],
  })
}
