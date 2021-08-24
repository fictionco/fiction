import {
  PaymentsFetch,
  PaymentsEndpoint,
  PaymentsEndpointMethod,
} from "./serverTypes"
import {
  endpointFetch,
  userInitialized,
  storeItem,
  objectId,
  dLog,
} from "@factor/api"

import { checkPaymentMethod } from "./subscription"

type EndpointProp<
  T extends keyof PaymentsEndpoint,
  U extends "endpoint" | "request" | "response" | "method",
> = PaymentsFetch<T>[U]

export const requestPaymentEndpoint = async <T extends keyof PaymentsEndpoint>(
  method: EndpointProp<T, "method">,
  data: EndpointProp<T, "request">,
): Promise<EndpointProp<T, "response">> => {
  await userInitialized()
  const endpoint = `/payments/${method}` as `/payments/${T}`
  const r = await endpointFetch<PaymentsFetch<T>>(endpoint, data)

  if (r.customerData) {
    dLog("info", "customer data", r.customerData)
    storeItem("customerData", r.customerData)
  }

  return r
}

export const requestManageCustomer: PaymentsEndpointMethod<"manageCustomer"> =
  async (args) => {
    const customer = await requestPaymentEndpoint<"manageCustomer">(
      "manageCustomer",
      args,
    )

    return customer
  }

export const requestCreateSubscription: PaymentsEndpointMethod<"manageSubscription"> =
  async (args) => {
    const { customerId, paymentMethodId, priceId } = args
    let result = await requestPaymentEndpoint<"manageSubscription">(
      "manageSubscription",
      {
        customerId,
        paymentMethodId,
        priceId,
        _action: "create",
        idempotencyKey: objectId(),
      },
    )

    const subscription = result.data

    if (
      result.status == "success" &&
      subscription &&
      paymentMethodId &&
      priceId &&
      customerId
    ) {
      const checkArgs = {
        subscription,
        customerId,
        paymentMethodId,
        priceId,
      }
      /**
       * Run through stripe payment checks
       * https://github.com/stripe-samples/subscription-use-cases/blob/master/usage-based-subscriptions/client/script.js
       */
      await checkPaymentMethod(checkArgs)
      /**
       * If successful, retrieving subscription again will update its backend status
       */
      result = await requestPaymentEndpoint("manageSubscription", {
        customerId,
        _action: "retrieve",
        idempotencyKey: objectId(),
        subscriptionId: subscription.id,
      })
    }

    return result
  }
