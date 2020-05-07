/* eslint-disable @typescript-eslint/camelcase */
import { addEndpoint, addFilter, setting } from "@factor/api"
import Stripe from "stripe"
import { savePost } from "@factor/api/server"
import { EndpointMeta } from "@factor/endpoint/types"
import {
  SubscriptionResult,
  SubscriptionCustomerData,
  PlanInfo,
  CustomerComposite,
  UpdateSubscription,
} from "./types"

const getStripe = (): Stripe => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe private key is missing.")
  }

  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2020-03-02" })
}

export const createSubscription = async (
  { paymentMethodId, subscriptionPlanId }: SubscriptionCustomerData,
  { bearer }: EndpointMeta
): Promise<SubscriptionResult> => {
  if (!bearer) {
    throw new Error("Bearer user is not defined")
  }
  const stripe = getStripe()

  let stripeCustomerId = bearer.stripeCustomerId
  let stripeCustomer: Stripe.Customer

  if (!stripeCustomerId) {
    // This creates a new Customer and attaches the PaymentMethod in one API call.
    stripeCustomer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: bearer.email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    stripeCustomerId = stripeCustomer.id

    await savePost(
      {
        data: { _id: bearer._id, stripeCustomerId: stripeCustomer.id },
        postType: "user",
      },
      { bearer }
    )
  } else {
    stripeCustomer = (await stripe.customers.retrieve(
      stripeCustomerId
    )) as Stripe.Customer
  }

  const stripeSubscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ plan: subscriptionPlanId as string }],
    expand: ["latest_invoice.payment_intent"],
  })

  return {
    status: "success",
    customer: stripeCustomer,
    subscription: stripeSubscription,
  }
}

/**
 * Retrieve Stripe customer by customer Id
 * @param id - Stripe customer ID
 */
export const retrieveCustomer = async ({
  id,
}: {
  id: string
}): Promise<Stripe.Customer | Stripe.DeletedCustomer> => {
  const stripe = getStripe()

  const customer = await stripe.customers.retrieve(id)

  return customer
}

/**
 * Retrieve Stripe payment methods by customer Id
 * @param id - Stripe customer ID
 */
export const retrievePaymentMethods = async ({
  customer,
}: {
  customer: string
}): Promise<Stripe.ApiList<Stripe.PaymentMethod>> => {
  const stripe = getStripe()

  const methods = await stripe.paymentMethods.list({ customer, type: "card" })

  return methods
}

export const retrieveInvoices = async ({
  customer,
  limit = 30,
  starting_after,
}: {
  customer: string
  limit?: number
  starting_after?: string
}): Promise<Stripe.ApiList<Stripe.Invoice>> => {
  const stripe = getStripe()
  return await stripe.invoices.list({ customer, starting_after, limit })
}

/**
 * Retrieve Stripe plan by Id
 * @reference https://stripe.com/docs/api/plans/retrieve?lang=node
 * @param id - Stripe plan ID
 */
export const retrievePlan = async ({ id }: { id: string }): Promise<PlanInfo> => {
  const stripe = getStripe()

  const plan = await stripe.plans.retrieve(id)
  let product = {}
  if (typeof plan.product == "string") {
    product = await stripe.products.retrieve(plan.product)
  }
  return { plan, product }
}

export const retrieveAllPlans = async (): Promise<PlanInfo[]> => {
  const planSetting = setting<Record<string, Record<string, string>>>(
    `checkout.${process.env.NODE_ENV}.plans`
  )
  let planIds: string[] = []

  Object.values(planSetting).forEach((val) => {
    planIds = [...planIds, ...Object.values(val)]
  })

  return await Promise.all(planIds.map((id) => retrievePlan({ id })))
}

/**
 * Get a composite of all relevant user information
 * @param id - customer id
 */
export const retrieveCustomerComposite = async ({
  id,
}: {
  id: string
}): Promise<CustomerComposite> => {
  const [customer, invoices, paymentMethods, allPlans] = await Promise.all([
    retrieveCustomer({ id }),
    retrieveInvoices({ customer: id }),
    retrievePaymentMethods({ customer: id }),
    retrieveAllPlans(),
  ])

  return {
    customer,
    invoices,
    paymentMethods,
    allPlans,
  }
}

/**
 * Standard updates on Stripe subscriptions
 */
export const serverUpdateSubscription = async (
  params: UpdateSubscription
): Promise<Stripe.Subscription | undefined> => {
  const { subscriptionId, planId, action } = params

  const stripe = getStripe()

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  let result: Stripe.Subscription | undefined

  if (action == "delete") {
    await stripe.subscriptions.del(subscriptionId)
  } else if (action == "cancel" || action == "restore") {
    // https://stripe.com/docs/billing/subscriptions/cancel
    const cancel_at_period_end = action == "cancel" ? true : false
    result = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end })
  } else if (action == "change") {
    // https://stripe.com/docs/billing/subscriptions/upgrade-downgrade
    result = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      billing_cycle_anchor: "now",
      proration_behavior: "create_prorations",
      items: [
        {
          id: subscription.items.data[0].id,
          plan: planId,
        },
      ],
    })
  }

  return result
}

const setup = (): void => {
  addEndpoint({
    id: "pluginCheckout",
    handler: {
      createSubscription,
      retrievePlan,
      retrieveCustomer,
      retrievePaymentMethods,
      retrieveInvoices,
      retrieveCustomerComposite,
      serverUpdateSubscription,
      retrieveAllPlans,
    },
  })

  addFilter({
    key: "addStripeInfo",
    hook: "schema-definition-user",
    callback: (definition) => {
      definition.stripeCustomerId = {
        type: String,
      }
      return definition
    },
  })
}

setup()
