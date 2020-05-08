import {
  setting,
  endpointRequest,
  waitFor,
  storeItem,
  stored,
  emitEvent,
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
} from "./types"

const env = process.env.NODE_ENV
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
    params,
  })
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
  const customer = await sendRequest<StripeNode.Customer>("retrieveCustomer", {
    customerId: user.stripeCustomerId,
  })

  storeItem("stripeCustomer", customer)

  return customer
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

// export const requestSetupPaymentMethod = async (params: {
//   customerId: string
//   paymentMethodId: string
//   cardDescription?: string
// }): Promise<StripeNode.SetupIntent> => {
//   const result = await sendRequest<StripeNode.SetupIntent>(
//     "serverSetupPaymentMethod",
//     params
//   )

//   emitEvent("refresh-user")

//   return result
// }

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
