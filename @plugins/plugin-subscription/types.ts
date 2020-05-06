import { EndpointParameters } from "@factor/endpoint"
import StripeNode from "stripe"

export interface SubscriptionResult {
  status: "success" | "failure"
  customer: StripeNode.Customer | StripeNode.DeletedCustomer
  subscription: StripeNode.Subscription
}

export interface CustomerComposite {
  customer: StripeNode.Customer | StripeNode.DeletedCustomer
  paymentMethods: StripeNode.ApiList<StripeNode.PaymentMethod>
  invoices: StripeNode.ApiList<StripeNode.Invoice>
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
