import type { EndpointMeta, EndpointResponse, Organization } from '@fiction/core'
import type Stripe from 'stripe'
import type { FictionStripe } from '.'
import type { StripePluginSettings } from './index.js'
import type { CustomerData } from './utils'
import { abort, Query, standardTable } from '@fiction/core'
import { processCustomerData } from './utils'

export type StripeEndpointSettings = StripePluginSettings & { fictionStripe: FictionStripe }

export abstract class StripeEndpoint extends Query<StripeEndpointSettings> {
  db = () => this.settings.fictionDb.client()
  products = this.settings.fictionStripe.settings.products || []
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

// Union type for all possible action parameters
type ManageCustomerRequestParams =
  | { _action: 'create', fields: { email?: string, name?: string } }
  | { _action: 'update', fields: { email?: string, name?: string } }
  | { _action: 'retrieve' }
  | { _action: 'delete' }

type ManageCustomerParams = ManageCustomerRequestParams & { orgId: string, userId?: string }

export class QueryManageCustomer extends StripeEndpoint {
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

    await stripe.customers.del(customer.id)

    await this.saveCustomerInfo({
      orgId,
      customerId: null,
      data: null,
      customerAuthorized: null,
    })

    const customerData = await this.getCustomerData({ orgId })

    return { status: 'success', data: customerData, message: 'Customer deleted successfully' }
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

    const raw = {
      customer,
      subscriptions,
      org,
    }

    return processCustomerData({ raw, products: this.products })
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
