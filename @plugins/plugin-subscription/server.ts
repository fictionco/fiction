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
  StripeEndpointParameters,
} from "./types"

const getStripe = (): Stripe => {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

  if (!STRIPE_SECRET_KEY) {
    throw new Error("Stripe private key is missing.")
  }

  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2020-03-02" })
}

/**
 * Retrieve Stripe customer by customer Id
 * If no custom Id is passed it will use the bearer
 * If no customer has been created yet, then it will create and attach to bearer
 * @param customerId - Stripe customer ID
 */
export const serverRetrieveCustomer = async (
  {
    customerId,
  }: {
    customerId?: string
  },
  { bearer }: EndpointMeta
): Promise<Stripe.Customer | Stripe.DeletedCustomer> => {
  const stripe = getStripe()

  let customer

  if (!customerId && bearer?.stripeCustomerId) {
    customerId = bearer.stripeCustomerId
  }

  if (customerId) {
    customer = await stripe.customers.retrieve(customerId)
  } else if (!customerId && bearer) {
    customer = await stripe.customers.create({
      email: bearer.email,
      name: bearer.displayName,
      phone: bearer.phoneNumber,
      metadata: { _id: bearer._id.toString(), username: bearer.username ?? "" },
    })

    customerId = customer.id

    await savePost(
      {
        data: { _id: bearer._id, stripeCustomerId: customer.id },
        postType: "user",
      },
      { bearer }
    )
  } else {
    throw new Error("could not get Stripe customer")
  }

  return customer
}

export const serverSetDefaultPaymentMethod = async ({
  customerId,
  paymentMethodId,
}: {
  customerId: string
  paymentMethodId: string
}): Promise<Stripe.Customer> => {
  const stripe = getStripe()
  return await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

export const serverRetrieveCoupon = async ({
  coupon,
}: {
  coupon: string
}): Promise<Stripe.Coupon> => {
  const stripe = getStripe()
  return await stripe.coupons.retrieve(coupon)
}

export const createSubscription = async (
  {
    paymentMethodId,
    subscriptionPlanId,
    idempotencyKey,
    coupon
  }: SubscriptionCustomerData & StripeEndpointParameters,
  { bearer }: EndpointMeta
): Promise<SubscriptionResult> => {
  if (!bearer) {
    throw new Error("Bearer user is not defined")
  }
  const stripe = getStripe()

  const stripeCustomerId = bearer.stripeCustomerId
  const stripeCustomer:
    | Stripe.Customer
    | Stripe.DeletedCustomer = await serverRetrieveCustomer(
    {
      customerId: stripeCustomerId,
    },
    { bearer }
  )

  if (paymentMethodId) {
    await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomer.id })

    await serverSetDefaultPaymentMethod({
      customerId: stripeCustomer.id,
      paymentMethodId,
    })
  }

  const stripeSubscription = await stripe.subscriptions.create(
    {
      customer: stripeCustomer.id,
      items: [{ plan: subscriptionPlanId as string }],
      coupon,
      expand: ["latest_invoice.payment_intent"],
    },
    { idempotencyKey }
  )

  return {
    status: "success",
    customer: stripeCustomer,
    subscription: stripeSubscription,
  }
}

/**
 * Retrieve Stripe payment methods by customer Id
 * @param id - Stripe customer ID
 */
export const serverRetrievePaymentMethods = async ({
  customer,
}: {
  customer: string
}): Promise<Stripe.ApiList<Stripe.PaymentMethod>> => {
  const stripe = getStripe()

  const methods = await stripe.paymentMethods.list({ customer, type: "card" })

  return methods
}

export const serverRetrieveInvoices = async ({
  customer,
  limit = 100,
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
export const serverRetrievePlan = async ({ id }: { id: string }): Promise<PlanInfo> => {
  const stripe = getStripe()

  const plan = await stripe.plans.retrieve(id)
  let product = {}
  if (typeof plan.product == "string") {
    product = await stripe.products.retrieve(plan.product)
  }
  return { plan, product }
}

export const serverRetrieveAllPlans = async (): Promise<PlanInfo[]> => {
  const planSetting = setting<Record<string, Record<string, string>>>(
    `checkout.${process.env.NODE_ENV}.plans`
  )
  let planIds: string[] = []

  Object.values(planSetting).forEach((val) => {
    planIds = [...planIds, ...Object.values(val)]
  })

  return await Promise.all(planIds.map((id) => serverRetrievePlan({ id })))
}

/**
 * Get a composite of all relevant user information
 * @param id - customer id
 */
export const serverCustomerComposite = async (
  {
    customerId,
  }: {
    customerId: string
  },
  meta: EndpointMeta
): Promise<CustomerComposite> => {
  const [customer, invoices, paymentMethods, allPlans] = await Promise.all([
    serverRetrieveCustomer({ customerId }, meta),
    serverRetrieveInvoices({ customer: customerId }),
    serverRetrievePaymentMethods({ customer: customerId }),
    serverRetrieveAllPlans(),
  ])

  return {
    customer,
    invoices,
    paymentMethods,
    allPlans,
  }
}

export const serverPaymentMethodAction = async (
  {
    customerId,
    paymentMethodId,
    action,
  }: {
    customerId: string
    paymentMethodId: string
    action: "delete" | "default" | "setup"
  },
  meta: EndpointMeta
): Promise<Stripe.SetupIntent | Stripe.Customer> => {
  const stripe = getStripe()

  let result

  if (action == "setup") {
    result = await stripe.setupIntents.create({
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      description: "CC",
    })

    await serverSetDefaultPaymentMethod({
      customerId,
      paymentMethodId,
    })
  } else if (action == "delete") {
    await stripe.paymentMethods.detach(paymentMethodId)
    result = (await serverRetrieveCustomer({ customerId }, meta)) as Stripe.Customer
  } else if (action == "default") {
    result = await serverSetDefaultPaymentMethod({
      customerId,
      paymentMethodId,
    })
  } else {
    throw new Error("No action provided")
  }

  return result
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
      serverRetrievePlan,
      serverRetrieveCustomer,
      serverRetrievePaymentMethods,
      serverRetrieveInvoices,
      serverCustomerComposite,
      serverUpdateSubscription,
      serverRetrieveAllPlans,
      serverPaymentMethodAction,
      serverRetrieveCoupon,
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
