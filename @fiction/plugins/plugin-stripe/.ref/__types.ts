import type { EndpointResponse, Organization, User } from '@fiction/core'
import type Stripe from 'stripe'
import type { FictionStripe } from '..'


export type RawCustomerData = {
  customer?: Stripe.Customer & { deleted?: boolean }
  subscriptions?: Stripe.Subscription[]
  org: Organization
}




export interface StripePriceConfig {
  priceId: string
  priceIdTest?: string
  quantity?: number
  cost?: number
  costPerUnit?: number
  duration: 'month' | 'year'
  group?: string
  isCurrent?: boolean
  productId?: string
  alias?: string
  planName?: string
  tier?: number
  credits?: number
}


export type RefinedCustomerDetails = {
  customerId?: string
  orgId?: string
  plan: string
  planName: string
  tier: number
  credits: number // usage related
  subscriptionId?: string
  customer?: Stripe.Customer | Stripe.DeletedCustomer
  isTrial?: boolean
  isCanceled?: boolean
  anchorDateUtc?: number
  cyclePeriod?: string
  cycleEndAtIso?: string
  cycleStartAtIso?: string
  specialPlan?: 'vip' | 'npo' | ''
}

export interface StripeProductConfig {
  key: string
  tier?: number
}


export interface StripePlanInfo {
  plan: Stripe.Plan
  product: Stripe.Product | Record<string, unknown>
}

export interface SubscriptionDetails {
  fictionStripe: FictionStripe
  subscription: Stripe.Subscription
  invoice?: Stripe.Invoice
  isRetry?: boolean
  priceId: string
  paymentMethodId: string
  customerId: string
}

export type CreateSubscriptionArgs = Partial<SubscriptionDetails> &
  Stripe.SubscriptionCreateParams


export type ManageSubscriptionResult = EndpointResponse<Stripe.Subscription> & {
  customerId: string
  customerData?: RawCustomerData
  userId?: string
  user?: User
}
