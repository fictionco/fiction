import { objectId } from "@factor/api"
import type stripeNode from "stripe"
import { ManageSubscriptionResult, SubscriptionDetails } from "./types"

import { FactorStripe } from "./plugin"
export const handleCardSetupRequired = async (
  args: SubscriptionDetails,
): Promise<SubscriptionDetails | undefined> => {
  const { subscription, paymentMethodId, factorStripe } = args
  const setupIntent = subscription.pending_setup_intent

  if (
    setupIntent &&
    typeof setupIntent == "object" &&
    setupIntent.status === "requires_action" &&
    setupIntent.client_secret
  ) {
    const stripe = await factorStripe.getBrowserClient()

    const setupResult = await stripe.confirmCardSetup(
      setupIntent.client_secret,
      {
        payment_method: paymentMethodId,
      },
    )
    if (setupResult.error) {
      // start code flow to handle updating the payment details
      // Display error message in your UI.
      // The card was declined (i.e. insufficient funds, card has expired, etc)
      throw setupResult.error.message
    } else {
      if (setupResult.setupIntent.status === "succeeded") {
        // There's a risk of the customer closing the window before callback
        // execution. To handle this case, set up a webhook endpoint and
        // listen to setup_intent.succeeded.
        return args
      }
    }
  } else {
    // No customer action needed
    return args
  }
}

export const handlePaymentThatRequiresCustomerAction = async (
  args: SubscriptionDetails,
): Promise<SubscriptionDetails | undefined> => {
  const { subscription, paymentMethodId, invoice, isRetry, factorStripe } = args

  let paymentIntent: stripeNode.PaymentIntent | undefined | null | string

  /**
   *  If it's a first payment attempt, the payment intent is on the subscription latest invoice.
   *  If it's a retry, the payment intent will be on the invoice itself.
   */
  if (invoice) {
    paymentIntent = invoice.payment_intent
  } else if (typeof subscription.latest_invoice == "object") {
    paymentIntent = subscription.latest_invoice?.payment_intent
  }

  if (!paymentIntent || typeof paymentIntent == "string") return args

  if (
    (paymentIntent.status === "requires_action" ||
      (isRetry === true &&
        paymentIntent.status === "requires_payment_method")) &&
    paymentIntent.client_secret
  ) {
    const stripe = await factorStripe.getBrowserClient()

    const setupResult = await stripe.confirmCardSetup(
      paymentIntent.client_secret,
      {
        payment_method: paymentMethodId,
      },
    )
    if (setupResult.error) {
      // start code flow to handle updating the payment details
      // Display error message in your UI.
      // The card was declined (i.e. insufficient funds, card has expired, etc)
      throw setupResult
    } else {
      if (setupResult.setupIntent.status === "succeeded") {
        // There's a risk of the customer closing the window before callback
        // execution. To handle this case, set up a webhook endpoint and
        // listen to invoice.paid. This webhook endpoint returns an Invoice.
        return args
      }
    }
  } else {
    // No customer action needed
    return args
  }
}

export const handleRequiresPaymentMethod = async (
  args: SubscriptionDetails,
): Promise<SubscriptionDetails | undefined> => {
  const { subscription } = args
  if (subscription.status === "active") {
    // subscription is active, no customer actions required.
    return args
  } else if (
    typeof subscription.latest_invoice == "object" &&
    typeof subscription.latest_invoice?.payment_intent == "object" &&
    subscription.latest_invoice?.payment_intent?.status ===
      "requires_payment_method"
  ) {
    // Using localStorage to store the state of the retry here
    // (feel free to replace with what you prefer)
    // Store the latest invoice ID and status
    localStorage.setItem("latestInvoiceId", subscription.latest_invoice.id)
    localStorage.setItem(
      "latestInvoicePaymentIntentStatus",
      subscription.latest_invoice.payment_intent.status,
    )
    throw new Error("Your card was declined.")
  } else {
    return args
  }
}

export const checkPaymentMethod = async (
  args: SubscriptionDetails,
): Promise<void> => {
  await handleCardSetupRequired(args)

  await handlePaymentThatRequiresCustomerAction(args)

  await handleRequiresPaymentMethod(args)
}

export const requestCreateSubscription = async (args: {
  customerId: string
  paymentMethodId: string
  priceId: string
  factorStripe: FactorStripe
}): Promise<ManageSubscriptionResult> => {
  const { customerId, paymentMethodId, priceId, factorStripe } = args

  let result = await factorStripe.requests.ManageSubscription.request({
    customerId,
    paymentMethodId,
    priceId,
    _action: "create",
    idempotencyKey: objectId(),
  })

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
      factorStripe,
    }
    /**
     * Run through stripe payment checks
     * https://github.com/stripe-samples/subscription-use-cases/blob/master/usage-based-subscriptions/client/script.js
     */
    await checkPaymentMethod(checkArgs)
    /**
     * If successful, retrieving subscription again will update its backend status
     */
    result = await factorStripe.requests.ManageSubscription.request({
      customerId,
      _action: "retrieve",
      subscriptionId: subscription.id,
    })
  }

  return result
}
