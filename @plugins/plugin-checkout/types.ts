import { EndpointParameters } from "@factor/endpoint"

import Stripe from "stripe"

export interface SubscriptionResult {
  status: "success" | "failure"
  customer: Stripe.Customer
  subscription: Stripe.Subscription
}

export type SubscriptionCustomerData = {
  plan: string
  subscriptionPlanId?: string
  paymentMethodId: string
} & EndpointParameters

declare module "@factor/user/types" {
  interface FactorUser {
    stripeCustomerId?: string
  }
}
