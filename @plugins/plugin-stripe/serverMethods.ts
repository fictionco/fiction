import { _stop, objectId } from "@factor/api"
import { PaymentsEndpointMethodWithBearer } from "./serverTypes"
import { paymentsSetting } from "./util"
import { CustomerData } from "./types"
import Stripe from "stripe"

export const stripeEnv = (): "production" | "development" => {
  const env = process.env.STRIPE_ENV || process.env.NODE_ENV || "development"

  return env as "production" | "development"
}

export const stripeSecretKey = (): string => {
  const stripeSecretKey =
    stripeEnv() == "production"
      ? process.env.STRIPE_SECRET_KEY
      : process.env.STRIPE_SECRET_KEY_TEST

  if (!stripeSecretKey) {
    throw new Error(`Stripe secret key missing: ${stripeEnv()}`)
  }

  return stripeSecretKey
}

export const getStripe = (): Stripe => {
  return new Stripe(stripeSecretKey(), { apiVersion: "2020-08-27" })
}

export const manageCustomer: PaymentsEndpointMethodWithBearer<"manageCustomer"> =
  async (args) => {
    const stripe = getStripe()

    const { onCustomerCreated } = paymentsSetting("hooks") ?? {}

    const { _action, customerId } = args

    let customer: Stripe.Customer | Stripe.DeletedCustomer

    if (_action == "create" || (_action == "retrieve" && !customerId)) {
      const { email = "", name = "", id = "" } = args

      customer = await stripe.customers.create({
        email,
        name,
        metadata: { id },
      })

      if (onCustomerCreated) {
        await onCustomerCreated({ customer, email, id, name })
      }
    } else if (customerId) {
      customer = await stripe.customers.retrieve(customerId)
    } else {
      throw _stop({ message: "could not get Stripe customer" })
    }

    return { status: "success", data: customer, customerId: customer.id }
  }

export const managePaymentMethod: PaymentsEndpointMethodWithBearer<"managePaymentMethod"> =
  async (args) => {
    const { _action, customerId, paymentMethodId } = args

    if (!_action) throw _stop({ message: "no _action provided" })
    if (!customerId) throw _stop({ message: "no customer id" })

    const stripe = getStripe()

    // https://stripe.com/docs/api/setup_intents
    let setupIntent: Stripe.SetupIntent | undefined

    if (paymentMethodId) {
      if (_action == "create") {
        setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          payment_method: paymentMethodId,
          confirm: true,
          description: "CC",
          usage: "off_session",
        })

        await managePaymentMethod({
          ...args,
          _action: "setDefault",
          customerId,
          paymentMethodId,
        })
      } else if (_action == "setDefault") {
        if (!paymentMethodId) throw _stop({ message: "no payment id" })
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        })
      } else if (_action == "delete") {
        await stripe.paymentMethods.detach(paymentMethodId)
      } else if (_action == "attach") {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        })

        await managePaymentMethod({
          ...args,
          _action: "setDefault",
          customerId,
          paymentMethodId,
        })
      }
    } else if (_action != "retrieve") {
      throw _stop({ message: `no payment method id for ${_action}` })
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    })

    return { status: "success", data: paymentMethods, customerId, setupIntent }
  }

export const listCustomerSubscriptions: PaymentsEndpointMethodWithBearer<"listCustomerSubscriptions"> =
  async (args) => {
    const { customerId } = args

    if (!customerId) throw _stop({ message: "no customer id" })

    const stripe = getStripe()
    const data = await stripe.subscriptions.list({ customer: customerId })

    return { status: "success", data }
  }

export const manageSubscription: PaymentsEndpointMethodWithBearer<"manageSubscription"> =
  async (args) => {
    const {
      customerId,
      _action,
      paymentMethodId,
      priceId,
      coupon,
      idempotencyKey,
      subscriptionId,
      bearer,
      note,
    } = args

    if (!_action) throw _stop({ message: "no _action provided" })
    if (!customerId) throw _stop({ message: "no customer id" })

    const stripe = getStripe()
    const { onSubscriptionUpdate } = paymentsSetting("hooks") ?? {}

    // attach payment method to customer
    if (paymentMethodId && customerId) {
      managePaymentMethod({
        ...args,
        customerId,
        paymentMethodId,
        _action: "attach",
      })
    }

    let sub: Stripe.Subscription | undefined
    let message: string | undefined = undefined
    try {
      if (_action == "create") {
        const { beforeCreateSubscription } = paymentsSetting("hooks") ?? {}

        let args: Stripe.SubscriptionCreateParams = {
          customer: customerId,
          items: [{ price: priceId }],
          coupon,
          expand: ["latest_invoice.payment_intent"],
          trial_period_days: 14,
        }

        if (beforeCreateSubscription) {
          args = await beforeCreateSubscription(args)
        }

        sub = await stripe.subscriptions.create(args, { idempotencyKey })

        const suffix = coupon ? ` with code ${coupon}` : ""
        message = `subscription created ${suffix}`
      } else if (_action == "retrieve") {
        if (!subscriptionId) throw _stop({ message: "no subscription id" })

        sub = await stripe.subscriptions.retrieve(subscriptionId)
      } else if (_action == "delete") {
        if (!subscriptionId) throw _stop({ message: "no subscription id" })

        sub = await stripe.subscriptions.del(subscriptionId)
        await stripe.customers.update(customerId, {
          metadata: { cancelReason: note ?? "" },
        })
        message = "subscription deleted"
      }
    } catch (error) {
      throw _stop({ message: error.message })
    }

    if (sub && onSubscriptionUpdate) {
      await onSubscriptionUpdate(sub)
    }

    return {
      status: "success",
      data: sub,
      customerId,
      userId: bearer.userId,
      message,
    }
  }

export const getInvoices: PaymentsEndpointMethodWithBearer<"getInvoices"> =
  async (args) => {
    const { customerId, startingAfter, limit } = args
    const stripe = getStripe()
    const data = await stripe.invoices.list({
      customer: customerId,
      starting_after: startingAfter,
      limit,
    })
    return { status: "success", data, customerId }
  }

export const getProduct: PaymentsEndpointMethodWithBearer<"getProduct"> =
  async (args) => {
    const { productId } = args
    const stripe = getStripe()
    const product = await stripe.products.retrieve(productId)

    return { status: "success", data: product }
  }

export const getAllProducts: PaymentsEndpointMethodWithBearer<"getAllProducts"> =
  async (args) => {
    const products = paymentsSetting(`products`) ?? []

    const productIds = products
      .map((_) => _.productId)
      .filter((_) => _) as string[]

    const responsePlans = await Promise.all(
      productIds.map((productId: string) => getProduct({ ...args, productId })),
    )
    const data = responsePlans
      .map((product) => product.data)
      .filter((_) => _) as Stripe.Product[]

    return { status: "success", data }
  }

export const getCoupon: PaymentsEndpointMethodWithBearer<"getCoupon"> = async (
  args,
) => {
  const { couponCode } = args

  if (!couponCode) throw _stop({ message: "no code was provided" })

  const stripe = getStripe()

  try {
    const data = await stripe.coupons.retrieve(couponCode)
    return { status: "success", data }
  } catch (error) {
    return { status: "error", message: error.message }
  }
}

export const getCustomerData: PaymentsEndpointMethodWithBearer<"getCustomerData"> =
  async (args) => {
    const [customer, subscriptions, invoices, paymentMethods, allProducts] =
      await Promise.all([
        manageCustomer({ ...args, _action: "retrieve" }),
        listCustomerSubscriptions({ ...args }),
        getInvoices(args),
        managePaymentMethod({ ...args, _action: "retrieve" }),
        getAllProducts(args),
      ])

    const data: CustomerData = {
      subscriptions: subscriptions.data,
      customer: customer.data,
      invoices: invoices.data,
      paymentMethods: paymentMethods.data,
      allProducts: allProducts.data,
      idempotencyKey: objectId(),
    }
    return { status: "success", data }
  }
