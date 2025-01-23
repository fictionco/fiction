import type { template as faqTemplate } from '@fiction/cards/content-faq'
import type { template as heroTemplate } from '@fiction/cards/content-hero'
import type { template as pricingTemplate } from '@fiction/cards/convert-pricing'
import type { FictionStripe } from '@fiction/plugin-stripe/index.js'

import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'

import { getCheckoutUrl } from '@fiction/plugin-stripe/index.js'

async function purchaseUrl(args: { priceId: string, fictionStripe?: FictionStripe }) {
  const { fictionStripe } = args

  const loginPath = '/auth/login'

  if (!fictionStripe) {
    return loginPath
  }

  return await getCheckoutUrl({ fictionStripe, query: { ...args, loginPath } })
}

export async function getPricingPage(args: { factory: CardFactory, site: Site }) {
  const { site, factory } = args

  const annualDiscountPercent = 30

  const { fictionStripe } = site.fictionSites.fictionEnv.getService<{ fictionStripe: FictionStripe }>()

  const pricingCard = await factory.fromTemplate<typeof pricingTemplate>({
    templateId: 'cardPricingV1',
    userConfig: {
      hasAnnual: true,
      annualDiscountPercent,
      layout: 'standard',
      prices: [
        {
          title: 'Free',
          price: 0,
          description: `Start building your audience`,
          variant: 'muted',
          icon: { class: 'i-tabler-rocket' },
          features: [
            { label: 'Up to 2,500 Subscribers' },
            { label: 'Web Hosting and Unlimited Traffic' },
            { label: 'Newsletter & Content Tools' },
            { label: 'Basic Analytics' },
            { label: 'Email Support' },
          ],
          button: {
            label: 'Start Free',
            icon: { class: 'i-tabler-rocket' },
            href: '#free-tier',
          },
        },
        {
          title: 'Pro',
          price: 79,
          description: `Professional tools and support`,
          variant: 'default',
          badge: 'Most Popular',
          icon: { class: 'i-tabler-stars' },
          features: [
            { label: 'Up to 10,000 Subscribers' },
            { label: 'Rapid Content Creation Tools (AI)' },
            { label: 'Custom Domain Support' },
            { label: 'Remove Fiction Branding' },
            { label: 'Marketing Automation' },
            { label: 'Advanced Analytics' },
            { label: 'Priority Support (24h)' },
            { label: 'Pro Extensions & Integrations' },
          ],
          button: {
            label: 'Start Pro Trial',
            icon: { class: 'i-tabler-stars' },
            href: await purchaseUrl({ fictionStripe, priceId: 'price_pro_monthly' }),
            hrefAnnual: await purchaseUrl({ fictionStripe, priceId: 'price_pro_annual' }),
          },
        },
        {
          title: 'Workshop',
          price: 279,
          description: `Dedicated help and coaching`,
          icon: { class: 'i-tabler-crown' },
          variant: 'highlighted',
          badge: 'Best Results',
          features: [
            { label: 'Up to 50,000 Subscribers' },
            { label: 'Everything in Pro' },
            { label: 'Dedicated Coaching Sessions' },
            { label: 'Private Growth Workshop Access' },
            { label: 'API Access' },
            { label: 'Brand Strategy Tools' },
            { label: 'Advanced Automation Features' },
            { label: 'Custom Integrations' },
            { label: 'VIP Support' },
          ],
          button: {
            label: 'Start Workshop Trial',
            icon: { class: 'i-tabler-crown' },
            href: await purchaseUrl({ fictionStripe, priceId: 'price_proplus_monthly' }),
            hrefAnnual: await purchaseUrl({ fictionStripe, priceId: 'price_proplus_annual' }),
          },
        },
      ],
    },
  })

  const topHeroCard = await factory.fromTemplate<typeof heroTemplate>({
    templateId: 'cardHeroV1',
    userConfig: {
      superTitle: { text: 'Simple Premium Pricing', theme: 'green', icon: { class: 'i-tabler-credit-card' } },
      subTitle: `${annualDiscountPercent}% Discount When Paying Annually`,
      title: `Plans & Pricing`,
    },
  })

  const valueCard = await factory.fromTemplate<typeof faqTemplate>({
    templateId: 'cardFaqV1',
    userConfig: {
      standard: { headers: { title: 'Frequently Asked Questions', subTitle: 'Get answers to common questions about Fiction' } },
      items: [
        { title: 'What exactly is Fiction?', content: 'Fiction is your complete personal marketing command center. Unlike scattered tools that fragment your brand presence, Fiction gives you everything needed to build a professional personal website, capture leads, and grow an engaged email audience - all from one seamless dashboard.' },
        { title: 'Which plan fits my needs?', content: `If you're just starting out, the Basic plan is a great place to start. If you're looking for more advanced features and support, the Pro plan is the way to go. If you're not sure, you can always start with the Basic plan and upgrade later.` },
        { title: 'Do you limit how many emails I can send?', content: `No! You can send as many emails as you want to your subscribers, no matter which plan you're on. We don't believe in limiting your ability to communicate with your audience.` },
        { title: 'What happens if I exceed my subscriber limit?', content: `If you exceed your subscriber limit, we'll automatically upgrade you to the next plan that fits your needs. You'll receive an email notification before this happens, so you'll have time to adjust your plan if needed.` },
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
    cards: [
      await factory.fromTemplate({
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
