import type { EndpointMeta, EndpointResponse, Organization } from '@fiction/core'
import type Stripe from 'stripe'
import type { FictionStripe } from '.'
import type { StripePluginSettings } from './index.js'
import type { CustomerData } from './types'
import { abort, Query, standardTable } from '@fiction/core'

type StripeEndpointSettings = StripePluginSettings & { fictionStripe: FictionStripe }

abstract class StripeEndpoint extends Query<StripeEndpointSettings> {
  db = () => this.settings.fictionDb.client()

  async getPriceByLookupKey(priceKey?: string) {
    if (!priceKey)
      return undefined

    const stripe = this.settings.fictionStripe.getServerClient()
    const price = await stripe.prices.list({ lookup_keys: [priceKey] })
    return price.data[0].id
  }

  constructor(settings: StripeEndpointSettings) {
    super(settings)
  }
}

type SetupTrialParams = {
  _action: 'setupTrial'
  orgId: string
  email: string
  priceId?: string
  priceLookupKey?: string
  trialType: 'free' | 'paid'
} | {
  _action: 'completeSetup'
  setupIntentId?: string
  paymentIntentId?: string
  orgId: string
  priceId?: string
  priceLookupKey?: string
  trialPeriodDays?: number
}

export type TrialSetupResponse = {
  clientSecret?: string
  customerId?: string
  priceId: string
  trialType: 'free' | 'paid'

  setupIntentId?: string
  paymentIntentId?: string

  subscriptionId?: string
}

export class QueryStripeTrial extends StripeEndpoint {
  async run(
    params: SetupTrialParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TrialSetupResponse>> {
    try {
      switch (params._action) {
        case 'setupTrial':
          return await this.setupTrial(params, meta)
        case 'completeSetup':
          return await this.completeSetup(params, meta)
        default:
          throw abort('Invalid action', meta)
      }
    }
    catch (error) {
      this.log.error('Trial setup failed', { error })
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to setup trial',
      }
    }
  }

  private async setupTrial(
    params: Extract<SetupTrialParams, { _action: 'setupTrial' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TrialSetupResponse>> {
    const { orgId, email, priceId, priceLookupKey, trialType } = params

    if (!priceLookupKey && !priceId) {
      throw abort('Missing price identifier', meta)
    }

    const stripe = this.settings.fictionStripe.getServerClient()

    const sessionPriceId = priceId || await this.getPriceByLookupKey(priceLookupKey)

    if (!sessionPriceId) {
      return { status: 'error', message: `priceId not found` }
    }

    // First ensure/create customer
    const customerResponse = await this.settings.fictionStripe.queries.ManageCustomer.serve({
      _action: 'create',
      orgId,
      fields: { email },
    }, meta)

    if (customerResponse.status === 'error' || !customerResponse.data?.customer) {
      throw new Error('Failed to create customer')
    }

    const customerId = customerResponse.data.customer.id

    // Create setup intent for collecting payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      metadata: { orgId },
      usage: 'off_session',
    })

    const clientSecret = setupIntent.client_secret

    if (!clientSecret) {
      throw abort('Failed to create setup intent', meta)
    }

    const setupIntentId = setupIntent.id

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // $1
      currency: 'usd',
      customer: customerId,
      payment_method_types: ['card'],
      metadata: { orgId, priceId: sessionPriceId },
      setup_future_usage: 'off_session',
      confirm: false,
      capture_method: 'automatic',
    })

    const paymentIntentId = paymentIntent.id

    return {
      status: 'success',
      data: {
        clientSecret,
        customerId,
        setupIntentId,
        paymentIntentId,
        priceId: sessionPriceId,
        trialType,
      },
    }
  }

  private async completeSetup(
    params: Extract<SetupTrialParams, { _action: 'completeSetup' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<TrialSetupResponse>> {
    const { setupIntentId, paymentIntentId, orgId, priceId, priceLookupKey, trialPeriodDays = 30 } = params
    const stripe = this.settings.fictionStripe.getServerClient()

    const sessionPriceId = priceId || await this.getPriceByLookupKey(priceLookupKey)

    if (!sessionPriceId) {
      throw abort('missing required product info', meta)
    }

    if (!setupIntentId || !paymentIntentId) {
      throw abort('missing required IDs', meta)
    }

    // Get setup intent to get customer ID and payment method
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (!setupIntent.payment_method) {
      throw abort('No payment method attached to setup intent', meta)
    }

    // Set as default payment method for the customer
    await stripe.customers.update(setupIntent.customer as string, {
      invoice_settings: {
        default_payment_method: setupIntent.payment_method as string,
      },
    })

    // Process trial payment using the same payment method
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: setupIntent.payment_method as string,
    })

    if (paymentIntent.status !== 'succeeded') {
      throw abort(`Payment failed: ${paymentIntent.status}`, meta)
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: setupIntent.customer as string,
      items: [{ price: sessionPriceId }],
      trial_period_days: trialPeriodDays,
      payment_behavior: 'default_incomplete',
      default_payment_method: setupIntent.payment_method as string, // Also set it on the subscription
      payment_settings: {
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'],
      },
      metadata: { orgId },
    })

    return {
      status: 'success',
      data: {
        customerId: setupIntent.customer as string,
        setupIntentId,
        paymentIntentId,
        subscriptionId: subscription.id,
        priceId: sessionPriceId,
        trialType: 'paid',
      },
    }
  }
}

export class QueryPortalSession extends StripeEndpoint {
  async run(params: { orgId: string, returnUrl?: string }, _meta: EndpointMeta): Promise<EndpointResponse<Stripe.BillingPortal.Session > & { customer?: Stripe.Customer }> {
    const { orgId, returnUrl } = params
    const fictionStripe = this.settings.fictionStripe
    const stripe = fictionStripe.getServerClient()

    const r = await fictionStripe.queries.ManageCustomer.serve({ _action: 'retrieve', orgId }, _meta)
    const customer = r.data?.customer
    const customerId = customer?.id

    if (!customerId) {
      return { status: 'error', message: `customerId not found` }
    }

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })
      return { status: 'success', data: session, customer }
    }
    catch (error) {
      this.log.error('Payment API Error: Failed to create portal session', { error })
      return { status: 'error', message: 'Payment API Error' }
    }
  }
}

export class QueryCheckoutSession extends StripeEndpoint {
  async run(params: {
    orgId: string
    priceId?: string
    priceKey?: string
    trialPeriodDays?: number
  }, _meta: EndpointMeta): Promise<EndpointResponse<Stripe.Checkout.Session> & { customer?: Stripe.Customer }> {
    const { orgId, priceId, trialPeriodDays = 14, priceKey } = params
    const fictionStripe = this.settings.fictionStripe
    const stripe = fictionStripe.getServerClient()

    const r = await fictionStripe.queries.ManageCustomer.serve({ _action: 'retrieve', orgId }, _meta)
    const customer = r.data?.customer
    const customerId = customer?.id

    if (!customerId) {
      return { status: 'error', message: `customerId not found` }
    }

    const sessionPriceId = priceId || await this.getPriceByLookupKey(priceKey)

    if (!sessionPriceId) {
      return { status: 'error', message: `priceId not found` }
    }

    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        ui_mode: 'embedded',
        line_items: [{ price: sessionPriceId, quantity: 1 }],
        subscription_data: {
          trial_period_days: trialPeriodDays,
        },
        redirect_on_completion: 'never',
      })
      return { status: 'success', data: session, customer }
    }
    catch (error) {
      this.log.error('Payment API Error: Failed to create checkout session', { error })
      return { status: 'error', message: 'Payment API Error' }
    }
  }
}

// Union type for all possible action parameters
type ManageCustomerRequestParams =
  | { _action: 'create', fields: { email?: string, name?: string } }
  | { _action: 'update', fields: { email?: string, name?: string } }
  | { _action: 'retrieve' }
  | { _action: 'delete' }

type ManageCustomerParams = ManageCustomerRequestParams & { orgId: string, userId?: string }

export class QueryManageCustomer extends Query<StripeEndpointSettings> {
  async run(params: ManageCustomerParams, meta: EndpointMeta): Promise<EndpointResponse<CustomerData>> {
    if (!params.orgId) {
      throw abort('Missing orgId')
    }

    switch (params._action) {
      case 'create':
        return this.createCustomer(params, meta)
      case 'update':
        return this.updateCustomer(params, meta)
      case 'retrieve':
        return this.retrieveCustomer(params, meta)
      case 'delete':
        return this.deleteCustomer(params, meta)
      default:
        throw abort('Invalid action')
    }
  }

  private async createCustomer(
    params: ManageCustomerParams & { _action: 'create' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { fields: { email = '', name = '' }, orgId } = params
    const stripe = this.settings.fictionStripe.getServerClient()

    if (!orgId)
      throw abort('No orgId provided')

    const query = `metadata[\"orgId\"]:\"${orgId}\"`

    const existingCustomers = await stripe.customers.search({ query })

    if (existingCustomers.data.length > 0) {
      const customerData = await this.getCustomerData({ orgId })
      return {
        status: 'success',
        data: customerData,
        message: 'Using existing customer',
      }
    }

    const customer = await stripe.customers.create({
      email,
      name,
      description: orgId,
      metadata: {
        orgId,
        stripeMode: this.settings.fictionStripe.stripeMode.value,
        deployMode: this.settings.fictionStripe.settings.fictionEnv.mode.value || 'unknown',
      },
    })

    await this.saveCustomerInfo({
      orgId,
      customerId: customer.id,
      data: { customerId: customer.id },
    })

    const customerData = await this.getCustomerData({ orgId })
    return { status: 'success', data: customerData, message: 'Customer created successfully' }
  }

  private async updateCustomer(
    params: ManageCustomerParams & { _action: 'update' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { fields: { email, name }, orgId } = params
    const stripe = this.settings.fictionStripe.getServerClient()
    const { data: customer } = await this.getCustomer({ orgId })

    if (!customer || customer?.deleted) {
      throw abort(`Can't update, customer not found`)
    }

    await stripe.customers.update(customer.id, { email, name })

    const customerData = await this.getCustomerData({ orgId })

    return { status: 'success', data: customerData, message: 'Customer updated successfully' }
  }

  private async retrieveCustomer(
    params: ManageCustomerParams & { _action: 'retrieve' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { orgId } = params

    const r = await this.getCustomer({ orgId })

    if (r.status === 'error') {
      throw abort(r.message || 'Payment API Error')
    }

    const customerData = await this.getCustomerData({ orgId })
    return { status: 'success', data: customerData }
  }

  private async deleteCustomer(
    params: ManageCustomerParams & { _action: 'delete' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { orgId } = params

    const { data: customer, org } = await this.getCustomer({ orgId })

    if (!customer || customer?.deleted) {
      throw abort(`Can't delete, customer not found`)
    }

    const stripe = this.settings.fictionStripe.getServerClient()
    const deletedCustomer = await stripe.customers.del(customer.id)

    await this.saveCustomerInfo({
      orgId,
      customerId: null,
      data: null,
      customerAuthorized: null,
    })

    return {
      status: 'success',
      data: { customer: deletedCustomer as Stripe.Customer & { deleted: true }, org },
      message: 'Customer deleted successfully',
    }
  }

  private async getStoredCustomerInfo(args: { orgId: string, caller: string }): Promise<Organization> {
    const { orgId, caller = 'unknown' } = args
    const db = this.settings.fictionDb.client()
    const liveStripe = this.settings.fictionStripe.stripeMode.value === 'live'

    if (!orgId) {
      throw new Error(`No orgId provided (${caller})`)
    }

    const org = await db
      .select('*')
      .from(standardTable.org)
      .where({ orgId })
      .first<Organization>()

    if (!org) {
      throw new Error(`Organization not found: ${orgId}`)
    }

    if (!liveStripe) {
      org.customer = org.customerTest
      org.customerId = org.customerTest?.customerId
    }

    return org
  }

  private async saveCustomerInfo(args: {
    orgId: string
    customerId?: string | null
    customerAuthorized?: 'authorized' | 'invalid' | null
    data?: Record<string, any> | null
  }): Promise<void> {
    const { orgId, customerId, customerAuthorized, data } = args
    const db = this.settings.fictionDb.client()
    const liveStripe = this.settings.fictionStripe.stripeMode.value === 'live'

    const save: Record<string, string | null> = {}
    if (typeof customerId !== 'undefined') {
      save[liveStripe ? 'customerId' : 'customerIdTest'] = customerId
    }
    if (typeof customerAuthorized !== 'undefined') {
      save.customerAuthorized = customerAuthorized
    }

    await db.update(save).from(standardTable.org).where({ orgId })

    if (typeof data !== 'undefined') {
      const customerField = liveStripe ? 'customer' : 'customer_test'
      const customerMerge = data === null
        ? db.raw(`'{}'::jsonb`)
        : db.raw(
            `coalesce(${customerField}::jsonb, '{}'::jsonb) || ?::jsonb`,
            JSON.stringify(data),
          )

      const saveMeta = liveStripe
        ? { customer: customerMerge }
        : { customerTest: customerMerge }

      await db
        .update(saveMeta)
        .from(standardTable.org)
        .where({ orgId })
    }
  }

  private async getCustomer(args: { orgId: string }): Promise<EndpointResponse<Stripe.Customer & { deleted?: boolean } > & { org: Organization }> {
    const { orgId } = args
    const stripe = this.settings.fictionStripe.getServerClient()
    const org = await this.getStoredCustomerInfo({ orgId, caller: 'getCustomer' })

    if (!org.orgId) {
      throw new Error(`Organization not found: ${orgId}`)
    }

    let customerId = org?.customerId

    if (!customerId) {
      const r = await this.createCustomer({ orgId, _action: 'create', fields: {
        email: org?.orgEmail,
        name: org?.orgName,
      } }, { caller: 'getCustomer' })

      customerId = r.data?.customer?.id
    }

    if (!customerId) {
      throw new Error(`customerId not available`)
    }

    let customer: (Stripe.Customer & { deleted?: boolean }) | undefined

    try {
      customer = await stripe.customers.retrieve(customerId) as Stripe.Customer & { deleted?: boolean }

      if (customer?.deleted || !customer) {
        if (org?.orgId) {
          this.log.warn('Customer not found on org', { orgId: org.orgId })
          await this.saveCustomerInfo({
            orgId: org.orgId,
            customerId: null,
            data: { customerId: undefined },
            customerAuthorized: null,
          })
        }
        customer = undefined
      }
    }
    catch (error) {
      this.log.error('Payment API Error: Failed to retrieve customer', { error })
      return { status: 'error', message: 'Payment API Error', org }
    }

    return { status: 'success', data: customer, org }
  }

  private async getCustomerData(args: { orgId: string }): Promise<CustomerData> {
    const { orgId } = args

    const { data: customer, org } = await this.getCustomer({ orgId })

    const stripe = this.settings.fictionStripe.getServerClient()

    let subscriptions: Stripe.Subscription[] = []
    if (customer && !customer?.deleted) {
      const response = await stripe.subscriptions.list({ customer: customer?.id })
      subscriptions = response.data
    }

    return {
      customer,
      subscriptions,
      org,
    }
  }
}
