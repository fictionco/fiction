import type { EndpointMeta, EndpointResponse, ErrorConfig, Organization } from '@fiction/core'
import type Stripe from 'stripe'
import type { FictionStripe } from '.'
import type { StripePluginSettings } from './index.js'
import type { CustomerData } from './utils'
import { abort, Query, standardTable } from '@fiction/core'
import { processCustomerData } from './utils'

export type StripeEndpointSettings = StripePluginSettings & { fictionStripe: FictionStripe }

export abstract class StripeEndpoint extends Query<StripeEndpointSettings> {
  db = () => this.settings.fictionDb.client()
  stripe = () => this.settings.fictionStripe.getServerClient()
  products = this.settings.fictionStripe.settings.products || []

  constructor(settings: StripeEndpointSettings) {
    super(settings)
  }
}

// Union type for all possible action parameters
type ManageCustomerRequestParams =
  | { _action: 'create' }
  | { _action: 'update', fields: { email?: string, name?: string } }
  | { _action: 'retrieve' }
  | { _action: 'delete' }

type ManageCustomerParams = ManageCustomerRequestParams & { orgId: string, userId?: string }

type Customer = Stripe.Customer & { deleted?: boolean }

export class QueryManageCustomer extends StripeEndpoint {
  async run(params: ManageCustomerParams, meta: EndpointMeta): Promise<EndpointResponse<CustomerData>> {
    const { _action, orgId } = params

    try {
      if (!orgId) {
        throw abort('Missing orgId', meta)
      }

      switch (_action) {
        case 'create':
          return this.createCustomer(params, meta)
        case 'update':
          return this.updateCustomer(params, meta)
        case 'retrieve':
          return this.retrieveCustomer(params, meta)
        default:
          throw abort('Invalid action')
      }
    }
    catch (err) {
      const error = err as ErrorConfig
      const code = error.code || 'OPERATION_FAILED'
      this.log.error('Payment API Error', { error, params })
      return { status: 'error', message: 'Payment API Error', code }
    }
  }

  private async getOrgData(args: { orgId: string, caller?: string }, meta: EndpointMeta): Promise<Organization> {
    const { orgId, caller = 'unknown' } = args
    const liveStripe = this.settings.fictionStripe.stripeMode.value === 'live'
    if (!orgId) {
      throw abort(`No orgId provided (${caller})`, meta)
    }

    const org = await this.db()
      .select('*')
      .from(standardTable.org)
      .where({ orgId })
      .first<Organization>()

    if (!org) {
      throw abort(`Organization not found: ${orgId}`, meta)
    }

    if (!liveStripe) {
      org.billing = { ...org.billing, customerId: org.billing?.customerIdTest }
    }

    return org
  }

  private async getCustomerByOrgData(args: { orgId: string, caller: string }, meta: EndpointMeta): Promise<Customer | undefined> {
    const { orgId, caller = 'unknown' } = args

    const stripe = this.settings.fictionStripe.getServerClient()

    if (!orgId) {
      throw abort(`No orgId provided (${caller})`, meta)
    }

    const org = await this.getOrgData({ orgId, caller }, meta)

    if (!org.billing?.customerId)
      return

    try {
      return await stripe.customers.retrieve(org.billing?.customerId) as Stripe.Customer & { deleted?: boolean }
    }
    catch (error) {
      this.log.error('Payment API Error: Failed to retrieve customer from OrgData', { error, org })
    }
  }

  private async createNewCustomer(args: { orgId: string, caller?: string }, _meta: EndpointMeta): Promise<Customer> {
    const { orgId, caller } = args

    this.log.info('Creating new customer', { data: { orgId, caller } })

    const org = await this.getOrgData({ orgId, caller }, _meta)

    const { email, name } = org

    const customer = await this.stripe().customers.create({
      email,
      name,
      description: orgId,
      metadata: {
        orgId,
        stripeMode: this.settings.fictionStripe.stripeMode.value,
        deployMode: this.settings.fictionStripe.settings.fictionEnv.mode.value || 'unknown',
      },
    })

    await this.saveCustomerIdToOrg({ orgId, customerId: customer.id }, _meta)

    return customer as Customer
  }

  private async getCustomerByOrgId(args: { orgId: string, caller: string }, _meta: EndpointMeta): Promise<Customer> {
    const { orgId, caller = 'unknown' } = args
    const stripe = this.settings.fictionStripe.getServerClient()
    const query = `metadata[\"orgId\"]:\"${orgId}\"`

    const searchResponse = await stripe.customers.search({ query })

    const existingCustomers = searchResponse.data

    if (existingCustomers.length > 1) {
      this.log.error('Multiple customers found for orgId', { orgId, customers: existingCustomers })
    }

    let customer: Stripe.Customer | undefined
    if (existingCustomers.length > 0) {
      customer = existingCustomers[0]
    }
    else {
      customer = await this.getCustomerByOrgData({ orgId, caller: `getCustomerByOrgId-${caller}` }, _meta)
    }

    if (!customer) {
      customer = await this.createNewCustomer({ orgId, caller: `getCustomerByOrgId-${caller}` }, _meta)
    }

    return customer as Customer
  }

  private async getRefinedCustomerData(args: { orgId: string }, _meta: EndpointMeta): Promise<CustomerData> {
    const { orgId } = args

    const customer = await this.getCustomerByOrgId({ orgId, caller: 'getRefinedCustomerData' }, _meta)
    const org = await this.getOrgData({ orgId }, _meta)

    let subscriptions: Stripe.Subscription[] = []
    if (customer && !customer?.deleted) {
      const response = await this.stripe().subscriptions.list({ customer: customer?.id })
      subscriptions = response.data
    }

    const raw = { customer, subscriptions, org }

    return processCustomerData({ raw, products: this.products })
  }

  private async createCustomer(
    params: ManageCustomerParams & { _action: 'create' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { orgId } = params

    if (!orgId)
      throw abort('no orgId provided', _meta)

    const customerData = await this.getRefinedCustomerData({ orgId }, _meta)

    return { status: 'success', data: customerData, message: 'Customer created successfully' }
  }

  private async updateCustomer(
    params: ManageCustomerParams & { _action: 'update' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { fields: { email, name }, orgId } = params
    const stripe = this.settings.fictionStripe.getServerClient()
    const customer = await this.getCustomerByOrgId({ orgId, caller: 'updateCustomer' }, _meta)

    if (!customer || customer?.deleted) {
      throw abort(`Can't update, customer not found`, _meta)
    }

    await stripe.customers.update(customer.id, { email, name })

    const customerData = await this.getRefinedCustomerData({ orgId }, _meta)

    return { status: 'success', data: customerData, message: 'Customer updated successfully' }
  }

  private async retrieveCustomer(
    params: ManageCustomerParams & { _action: 'retrieve' },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<CustomerData>> {
    const { orgId } = params

    const customerData = await this.getRefinedCustomerData({ orgId }, _meta)
    return { status: 'success', data: customerData }
  }

  dbMergeJsonData(column: string, mergeData: object) {
    return this.db().raw(`COALESCE(??, '{}') || ?`, [column, JSON.stringify(mergeData)])
  }

  private async saveCustomerIdToOrg(args: {
    orgId: string
    customerId?: string | null
  }, _meta: EndpointMeta): Promise<void> {
    const { orgId, customerId } = args
    const liveStripe = this.settings.fictionStripe.stripeMode.value === 'live'
    const billingKey = liveStripe ? 'customerId' : 'customerIdTest'

    await this.db().from(standardTable.org).where({ orgId }).update({
      billing: this.dbMergeJsonData('billing', { [billingKey]: customerId }),
    })
  }
}

export class QueryPortalSession extends StripeEndpoint {
  async run(params: { orgId: string, returnUrl?: string }, _meta: EndpointMeta): Promise<EndpointResponse<Stripe.BillingPortal.Session> & { customer?: Stripe.Customer }> {
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
    priceLookupKey?: string
    trialPeriodDays?: number
  }, _meta: EndpointMeta): Promise<EndpointResponse<Stripe.Checkout.Session> & { customer?: Stripe.Customer }> {
    const { orgId, trialPeriodDays = 14, priceLookupKey } = params
    const fictionStripe = this.settings.fictionStripe
    const stripe = fictionStripe.getServerClient()

    const r = await fictionStripe.queries.ManageCustomer.serve({ _action: 'retrieve', orgId }, _meta)
    const customer = r.data?.customer
    const customerId = customer?.id

    if (!customerId) {
      return { status: 'error', message: `customerId not found` }
    }

    const sessionPriceId = await fictionStripe.getPriceByLookupKey(priceLookupKey)

    if (!sessionPriceId) {
      return { status: 'error', message: `priceId not found (${priceLookupKey})` }
    }

    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        ui_mode: 'embedded',
        line_items: [
          { price: sessionPriceId, quantity: 1 },
        ],
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
