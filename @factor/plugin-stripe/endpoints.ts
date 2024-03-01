import {
  Query,
  runHooks,
} from '@factor/api'
import type { EndpointManageAction, EndpointMeta, EndpointResponse, FactorDb, FactorUser, Organization, OrganizationCustomerData } from '@factor/api'
import type Stripe from 'stripe'
import type {
  CustomSubscription,
  CustomerData,
  HookDictionary,
  ManageSubscriptionResult,
} from './types'
import type { FactorStripe } from '.'

abstract class QueryPayments extends Query {
  factorUser: FactorUser
  factorStripe: FactorStripe
  factorDb: FactorDb

  constructor(settings: {
    factorUser: FactorUser
    factorStripe: FactorStripe
    factorDb: FactorDb
  }) {
    super(settings)

    this.factorUser = settings.factorUser
    this.factorStripe = settings.factorStripe
    this.factorDb = settings.factorDb
  }

  // async refine(
  //   params: { userId?: string; orgId: string },
  //   meta: EndpointMeta,
  // ): Promise<RefineResult> {
  //   const { orgId, userId } = params

  //   const out: RefineResult = {}

  //   const r = await this.factorStripe.queries.GetCustomerData.serve(
  //     { orgId },
  //     meta,
  //   )
  //   out.customerData = r.data

  //   if (userId) {
  //     const privateDataResponse =
  //       await this.factorUser.queries.ManageUser.serve(
  //         {
  //           userId,
  //           _action: "getPrivate",
  //         },
  //         meta,
  //       )
  //     out.user = privateDataResponse.data
  //   }

  //   return out
  // }

  // async serveRequest(
  //   params: Parameters<this["run"]>[0],
  //   meta: EndpointMeta,
  // ): Promise<Awaited<ReturnType<this["run"]>> & RefineResult> {
  //   const result = await this.serve(params, meta)

  //   if (result?.status === "success") {
  //     const r = result as Awaited<ReturnType<this["run"]>> & {
  //       customerId?: string
  //       userId?: string
  //       orgId: string
  //     }

  //     const { userId, orgId } = r

  //     const fullResponse = await this.refine({ userId, orgId }, meta)

  //     return { ...r, ...fullResponse }
  //   } else {
  //     return result as Awaited<ReturnType<this["run"]>> & RefineResult
  //   }
  // }

  saveCustomerInfo = async (args: {
    orgId: string
    customerId?: string | null
    customerAuthorized?: 'authorized' | 'invalid' | null
    data?: Partial<OrganizationCustomerData>
  }): Promise<void> => {
    const { orgId, customerId, customerAuthorized, data } = args
    const db = this.factorDb.client()

    const liveStripe = this.factorStripe.stripeMode.value === 'live'

    const save: Record<string, string | null> = {}

    if (customerId)
      save[liveStripe ? 'customerId' : 'customerIdTest'] = customerId

    if (customerAuthorized)
      save.customerAuthorized = customerAuthorized

    await db.update(save).from(this.tbl.org).where({ orgId })

    if (data) {
      const customerField = liveStripe ? 'customer' : 'customer_test'

      const customerMerge = db.raw(
        `coalesce(${customerField}::jsonb, '{}'::jsonb) || ?::jsonb`,
        JSON.stringify(data),
      )

      const saveMeta = liveStripe
        ? { customer: customerMerge }
        : { customerTest: customerMerge }

      await db
        .update(saveMeta)
        .from(this.tbl.org)
        .where({ orgId })
        .returning('*')
    }

    this.log.info(`added customer id to org`, { data: { orgId } })
  }

  async getCustomer(orgId: string): Promise<{
    customer: Stripe.Customer | Stripe.DeletedCustomer | undefined
    org: Organization | undefined
  }> {
    const db = this.factorDb.client()
    const stripe = this.factorStripe.getServerClient()

    const liveStripe = this.factorStripe.stripeMode.value === 'live'

    const customerField = liveStripe ? 'customer' : 'customerTest'

    const org = await db
      .select('*')
      .from(this.tbl.org)
      .where({ orgId })
      .first<Organization>()

    const customerId = org?.[customerField]?.customerId

    let customer: Stripe.Customer | Stripe.DeletedCustomer | undefined

    if (customerId) {
      customer = await stripe.customers.retrieve(customerId)

      if (customer.deleted || !customer) {
        this.log.error(`customer does not exist, removing entry`, {
          data: { orgId, customerId },
        })

        await this.saveCustomerInfo({
          orgId,
          customerId: null,
          data: {
            customerId: undefined,
          },
          customerAuthorized: null,
        })

        customer = undefined
      }
    }

    return {
      customer,
      org,
    }
  }
}

export class QueryManageCustomer extends QueryPayments {
  async run(
    params: {
      customerId?: string
      orgId: string
      name?: string
      email?: string
      _action: EndpointManageAction
    },
    _meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Stripe.Customer | Stripe.DeletedCustomer> & {
      customerId?: string
      customerData?: CustomerData
    }
  > {
    const stripe = this.factorStripe.getServerClient()

    const { _action, email = '', name = '', orgId } = params

    if (!orgId)
      throw new Error('No orgId provided')

    const c = await this.getCustomer(orgId)
    let { customer } = c
    const { org } = c

    if (_action === 'create' || (_action === 'retrieve' && !customer)) {
      this.log.warn(`creating new customer`, {
        data: { org },
      })
      customer = await stripe.customers.create({
        email,
        name,
        description: orgId,
        metadata: {
          orgId,
          stripeMode: this.factorStripe.stripeMode.value,
          deployMode: this.factorStripe.factorEnv.mode.value || 'unknown',
        },
      })

      const customerId = customer.id

      await this.saveCustomerInfo({
        orgId,
        customerId: customer.id,
        data: { customerId },
      })

      await runHooks<HookDictionary>({
        list: this.factorStripe.hooks,
        hook: 'onCustomerCreated',
        args: [
          { customer, email, orgId, name },
          { factorStripe: this.factorStripe },
        ],
      })
    }
    else if (_action === 'update') {
      if (!customer)
        throw this.stop('no customer to update')
      customer = await stripe.customers.update(customer.id, {
        email,
        name,
      })
    }

    return {
      status: 'success',
      data: customer,
      customerId: customer?.id,
    }
  }
}

export class QueryPaymentMethod extends QueryPayments {
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

    if (!_action)
      throw this.stop('no _action provided')
    if (!customerId)
      throw this.stop('no customer id')

    const stripe = this.factorStripe.getServerClient()

    // https://stripe.com/docs/api/setup_intents
    let setupIntent: Stripe.SetupIntent | undefined

    if (paymentMethodId) {
      if (_action === 'create') {
        setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          payment_method: paymentMethodId,
          confirm: true,
          description: 'CC',
          usage: 'off_session',
        })

        await this.serve(
          {
            _action: 'setDefault',
            customerId,
            paymentMethodId,
          },
          meta,
        )
      }
      else if (_action === 'setDefault') {
        if (!paymentMethodId)
          throw this.stop('no payment id')
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        })
      }
      else if (_action === 'delete') {
        await stripe.paymentMethods.detach(paymentMethodId)
      }
      else if (_action === 'attach') {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        })

        await this.serve(
          {
            _action: 'setDefault',
            customerId,
            paymentMethodId,
          },
          meta,
        )
      }
    }
    else if (_action !== 'retrieve') {
      throw this.stop(`no payment method id for ${_action}`)
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })

    return { status: 'success', data: paymentMethods, customerId, setupIntent }
  }
}

export class QueryListSubscriptions extends QueryPayments {
  async run(
    params: {
      orgId: string
      verify?: boolean
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomSubscription[]>> {
    const { orgId, verify = false } = params

    if (!orgId)
      throw this.stop('no orgId')

    const { customer } = await this.getCustomer(orgId)

    const out: CustomSubscription[] = []

    if (customer?.id) {
      const stripe = this.factorStripe.getServerClient()
      const subs = await stripe.subscriptions.list({ customer: customer?.id })

      // Iterate through the subscriptions
      for (const subscription of subs.data) {
        const pm = subscription.default_payment_method
        let customerAuthorized: 'unknown' | 'authorized' | 'invalid' = 'unknown'
        if (pm && verify) {
          const org = await this.factorUser.queries.ManageOrganization.serve(
            {
              _action: 'retrieve',
              orgId,
            },
            { server: true },
          )

          if (org.data?.customerAuthorized === 'authorized') {
            customerAuthorized = 'authorized'
          }
          else {
            // Retrieve the default payment method for the subscription
            const paymentMethod = await stripe.paymentMethods.retrieve(
              pm as string,
            )

            try {
              // Create a PaymentIntent with a small amount (e.g., 100 cents)
              const paymentIntent = await stripe.paymentIntents.create({
                amount: 50,
                currency: 'usd',
                customer: customer.id,
                payment_method: paymentMethod.id,
                off_session: true,
                confirm: true,
              })

              /**
               * This is to verify if the card is real and working
               */
              if (['succeeded'].includes(paymentIntent.status)) {
                await stripe.refunds.create({
                  payment_intent: paymentIntent.id,
                })

                await this.saveCustomerInfo({
                  orgId,
                  customerAuthorized: 'authorized',
                })
                customerAuthorized = 'authorized'
                this.log.info(`subscription ${subscription.id} is valid.`)
              }
              else {
                await this.saveCustomerInfo({
                  orgId,
                  customerAuthorized: 'invalid',
                })
                customerAuthorized = 'invalid'
                this.log.error(
                  `subscription ${subscription.id} is not valid.`,
                  {
                    data: paymentIntent,
                  },
                )
              }
            }
            catch (error) {
              const e = error as Error
              this.log.error(
                `error verifying subscription ${subscription.id}: ${e.message}`,
              )
            }
          }
        }
        out.push({ ...subscription, customerAuthorized })
      }
    }

    return { status: 'success', data: out }
  }
}

export class QueryManageSubscription extends QueryPayments {
  async run(
    params: {
      _action: 'change' | 'cancel' | 'endTrial'
      customerId: string
      orgId: string
      priceId: string
      subscriptionId: string
      coupon?: string
      note?: string
      quantity?: number
    },

    meta: EndpointMeta,
  ): Promise<ManageSubscriptionResult> {
    const { _action, customerId, quantity } = params

    if (!_action)
      throw this.stop('no _action provided')

    const stripe = this.factorStripe.getServerClient()

    let sub: Stripe.Subscription | undefined
    let message: string | undefined
    try {
      if (_action === 'change') {
        const { customerId, subscriptionId, priceId, coupon } = params

        if (!customerId)
          throw this.stop('no customer id')

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const id = subscription.items.data[0].id
        this.log.info('change subscription', {
          data: { customerId, subscriptionId, coupon, priceId, quantity, id },
        })
        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
          proration_behavior: 'create_prorations',
          coupon,
          items: [{ id, price: priceId, quantity }],
        })

        message = `subscription updated`
      }
      else if (_action === 'cancel') {
        const { subscriptionId } = params
        if (!subscriptionId)
          throw this.stop('no subscription id')

        await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        })
        message = 'subscription cancelled'
      }
    }
    catch (error: unknown) {
      const e = error as Error
      throw this.stop(e.message)
    }

    return {
      status: 'success',
      data: sub,
      customerId,
      userId: meta.bearer?.userId,
      message,
    }
  }
}

export class QueryGetInvoices extends QueryPayments {
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
    const stripe = this.factorStripe.getServerClient()
    const data = await stripe.invoices.list({
      customer: customerId,
      starting_after: startingAfter,
      limit,
    })

    return { status: 'success', data, customerId }
  }
}

export class QueryGetProduct extends QueryPayments {
  async run(
    params: {
      productId: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Stripe.Product>> {
    const { productId } = params

    const stripe = this.factorStripe.getServerClient()
    const product = await stripe.products.retrieve(productId)

    return { status: 'success', data: product }
  }
}

export class QueryAllProducts extends QueryPayments {
  async run(
    _params: undefined,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Stripe.Product[]>> {
    const products = this.factorStripe.products.value

    const productIds = products
      .map(_ => _.productId)
      .filter(Boolean)

    const responsePlans = await Promise.all(
      productIds.map((productId: string) =>
        this.factorStripe.queries.GetProduct.serve({ productId }, {}),
      ),
    )
    const data = responsePlans
      .map(product => product.data)
      .filter(Boolean) as Stripe.Product[]

    return { status: 'success', data }
  }
}

export class QueryGetCoupon extends QueryPayments {
  async run(
    {
      couponCode,
    }: {
      couponCode: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Stripe.Response<Stripe.Coupon>>> {
    if (!couponCode)
      throw this.stop('no code was provided')

    const stripe = this.factorStripe.getServerClient()

    try {
      const data = await stripe.coupons.retrieve(couponCode)
      return { status: 'success', data }
    }
    catch (error: unknown) {
      throw this.stop('payment API error', { data: error as Error })
    }
  }
}

export class QueryGetCustomerData extends QueryPayments {
  async run(
    {
      orgId,
      orgName,
      email,
      verify,
    }: {
      orgId: string
      orgName?: string
      email?: string
      verify?: boolean
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    if (!orgId)
      throw new Error('no organization id provided to get customer data')

    const customer = await this.factorStripe.queries.ManageCustomer.serve(
      { orgId, name: orgName, email, _action: 'retrieve' },
      meta,
    )
    const subscriptions
      = await this.factorStripe.queries.ListSubscriptions.serve(
        { orgId, verify },
        meta,
      )

    const data: CustomerData = {
      subscriptions: subscriptions.data ?? [],
      customer: customer.data,
    }

    return { status: 'success', data }
  }
}
