import { EndpointResponse, HookType, PrivateUser } from "@factor/api"
import { FactorUser } from "@factor/api/plugin-user"
import { FactorServer } from "@factor/api/plugin-server"
import type Stripe from "stripe"
import type { FactorStripe } from "."

export type StripePluginSettings = {
  factorServer: FactorServer
  factorUser: FactorUser
  stripeMode: "test" | "live"
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  hooks?: HookType<HookDictionary>[]
  products: StripeProductConfig[]
}
export type StripeProductConfig = {
  priceId?: string
  productId?: string
  key: string
}

export interface StripePlanInfo {
  plan: Stripe.Plan
  product: Stripe.Product | Record<string, unknown>
}

export interface CustomerData {
  customer?: Stripe.Customer | Stripe.DeletedCustomer
  subscriptions?: Stripe.ApiList<Stripe.Subscription>
  usage?: Stripe.ApiList<Stripe.UsageRecordSummary>
  paymentMethods?: Stripe.ApiList<Stripe.PaymentMethod>
  invoices?: Stripe.ApiList<Stripe.Invoice>
  allProducts?: Stripe.Product[]
  idempotencyKey: string
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
}

export type ManageSubscriptionResult = EndpointResponse<Stripe.Subscription> & {
  customerId: string
  customerData?: CustomerData
  userId?: string
  user?: PrivateUser
}
