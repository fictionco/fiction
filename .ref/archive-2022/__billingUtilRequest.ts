// import {
//   PaymentsFetch,
//   PaymentsEndpoint,
//   PaymentsEndpointMethod,
// } from "@factor/plugin-stripe/serverTypes"
// import {
//   endpointFetch,
//   userInitialized,
//   storeItem,
//   objectId,
//   dLog,
// } from "@factor/api"
// import { activeCustomerId } from "@kaption/engine/activeProject"
// import { checkPaymentMethod } from "@factor/plugin-stripe/subscription"

// type EndpointProp<
//   T extends keyof PaymentsEndpoint,
//   U extends "endpoint" | "request" | "response" | "method",
// > = PaymentsFetch<T>[U]

// export const requestPaymentEndpoint = async <T extends keyof PaymentsEndpoint>(
//   method: EndpointProp<T, "method">,
//   data: EndpointProp<T, "request">,
// ): Promise<EndpointProp<T, "response">> => {
//   await userInitialized()
//   const customerId = activeCustomerId.value
//   const endpoint = `/payments/${method}` as `/payments/${T}`
//   const r = await endpointFetch<PaymentsFetch<T>>(endpoint, {
//     customerId,
//     ...data,
//   })

//   if (r.customerData) {
//     dLog("info", "customer data", r.customerData)
//     storeItem("customerData", r.customerData)
//   }

//   return r
// }

// export const requestCreateSubscription: PaymentsEndpointMethod<
//   "manageSubscription"
// > = async (args) => {
//   const { customerId, paymentMethodId, priceId } = args

//   const createArgs = {
//     ...args,
//     _action: "create",
//     idempotencyKey: objectId(),
//   } as const

//   let result = await requestPaymentEndpoint<"manageSubscription">(
//     "manageSubscription",
//     createArgs,
//   )

//   const subscription = result.data

//   if (
//     result.status === "success" &&
//     subscription &&
//     paymentMethodId &&
//     priceId &&
//     customerId
//   ) {
//     const checkArgs = {
//       subscription,
//       customerId,
//       paymentMethodId,
//       priceId,
//     }
//     /**
//      * Run through stripe payment checks
//      * https://github.com/stripe-samples/subscription-use-cases/blob/master/usage-based-subscriptions/client/script.js
//      */
//     await checkPaymentMethod(checkArgs)
//     /**
//      * If successful, retrieving subscription again will update its backend status
//      */
//     result = await requestPaymentEndpoint("manageSubscription", {
//       customerId,
//       _action: "retrieve",
//       idempotencyKey: objectId(),
//       subscriptionId: subscription.id,
//     })
//   }

//   return result
// }
