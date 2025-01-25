import type { StripeProductConfig } from '@fiction/plugin-stripe'

export function getStripeProductConfig(): StripeProductConfig[] {
  return [

    {
      alias: 'pro',
      productId: 'prod_PtzAeKqhL7w5fs',
      tier: 20,
      pricing: [
        { duration: 'month', priceId: 'price_1P4BCZFofsEYcKEPX8BAkBlt', priceIdTest: 'price_1QkbHoGPawBUuSSLodbvUPS4' },
        { duration: 'year', priceId: 'price_1P4BDBFofsEYcKEPdz8dDkT4', priceIdTest: 'price_1QkbLjGPawBUuSSLwyMtQGYb' },
      ],
    },
    {
      alias: 'workshop',
      productId: 'prod_PtzDXv4G19aO4m',
      productIdTest: 'prod_Rdt9oujiiLnimJ',
      tier: 30,
      pricing: [
        { duration: 'month', priceId: 'price_1P4BF6FofsEYcKEPW6rBsDVO', priceIdTest: 'price_1QkbNVGPawBUuSSLu5jqanvj' },
        { duration: 'year', priceId: 'price_1P4BFjFofsEYcKEPU6zDPhfl', priceIdTest: 'price_1QkbOUGPawBUuSSLcdd5AlIE' },
      ],
    },
  ]
}
