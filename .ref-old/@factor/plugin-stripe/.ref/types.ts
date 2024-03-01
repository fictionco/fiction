import StripeNode from "stripe"

// export interface ProductConfig {
//   slug: string
//   title: string
//   description: string
//   plans: {
//     interval: string
//     production: string
//     development: string
//     [key: string]: string
//   }[]
// }

// export interface UpdateSubscription {
//   subscriptionId: string
//   planId?: string
//   action: "cancel" | "change" | "restore" | "delete"
// }

// export type StripeEndpointParameters = EndpointParameters & {
//   idempotencyKey: string
// }

// export interface SubscriptionResult {
//   status: "success" | "failure"
//   customer: StripeNode.Customer | StripeNode.DeletedCustomer
//   subscription: StripeNode.Subscription
// }

// export interface CustomerComposite {
//   customer: StripeNode.Customer | StripeNode.DeletedCustomer
//   paymentMethods: StripeNode.ApiList<StripeNode.PaymentMethod>
//   invoices: StripeNode.ApiList<StripeNode.Invoice>
//   allPlans: PlanInfo[]
// }

// export interface PlanInfo {
//   plan: StripeNode.Plan
//   product: StripeNode.Product | Record<string, unknown>
// }

// export type SubscriptionCustomerData = {
//   plan: StripeNode.Plan
//   subscriptionPlanId?: string
//   paymentMethodId: string
//   coupon?: string
// }

// declare module "@factor/user/types" {
//   interface FactorUser {
//     stripeCustomerId?: string
//   }
// }
