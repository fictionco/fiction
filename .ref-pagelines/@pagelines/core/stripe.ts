import type { StripePluginSettings } from '@factor/plugin-stripe'

export function getStripeConfig(args: Partial<StripePluginSettings>): StripePluginSettings {
  const { factorEnv, factorRouter } = args as StripePluginSettings
  const out: Partial<StripePluginSettings> = {
    publicKeyTest: factorEnv.var('STRIPE_PUBLIC_KEY_TEST'),
    secretKeyTest: factorEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyLive: factorEnv.var('STRIPE_PUBLIC_KEY_PROD'),
    secretKeyLive: factorEnv.var('STRIPE_SECRET_KEY_PROD'),

    checkoutCancelPathname: (args: { organizationId: string }) => {
      const { organizationId } = args
      return factorRouter.link('pricing', { organizationId }).value
    },
    checkoutSuccessPathname: (args: { organizationId: string }) => {
      const { organizationId } = args
      return factorRouter.link(
        'checkout',
        { organizationId },
        { newCustomer: 1 },
      ).value
    },
    products: [
      {
        productKey: 'personal',
        productId: 'prod_NuhKCKxPapDTch',
        tier: 10,
        credits: 2000,
        pricing: [
          {
            duration: 'month',
            priceId: 'price_1N8rvvGIVbyH7UmOvywWpZnI',
            cost: 19,
          },
          {
            duration: 'year',
            priceId: 'price_1N8rvvGIVbyH7UmOfXAZDtcZ',
            cost: 190,
          },
        ],
      },
      {
        productKey: 'plus',
        productId: 'prod_NuhLCZwfBqzoQa',
        tier: 20,
        credits: 5000,
        pricing: [
          {
            duration: 'month',
            priceId: 'price_1N8rwUGIVbyH7UmOtLiFJ4ig',
            cost: 49,
          },
          {
            duration: 'year',
            priceId: 'price_1N8rwUGIVbyH7UmO1n2E96cs',
            cost: 490,
          },
        ],
      },
      {
        productKey: 'pro',
        productId: 'prod_NuhLpXT7cyO6gv',
        tier: 30,
        credits: 10_000,
        pricing: [
          {
            duration: 'month',
            priceId: 'price_1N8rwxGIVbyH7UmOtyOXMKjS',
            cost: 99,
          },
          {
            duration: 'year',
            priceId: 'price_1N8rwxGIVbyH7UmOfX8XIzPt',
            cost: 990,
          },
        ],
      },
      {
        productKey: 'premier',
        productId: 'prod_NuhM6aX04rqcoC',
        tier: 40,
        credits: 40_000,
        pricing: [
          {
            duration: 'month',
            priceId: 'price_1N8rxXGIVbyH7UmO4mY4XDzd',
            cost: 399,
          },
          {
            duration: 'year',
            priceId: 'price_1N8rxXGIVbyH7UmORWHc7vgJ',
            cost: 3990,
          },
        ],
      },
    ],
    ...args,
  }

  return out as StripePluginSettings
}
