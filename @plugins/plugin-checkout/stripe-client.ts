import { setting, endpointRequest, waitFor, storeItem } from "@factor/api"
import { EndpointParameters } from "@factor/endpoint"
import { SubscriptionCustomerData, SubscriptionResult, PlanInfo } from "./types"
const env = process.env.NODE_ENV
declare global {
  interface Window {
    Stripe: stripe.Stripe
  }
}

export const sendRequest = async <T>(
  method: string,
  params: EndpointParameters
): Promise<T> => {
  return await endpointRequest<T>({
    id: "pluginCheckout",
    method,
    params,
  })
}

export const getPlanId = (
  productKey: string,
  interval: "year" | "month" = "year"
): string => {
  const allPlans = setting(`checkout.${env}.plans`) ?? {}

  const plans = allPlans[productKey] ?? productKey

  if (typeof plans == "object") {
    return plans[interval]
  } else {
    return plans
  }
}

export const requestPlanInfo = async (
  productKey: string,
  interval = "year"
): Promise<PlanInfo> => {
  const id = getPlanId(productKey, interval as "month" | "year")

  const { plan, product } = await sendRequest<PlanInfo>("retrievePlan", { id })

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

  return await sendRequest<SubscriptionResult>("createSubscription", params)
}

let __tries = 0
let __stripeClient: stripe.Stripe
export const getStripeClient = async (): Promise<stripe.Stripe> => {
  await waitFor(50)

  if (__stripeClient) {
    return __stripeClient
  } else if (window.Stripe) {
    const key = setting(`checkout.${env}.publishableKey`)

    __stripeClient = window.Stripe(key)

    return __stripeClient
  } else if (__tries < 5) {
    __tries++

    return await getStripeClient()
  } else {
    throw new Error("Couldn't get Stripe client")
  }
}
