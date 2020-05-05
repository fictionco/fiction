import { EndpointParameters } from "@factor/endpoint"
import StripeNode from "stripe"

export interface SubscriptionResult {
  status: "success" | "failure"
  customer: StripeNode.Customer
  subscription: StripeNode.Subscription
}

export interface PlanInfo {
  plan: StripeNode.Plan
  product: StripeNode.Product | {}
}

export type SubscriptionCustomerData = {
  plan: StripeNode.Plan
  subscriptionPlanId?: string
  paymentMethodId: string
} & EndpointParameters

declare module "@factor/user/types" {
  interface FactorUser {
    stripeCustomerId?: string
  }
}
