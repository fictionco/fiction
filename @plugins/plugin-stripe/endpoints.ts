/* eslint-disable @typescript-eslint/no-use-before-define */
import { isNode, objectId, EndpointResponse, PrivateUser } from "@factor/api"
import { Queries as UserQueries } from "@factor/engine/user"
import { Query } from "@factor/engine/query"
import {
  FactorEndpoint,
  EndpointMeta,
  EndpointManageAction,
  EndpointMethodOptions,
} from "@factor/engine/endpoint"
import { paymentsSetting, CustomerData, stripeEnv, getStripeProducts } from "."
import Stripe from "stripe"

type RefineResult = {
  customerData?: CustomerData
  user?: PrivateUser
}
abstract class QueryPayments extends Query {
  async refine(
    params: { customerId?: string; userId?: string },
    meta: EndpointMeta,
  ): Promise<RefineResult> {
    const { customerId, userId } = params

    const out: RefineResult = {}

    if (customerId) {
      const r = await Queries.GetCustomerData.serve({ customerId }, meta)
      out.customerData = r.data
    }

    if (userId) {
      const privateDataResponse = await UserQueries.ManageUser.serve(
        {
          userId,
          _action: "getPrivate",
        },
        meta,
      )
      out.user = privateDataResponse.data
    }

    return out
  }

  async serveRequest(
    params: Parameters<this["run"]>[0],
    meta: EndpointMeta,
  ): Promise<Awaited<ReturnType<this["run"]>> & RefineResult> {
    const result = await this.serve(params, meta)

    if (result.status == "success") {
      const r = result as Awaited<ReturnType<this["run"]>> & {
        customerId?: string
        userId?: string
      }

      const { customerId, userId } = r

      const fullResponse = await this.refine({ customerId, userId }, meta)

      return { ...r, ...fullResponse }
    } else {
      return result as Awaited<ReturnType<this["run"]>> & RefineResult
    }
  }
}

export const stripeSecretKey = (): string => {
  const stripeSecretKey =
    stripeEnv() == "production"
      ? process.env.STRIPE_SECRET_KEY
      : process.env.STRIPE_SECRET_KEY_TEST

  if (!stripeSecretKey) {
    throw new Error(`stripe secret key missing: ${stripeEnv()}`)
  }

  return stripeSecretKey
}

export const getStripe = (): Stripe => {
  if (!isNode) throw new Error("Stripe is server only")

  return new Stripe(stripeSecretKey(), { apiVersion: "2020-08-27" })
}

class QueryManageCustomer extends QueryPayments {
  async run(
    params: {
      customerId?: string
      id?: string
      name?: string
      email?: string
      _action: EndpointManageAction
    },
    _meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Stripe.Customer | Stripe.DeletedCustomer> & {
      customerId: string
      customerData?: CustomerData
    }
  > {
    const stripe = getStripe()

    const { onCustomerCreated } = paymentsSetting("hooks") ?? {}

    const { _action, customerId } = params

    let customer: Stripe.Customer | Stripe.DeletedCustomer

    if (_action == "create" || (_action == "retrieve" && !customerId)) {
      const { email = "", name = "", id = "" } = params

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
      throw this.stop("could not get stripe customer")
    }

    return {
      status: "success",
      data: customer,
      customerId: customer.id,
    }
  }
}

class QueryPaymentMethod extends QueryPayments {
  async run(
    params: {
      customerId: string
      paymentMethodId?: string
      _action: EndpointManageAction
    },
    meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Stripe.ApiList<Stripe.PaymentMethod>> & {
      customerId: string
      customerData?: CustomerData
      setupIntent?: Stripe.SetupIntent
    }
  > {
    const { _action, customerId, paymentMethodId } = params

    if (!_action) throw this.stop({ message: "no _action provided" })
    if (!customerId) throw this.stop({ message: "no customer id" })

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

        await this.serve(
          {
            _action: "setDefault",
            customerId,
            paymentMethodId,
          },
          meta,
        )
      } else if (_action == "setDefault") {
        if (!paymentMethodId) throw this.stop({ message: "no payment id" })
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

        await this.serve(
          {
            _action: "setDefault",
            customerId,
            paymentMethodId,
          },
          meta,
        )
      }
    } else if (_action != "retrieve") {
      throw this.stop({ message: `no payment method id for ${_action}` })
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    })

    return { status: "success", data: paymentMethods, customerId, setupIntent }
  }
}

class QueryListSubscriptions extends QueryPayments {
  async run(
    params: {
      customerId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Stripe.ApiList<Stripe.Subscription>>> {
    const { customerId } = params

    if (!customerId) throw this.stop({ message: "no customer id" })

    const stripe = getStripe()
    const data = await stripe.subscriptions.list({ customer: customerId })

    return { status: "success", data }
  }
}

class QueryManageSubscription extends QueryPayments {
  async run(
    params: { customerId: string } & (
      | {
          _action: "create"

          idempotencyKey: string
          priceId: string
          paymentMethodId?: string
          coupon?: string
        }
      | {
          _action: "delete"
          subscriptionId: string
          customerId: string
          note?: string
        }
      | { _action: "retrieve"; customerId?: string; subscriptionId: string }
    ),

    meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Stripe.Subscription> & {
      customerId: string
      customerData?: CustomerData
      userId?: string
      user?: PrivateUser
    }
  > {
    const { _action, customerId } = params

    if (!_action) throw this.stop({ message: "no _action provided" })

    const stripe = getStripe()

    let sub: Stripe.Subscription | undefined
    let message: string | undefined = undefined
    try {
      if (_action == "create") {
        const { customerId, paymentMethodId, priceId, coupon, idempotencyKey } =
          params

        if (!customerId) throw this.stop({ message: "no customer id" })

        // attach payment method to customer
        if (paymentMethodId && customerId) {
          await Queries.ManagePaymentMethod.serve(
            {
              customerId,
              paymentMethodId,
              _action: "attach",
            },
            meta,
          )
        }

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
        const { subscriptionId } = params
        if (!subscriptionId) throw this.stop({ message: "no subscription id" })

        sub = await stripe.subscriptions.retrieve(subscriptionId)
      } else if (_action == "delete") {
        const { subscriptionId, customerId, note } = params
        if (!subscriptionId) throw this.stop({ message: "no subscription id" })

        sub = await stripe.subscriptions.del(subscriptionId)
        await stripe.customers.update(customerId, {
          metadata: { cancelReason: note ?? "" },
        })
        message = "subscription deleted"
      }
    } catch (error: unknown) {
      const e = error as Error
      throw this.stop({ message: e.message })
    }

    const { onSubscriptionUpdate } = paymentsSetting("hooks") ?? {}

    if (sub && onSubscriptionUpdate) {
      await onSubscriptionUpdate(sub)
    }

    return {
      status: "success",
      data: sub,
      customerId,
      userId: meta.bearer?.userId,
      message,
    }
  }
}

class QueryGetInvoices extends QueryPayments {
  async run(
    params: {
      customerId: string
      limit?: number
      startingAfter?: string
    },
    _meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Stripe.ApiList<Stripe.Invoice>> & {
      customerId: string
      customerData?: CustomerData
    }
  > {
    const { customerId, startingAfter, limit } = params
    const stripe = getStripe()
    const data = await stripe.invoices.list({
      customer: customerId,
      starting_after: startingAfter,
      limit,
    })

    return { status: "success", data, customerId }
  }
}

class QueryGetProduct extends QueryPayments {
  async run(
    params: {
      productId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Stripe.Product>> {
    const { productId } = params
    const stripe = getStripe()
    const product = await stripe.products.retrieve(productId)

    return { status: "success", data: product }
  }
}

class QueryAllProducts extends QueryPayments {
  async run(
    _params: undefined,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Stripe.Product[]>> {
    const products = getStripeProducts()

    const productIds = products
      .map((_) => _.productId)
      .filter((_) => _) as string[]

    const responsePlans = await Promise.all(
      productIds.map((productId: string) =>
        Queries.GetProduct.serve({ productId }, {}),
      ),
    )
    const data = responsePlans
      .map((product) => product.data)
      .filter((_) => _) as Stripe.Product[]

    return { status: "success", data }
  }
}

class QueryGetCoupon extends QueryPayments {
  async run(
    {
      couponCode,
    }: {
      couponCode: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Stripe.Response<Stripe.Coupon>>> {
    if (!couponCode) throw this.stop({ message: "no code was provided" })

    const stripe = getStripe()

    try {
      const data = await stripe.coupons.retrieve(couponCode)
      return { status: "success", data }
    } catch (error: unknown) {
      throw this.stop({
        message: "payment API error",
        data: error as Stripe.Errors["StripeError"],
      })
    }
  }
}

class QueryGetCustomerData extends QueryPayments {
  async run(
    {
      customerId,
    }: {
      customerId: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const [customer, subscriptions, invoices, paymentMethods, allProducts] =
      await Promise.all([
        Queries.ManageCustomer.serve({ customerId, _action: "retrieve" }, meta),
        Queries.ListSubscriptions.serve({ customerId }, meta),
        Queries.GetInvoices.serve({ customerId }, meta),
        Queries.ManagePaymentMethod.serve(
          { customerId, _action: "retrieve" },
          meta,
        ),
        Queries.AllProducts.serve(undefined, meta),
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
}

export const Queries = {
  ManageCustomer: new QueryManageCustomer(),
  ListSubscriptions: new QueryListSubscriptions(),
  GetInvoices: new QueryGetInvoices(),
  ManageSubscription: new QueryManageSubscription(),
  ManagePaymentMethod: new QueryPaymentMethod(),
  GetCustomerData: new QueryGetCustomerData(),
  AllProducts: new QueryAllProducts(),
  GetProduct: new QueryGetProduct(),
  GetCoupon: new QueryGetCoupon(),
}

class EndpointMethodPayments<T extends Query> extends FactorEndpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ basePath: "/payments", ...options })
  }
}

type EndpointMap = {
  [P in keyof typeof Queries]: EndpointMethodPayments<typeof Queries[P]>
}

export const getPaymentEndpointsMap = (): EndpointMap => {
  return Object.fromEntries(
    Object.entries(Queries).map(([key, query]) => {
      return [key, new EndpointMethodPayments({ key, queryHandler: query })]
    }),
  ) as EndpointMap
}

export const paymentEndpointsMap = getPaymentEndpointsMap()
export const paymentEndpoints = Object.values(paymentEndpointsMap)
