import express from "express"
import * as http from "http"
import { _stop } from "@factor/api"
import { addEndpoint, logger, getPrivateUser } from "@factor/server"
import { EndpointResponse } from "@factor/types"
import Stripe from "stripe"
import { PaymentsEndpoint, EndpointMethods } from "./serverTypes"
import {
  manageCustomer,
  getCustomerData,
  manageSubscription,
  managePaymentMethod,
  getInvoices,
  getProduct,
  getAllProducts,
  getCoupon,
  getStripe,
  listCustomerSubscriptions,
} from "./serverMethods"
import { paymentsSetting } from "./util"
export const EPMap: EndpointMethods = {
  listCustomerSubscriptions,
  manageCustomer,
  getCustomerData,
  manageSubscription,
  managePaymentMethod,
  getInvoices,
  getProduct,
  getAllProducts,
  getCoupon,
}

export const initializeEndpoint = async (): Promise<void> => {
  addEndpoint({
    route: "/stripe-webhook",
    handler: async (
      request: http.IncomingMessage,
    ): Promise<EndpointResponse> => {
      let event: Stripe.Event
      const stripe = getStripe()
      try {
        const secret = process.env.STRIPE_WEBHOOK_SECRET
        if (!secret) {
          throw new Error("no secret: STRIPE_WEBHOOK_SECRET")
        }

        event = stripe.webhooks.constructEvent(
          request.rawBody,
          request.headers["stripe-signature"] as string,
          secret,
        )
      } catch (error) {
        logger({
          level: "error",
          context: "billing",
          description: `stripe error`,
          data: error,
        })

        logger({
          level: "error",
          context: "billing",
          description: `stripe error: Webhook signature verification failed. Check the env file and enter the correct webhook secret`,
        })

        return { status: "error" }
      }

      const {
        onInvoicePayment,
        onInvoicePaymentFailed,
        onCustomerSubscriptionDeleted,
        onSubscriptionTrialWillEnd,
      } = paymentsSetting("hooks") ?? {}

      // Handle the event
      // Review important events for Billing webhooks
      // https://stripe.com/docs/billing/webhooks
      // Remove comment to see the various objects sent for this sample
      if (event.type == "invoice.paid") {
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your
        // database to reference when a user accesses your service to avoid hitting rate limits.
        if (onInvoicePayment) onInvoicePayment(event)
      } else if (event.type == "invoice.payment_failed") {
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        if (onInvoicePaymentFailed) onInvoicePaymentFailed(event)
      } else if (event.type == "customer.subscription.deleted") {
        /**
         * if event.request is null, then it was cancelled from settings vs request
         */
        if (onCustomerSubscriptionDeleted) onCustomerSubscriptionDeleted(event)
      } else if (event.type == "customer.subscription.trial_will_end") {
        /**
         * Three days before the trial period is up, a customer.subscription.trial_will_end event is sent to your webhook endpoint.
         * You can use that notification as a trigger to take any necessary actions, such as informing the customer that billing is about to begin.
         * https://stripe.com/docs/billing/subscriptions/trials
         */
        if (onSubscriptionTrialWillEnd) onSubscriptionTrialWillEnd(event)
      } else {
        logger({
          level: "error",
          context: "billing",
          description: `unexpected event type`,
          data: event.data.object,
        })
      }

      return { status: "success" }
    },
  })
  addEndpoint({
    route: "/payments/:_method",
    handler: async (request: express.Request): Promise<EndpointResponse> => {
      const _method = request.params._method as keyof PaymentsEndpoint
      const args = request.body
      const { userId } = request.bearer ?? {}

      let r: EndpointResponse = {
        status: "error",
        message: `method missing in endpoint map /payments/${_method}`,
      }

      try {
        if (!userId) throw _stop({ message: "you must be logged in" })
        args.userId = userId
        args.bearer = request.bearer
        if (EPMap[_method]) {
          r = await EPMap[_method](args)

          if (r.customerId) {
            r.customerData = (
              await getCustomerData({ ...args, customerId: r.customerId })
            ).data
          }

          if (r.userId) {
            r.user = (await getPrivateUser({ userId: r.userId })).data
          }
        }
      } catch (error: any) {
        const { query, params, bearer } = request

        logger({
          level: "error",
          context: "billing",
          description: `billing endpoint error: ${_method}`,
          data: error,
        })
        logger({
          level: "error",
          context: "billing",
          description: `billing endpoint params: ${_method}`,
          data: {
            query,
            params,
            bearer,
          },
        })

        r = {
          status: "error",
          message: error.expose ? error.message : "an internal error occurred",
          code: error.code,
        }
      }

      return r
    },
  })
}
