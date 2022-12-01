import { EndpointResponse, PrivateUser } from "@factor/api"
import type Stripe from "stripe"
import type { FactorStripe } from "."

export type StripeProductConfig = {
  pricing: StripePriceConfig[]
  live: string
  test: string
  productId?: string
  productKey: string
}

export type StripePriceConfig = {
  live: string
  test: string
  priceId?: string
  quantity: number
  cost: number
  costPerUnit: number
  duration: "month" | "year"
}
export interface StripePlanInfo {
  plan: Stripe.Plan
  product: Stripe.Product | Record<string, unknown>
}

export interface CustomerData {
  customer?: Stripe.Customer | Stripe.DeletedCustomer
  subscriptions?: Stripe.ApiList<Stripe.Subscription>['data']
  usage?: Stripe.ApiList<Stripe.UsageRecordSummary>['data']
  paymentMethods?: Stripe.ApiList<Stripe.PaymentMethod>['data']
  invoices?: Stripe.ApiList<Stripe.Invoice>['data']
  allProducts?: Stripe.Product[]
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

export type StripeHookCallbacks = {
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
        id: string
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
  user?: PrivateUser
}
