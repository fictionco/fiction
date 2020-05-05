import { addRoutes, setting, endpointRequest, waitFor } from "@factor/api"

import { SubscriptionCustomerData, SubscriptionResult } from "./types"

const env = process.env.NODE_ENV
declare global {
  interface Window {
    Stripe: stripe.Stripe
  }
}

export const getPlanId = (plan: string): string => {
  const allPlans = setting(`checkout.${env}.plans`)

  return allPlans[plan]
}

export const requestCreateSubscription = async (
  params: SubscriptionCustomerData
): Promise<SubscriptionResult> => {
  params.subscriptionPlanId = getPlanId(params.plan)

  if (!params.subscriptionPlanId) {
    throw new Error("Missing subscription ID")
  }

  return await endpointRequest<SubscriptionResult>({
    id: "pluginCheckout",
    method: "createSubscription",
    params,
  })
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

/**
 * Checkout Routes
 */
addRoutes({
  location: "content",
  key: "checkoutPlugin",
  routes: [setting("checkout.routes.checkout")],
})
