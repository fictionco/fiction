import type { StripePluginSettings, StripePriceConfig } from '@factor/plugin-stripe'

export const pricing: StripePriceConfig[] = [
  {
    duration: 'month',
    priceId: 'price_1MUFtqFofsEYcKEPiZ2oRHlr',
    quantity: 2500,
    cost: 19,
    costPerUnit: 0.0076,
    group: 'standard',
  },
  // {
  //   duration: "month",
  //   priceId: "price_1MUFuMFofsEYcKEP6VDEOR5t",
  //   quantity: 5000,
  //   cost: 39,
  //   costPerUnit: 0.0078,
  //   group: "standard",
  // },
  // {
  //   duration: "month",
  //   priceId: "price_1MUFuMFofsEYcKEP6VDEOR5t",
  //   quantity: 10_000,
  //   cost: 78,
  //   costPerUnit: 0.0078,
  //   group: "standard",
  // },
  {
    duration: 'month',
    priceId: 'price_1MUFufFofsEYcKEPXqAKbBsJ',
    quantity: 12_000,
    cost: 99,
    costPerUnit: 0.008_25,
    group: 'pro',
  },
  // {
  //   duration: "month",
  //   priceId: "price_1MUGcdFofsEYcKEPpW1rA5L9",
  //   quantity: 17_000,
  //   cost: 136,
  //   costPerUnit: 0.008,
  //   group: "pro",
  // },
  // {
  //   duration: "month",
  //   priceId: "price_1MUGcdFofsEYcKEPpW1rA5L9",
  //   quantity: 22_000,
  //   cost: 176,
  //   costPerUnit: 0.008,
  //   group: "pro",
  // },
  {
    duration: 'month',
    priceId: 'price_1MUFvqFofsEYcKEPIGAqa0SJ',
    quantity: 25_000,
    cost: 199,
    costPerUnit: 0.007_96,
    group: 'developer',
  },
  // {
  //   duration: "month",
  //   priceId: "price_1MUFwFFofsEYcKEPFH7UgdXD",
  //   quantity: 40_000,
  //   cost: 298,
  //   costPerUnit: 0.007_45,
  //   group: "plus",
  // },
  // {
  //   duration: "month",
  //   priceId: "price_1MUFwVFofsEYcKEPzhr0dMC1",
  //   quantity: 60_000,
  //   cost: 399,
  //   costPerUnit: 0.006_65,
  //   group: "developer",
  // },
  // {
  //   duration: "month",
  //   priceId: "price_1MUFwrFofsEYcKEP6MJLNRna",
  //   quantity: 80_000,
  //   cost: 496,
  //   costPerUnit: 0.0062,
  //   group: "plus",
  // },
]

export function getStripeConfig(args: Partial<StripePluginSettings>): StripePluginSettings {
  const { factorEnv, factorRouter } = args as StripePluginSettings
  const out: Partial<StripePluginSettings> = {
    publicKeyTest:
      'pk_test_51LxJ3eFofsEYcKEPDOb9bo3h2wcdpTWgJkZdb8njnzAWewo31EfaojP9tDGsngnngBriTob2dUPXRLpgTYipMu4L00tZDwGIUh',
    secretKeyTest: factorEnv.var('STRIPE_SECRET_KEY_TEST'),
    publicKeyLive:
      'pk_live_51LxJ3eFofsEYcKEPc18lsuYoVxuuk5ztDLOGxcKNCS7nSKkx3dolKeNBg26QdQrV0SRta2H5JdwCtP2eMHYjSsgw00pn4pt9q5',
    secretKeyLive: factorEnv.var('STRIPE_SECRET_KEY_PROD'),

    checkoutCancelPathname: (args: { organizationId: string }) => {
      const { organizationId } = args
      return factorRouter.link('plans', { organizationId }).value
    },
    checkoutSuccessPathname: (args: { organizationId: string }) => {
      const { organizationId } = args
      return factorRouter.link(
        'settings',
        { organizationId, panelId: 'billingSuccess' },
        { newCustomer: 1 },
      ).value
    },
    products: [
      {
        productKey: 'premium',
        productId: 'prod_NEjLWj7SHqZzCZ',
        pricing,
      },
    ],
    ...args,
  }

  return out as StripePluginSettings
}
