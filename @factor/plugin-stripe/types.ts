import type { EndpointResponse, User } from '@factor/api'
import type Stripe from 'stripe'
import type { FactorStripe } from '.'

export type CustomerDetails = {
  customerId?: string
  orgId?: string
  plan: string
  planName: string
  tier: number
  quantity: number // billing related
  credits: number // usage related
  link: string
  icon: string
  subscriptionId?: string
  customer?: Stripe.Customer | Stripe.DeletedCustomer
  isTrial?: boolean
  isCanceled?: boolean
  upgradeTier?: CustomerDetails
  upgradeQuantity?: CustomerDetails
  anchorDateUtc?: number
  cyclePeriod?: string
  cycleEndAtIso?: string
  cycleStartAtIso?: string
  specialPlan?: 'vip' | 'npo' | ''
  specialQuantity?: number
  totalQuantity?: number
} & StripePriceConfig

export interface StripeProductConfig {
  pricing: StripePriceConfig[]
  productId: string
  productKey: string
  tier?: number
  credits?: number
}

export interface StripePriceConfig {
  priceId: string
  quantity?: number
  cost: number
  costPerUnit?: number
  duration: 'month' | 'year'
  group?: string
  isCurrent?: boolean
  productId?: string
  productKey?: string
  planName?: string
  tier?: number
  credits?: number
}

export interface StripePlanInfo {
  plan: Stripe.Plan
  product: Stripe.Product | Record<string, unknown>
}

export interface CustomerData {
  customer?: Stripe.Customer | Stripe.DeletedCustomer
  subscriptions?: CustomSubscription[]
}

export type CustomSubscription = Stripe.Subscription & {
  customerAuthorized: 'authorized' | 'invalid' | 'unknown'
}

export interface SubscriptionDetails {
  factorStripe: FactorStripe
  subscription: Stripe.Subscription
  invoice?: Stripe.Invoice
  isRetry?: boolean
  priceId: string
  paymentMethodId: string
  customerId: string
}

type StripeHookCallback = (_event: Stripe.Event) => Promise<any> | any

export type CreateSubscriptionArgs = Partial<SubscriptionDetails> &
  Stripe.SubscriptionCreateParams

export interface StripeHookCallbacks {
  beforeCreateSubscription?: (
    _args: CreateSubscriptionArgs,
  ) => Promise<CreateSubscriptionArgs> | CreateSubscriptionArgs
  onSubscriptionUpdate?: (_sub: Stripe.Subscription) => Promise<any> | any
  onSubscriptionTrialWillEnd?: StripeHookCallback
  onInvoicePayment?: StripeHookCallback
  onInvoicePaymentFailed?: StripeHookCallback
  onCustomerSubscriptionDeleted?: StripeHookCallback
  onCustomerCreated?: (_args: {
    customer: Stripe.Customer
    id: string
    name?: string
    email?: string
  }) => Promise<any> | any
}

export type HookDictionary = {
  onCustomerCreated: {
    args: [
      {
        customer: Stripe.Customer
        orgId: string
        name?: string
        email?: string
      },
      { factorStripe: FactorStripe },
    ]
  }
  onCustomerSubscriptionDeleted: {
    args: [Stripe.Event, { factorStripe: FactorStripe }]
  }
  onInvoicePaymentFailed: {
    args: [Stripe.Event, { factorStripe: FactorStripe }]
  }
  onInvoicePayment: { args: [Stripe.Event, { factorStripe: FactorStripe }] }
  onSubscriptionTrialWillEnd: {
    args: [Stripe.Event, { factorStripe: FactorStripe }]
  }
  onSubscriptionUpdate: {
    args: [Stripe.Subscription, { factorStripe: FactorStripe }]
  }
  beforeCreateSubscription: {
    args: [CreateSubscriptionArgs, { factorStripe: FactorStripe }]
  }
  onCheckoutSuccess: {
    args: [Stripe.Event, { factorStripe: FactorStripe }]
  }
  onInvoicePaid: {
    args: [Stripe.Event, { factorStripe: FactorStripe }]
  }
}

export type ManageSubscriptionResult = EndpointResponse<Stripe.Subscription> & {
  customerId: string
  customerData?: CustomerData
  userId?: string
  user?: User
}
