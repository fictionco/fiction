import type Stripe from "stripe"

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
  subscription: Stripe.Subscription
  invoice?: Stripe.Invoice
  isRetry?: boolean
  priceId: string
  paymentMethodId: string
  customerId: string
}

type StripeHookCallback = (event: Stripe.Event) => Promise<any> | any

export type CreateSubscriptionArgs = Partial<SubscriptionDetails> &
  Stripe.SubscriptionCreateParams

export type StripeOptions = {
  products: {
    value: string
    productId?: string
    priceId?: string
    primary?: true
  }[]
  hooks?: {
    beforeCreateSubscription?: (
      args: CreateSubscriptionArgs,
    ) => Promise<CreateSubscriptionArgs> | CreateSubscriptionArgs
    onSubscriptionUpdate?: (sub: Stripe.Subscription) => Promise<any> | any
    onSubscriptionTrialWillEnd?: StripeHookCallback
    onInvoicePayment?: StripeHookCallback
    onInvoicePaymentFailed?: StripeHookCallback
    onCustomerSubscriptionDeleted?: StripeHookCallback
    onCustomerCreated: (args: {
      customer: Stripe.Customer
      id: string
      name?: string
      email?: string
    }) => Promise<any> | any
  }
  [key: string]: any
}
