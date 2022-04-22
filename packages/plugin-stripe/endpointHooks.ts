import * as http from "http"
import { EndpointResponse, runHooks, Endpoint } from "@factor/api"
import Stripe from "stripe"
import type { FactorStripe } from "."

const stripeHookHandler =
  (factorStripe: FactorStripe) =>
  async (request: http.IncomingMessage): Promise<EndpointResponse> => {
    let event: Stripe.Event
    const stripe = factorStripe.getServerClient()
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
      factorStripe.log.error(`stripe error`, { error })

      factorStripe.log.error(
        `stripe error: Webhook signature verification failed. Check the env file and enter the correct webhook secret`,
      )

      return { status: "error" }
    }

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    if (event.type == "invoice.paid") {
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.

      await runHooks({
        list: factorStripe.hooks,
        hook: "onInvoicePayment",
        args: [event, { factorStripe }],
      })
    } else if (event.type == "invoice.payment_failed") {
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.

      await runHooks({
        list: factorStripe.hooks,
        hook: "onInvoicePaymentFailed",
        args: [event, { factorStripe }],
      })
    } else if (event.type == "customer.subscription.deleted") {
      /**
       * if event.request is null, then it was cancelled from settings vs request
       */

      await runHooks({
        list: factorStripe.hooks,
        hook: "onCustomerSubscriptionDeleted",
        args: [event, { factorStripe }],
      })
    } else if (event.type == "customer.subscription.trial_will_end") {
      /**
       * Three days before the trial period is up, a customer.subscription.trial_will_end event is sent to your webhook endpoint.
       * You can use that notification as a trigger to take any necessary actions, such as informing the customer that billing is about to begin.
       * https://stripe.com/docs/billing/subscriptions/trials
       */

      await runHooks({
        list: factorStripe.hooks,
        hook: "onSubscriptionTrialWillEnd",
        args: [event, { factorStripe }],
      })
    } else {
      factorStripe.log.error(`unexpected event type`, {
        data: event.data.object,
      })
    }

    return { status: "success" }
  }
export class EndpointMethodStripeHooks extends Endpoint {
  constructor(settings: { factorStripe: FactorStripe; serverUrl: string }) {
    super({
      key: "stripeWebhooks",
      basePath: "/stripe-webhook",
      requestHandler: stripeHookHandler(settings.factorStripe),
      serverUrl: settings.serverUrl,
    })
  }
}
