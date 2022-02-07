import { FactorPluginConfigApp } from "@factor/types"
import * as StripeJS from "@stripe/stripe-js"
import type Stripe from "stripe"

export * from "./util"
export * from "./endpoints"

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
}

export const stripeEnv = (): "production" | "development" => {
  let env = ""

  if (process.env.TEST_ENV) {
    env = "development"
  } else {
    env = process.env.STRIPE_ENV || process.env.NODE_ENV || "development"
  }

  return env as "production" | "development"
}

/**
 * Doc engine settings utility
 */
let __settings: Partial<StripeOptions> = {}
export const paymentsSetting = <T extends keyof StripeOptions>(
  key: T,
): Partial<StripeOptions>[T] => {
  const v: Partial<StripeOptions>[T] = __settings[key]
  return v
}

export const createSettings = (options: Partial<StripeOptions>): void => {
  const defaultSettings: Partial<StripeOptions> = {}

  __settings = { ...defaultSettings, ...options }
}

/**
 * Get the stripe client using public key
 * @singleton
 */
let __stripeClient: StripeJS.Stripe | undefined = undefined
export const getStripeClient = async (): Promise<StripeJS.Stripe> => {
  if (!__stripeClient) {
    const publicKey =
      stripeEnv() == "production"
        ? process.env.STRIPE_PUBLIC_KEY
        : process.env.STRIPE_PUBLIC_KEY_TEST

    if (!publicKey) throw new Error("no stripe public key")

    __stripeClient = (await StripeJS.loadStripe(publicKey)) ?? undefined
  }

  if (!__stripeClient) throw new Error("no stripe client created")

  return __stripeClient
}

export default (options: Partial<StripeOptions>): FactorPluginConfigApp => {
  createSettings(options)
  return { name: "StripeApp" }
}
