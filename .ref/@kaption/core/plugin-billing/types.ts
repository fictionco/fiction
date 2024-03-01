import type {
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
} from '@stripe/stripe-js'
import type Stripe from 'stripe'

export * from '@factor/plugin-stripe/types'

export interface CardElements {
  card: {
    cardCvc?: StripeCardCvcElement
    cardExpiry?: StripeCardExpiryElement
    cardNumber?: StripeCardNumberElement
  }
  name: string
  zip: string
  email: string
}

export interface Plan { name: string, status?: Stripe.Subscription.Status }
