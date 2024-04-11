import '@fiction/core/plugin-env/hooks'
import type Stripe from 'stripe'
import type { FictionStripe } from './plugin'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    stripeOnCustomerCreated: {
      args: [
        {
          customer: Stripe.Customer
          orgId: string
          name?: string
          email?: string
        },
        { fictionStripe: FictionStripe },
      ]
    }
    stripeOnCheckoutSuccess: {
      args: [Stripe.Event, { fictionStripe: FictionStripe }]
    }
  }
}
