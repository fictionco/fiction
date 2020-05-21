import {
  setting,
  endpointRequest,
  waitFor,
  storeItem,
  stored,
  emitEvent,
  randomToken,
} from "@factor/api"
import { EndpointParameters } from "@factor/endpoint"
import { FactorUser } from "@factor/user/types"
import StripeNode from "stripe"
import {
  SubscriptionCustomerData,
  SubscriptionResult,
  PlanInfo,
  CustomerComposite,
  UpdateSubscription,
  ProductConfig,
} from "./types"

/**
 * Used to prevent duplicate transactions
 * https://stripe.com/docs/api/idempotent_requests
 */
const idempotencyKey = randomToken()

/**
 * Client stripe is added to global window
 */
declare global {
  interface Window {
    Stripe: stripe.Stripe
  }
}

export const sendRequest = async <T>(
  method: string,
  params: EndpointParameters = {}
): Promise<T> => {
  return await endpointRequest<T>({
    id: "pluginCheckout",
    method,
    params: { idempotencyKey, ...params },
  })
}

/**
 * Gets a coupon's details with its code
 */
export const requestCoupon = async (params: {
  coupon: string
}): Promise<StripeNode.Coupon> => {
  return await sendRequest<StripeNode.Coupon>("serverRetrieveCoupon", params)
}

export const requestAllPlans = async (): Promise<PlanInfo[]> => {
  if (stored("allPlans")) {
    return stored("allPlans")
  }
  const allPlans = await sendRequest<PlanInfo[]>("serverRetrieveAllPlans")

  storeItem("allPlans", allPlans)

  return allPlans
}

/**
 * Gets a composite of relevant customer information
 * @param customerId - stripe customer id
 */
export const requestCustomerComposite = async (
  customerId: string
): Promise<CustomerComposite> => {
  const composite = await sendRequest<CustomerComposite>("serverCustomerComposite", {
    customerId,
  })

  storeItem("customerComposite", composite)

  return composite
}

export const requestUpdateSubscription = async (
  options: UpdateSubscription
): Promise<StripeNode.Subscription | undefined> => {
  const result = await sendRequest<StripeNode.Subscription | undefined>(
    "serverUpdateSubscription",
    options as UpdateSubscription & EndpointParameters
  )
  emitEvent("refresh-user")

  return result
}

export const requestCustomer = async (user: FactorUser): Promise<StripeNode.Customer> => {
  const customer = await sendRequest<StripeNode.Customer>("serverRetrieveCustomer", {
    customerId: user.stripeCustomerId,
  })

  storeItem("stripeCustomer", customer)

  return customer
}

export const getProductConfig = (slug: string): ProductConfig | undefined => {
  const products: ProductConfig[] = setting(`subscriptions.products`) ?? {}

  return products.find((product) => product.slug == slug)
}

export const getPlanId = (
  slug: string,
  interval: "year" | "month" = "year"
): string | undefined => {
  const product = getProductConfig(slug)

  const plan = product?.plans.find((plan) => plan.interval == interval)

  const env = process.env.NODE_ENV ?? "production"
  return plan ? plan[env] : undefined
}

export const requestPlanInfo = async (
  productKey: string,
  interval = "year"
): Promise<PlanInfo> => {
  const id = getPlanId(productKey, interval as "month" | "year")

  const { plan, product } = await sendRequest<PlanInfo>("serverRetrievePlan", { id })

  storeItem("planInfo", plan)
  storeItem("productInfo", product)

  return { plan, product }
}

export const requestCreateSubscription = async (
  params: SubscriptionCustomerData
): Promise<SubscriptionResult> => {
  params.subscriptionPlanId = params.plan?.id

  if (!params.subscriptionPlanId) {
    throw new Error("Missing subscription ID")
  }

  emitEvent("refresh-user")

  return await sendRequest<SubscriptionResult>("createSubscription", params)
}

export const requestPaymentMethodAction = async (params: {
  customerId: string
  paymentMethodId: string
  action: "default" | "delete" | "setup"
}): Promise<StripeNode.SetupIntent | StripeNode.Customer> => {
  const result = await sendRequest<StripeNode.SetupIntent | StripeNode.Customer>(
    "serverPaymentMethodAction",
    params
  )

  emitEvent("refresh-user")

  return result
}

let __tries = 0
let __stripeClient: stripe.Stripe
export const getStripeClient = async (): Promise<stripe.Stripe> => {
  await waitFor(50)

  if (__stripeClient) {
    return __stripeClient
  } else if (window.Stripe) {
    const key = setting(`subscriptions.publishableKey.${process.env.NODE_ENV}`)

    __stripeClient = window.Stripe(key)

    return __stripeClient
  } else if (__tries < 5) {
    __tries++

    return await getStripeClient()
  } else {
    throw new Error("Couldn't get Stripe client")
  }
}
