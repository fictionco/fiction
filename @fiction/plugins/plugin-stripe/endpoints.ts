import { Query, runHooks } from '@fiction/core'
import type { EndpointManageAction, EndpointMeta, EndpointResponse, FictionDb, FictionUser, Organization, OrganizationCustomerData } from '@fiction/core'
import type Stripe from 'stripe'
import type { CustomerData, HookDictionary } from './types'
import type { FictionStripe } from '.'

abstract class QueryPayments extends Query {
  fictionUser: FictionUser
  fictionStripe: FictionStripe
  fictionDb: FictionDb

  constructor(settings: {
    fictionUser: FictionUser
    fictionStripe: FictionStripe
    fictionDb: FictionDb
  }) {
    super(settings)

    this.fictionUser = settings.fictionUser
    this.fictionStripe = settings.fictionStripe
    this.fictionDb = settings.fictionDb
  }

  saveCustomerInfo = async (args: {
    orgId: string
    customerId?: string | null
    customerAuthorized?: 'authorized' | 'invalid' | null
    data?: Partial<OrganizationCustomerData>
  }): Promise<void> => {
    const { orgId, customerId, customerAuthorized, data } = args
    const db = this.fictionDb.client()

    const liveStripe = this.fictionStripe.stripeMode.value === 'live'

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
    const db = this.fictionDb.client()
    const stripe = this.fictionStripe.getServerClient()

    const liveStripe = this.fictionStripe.stripeMode.value === 'live'

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
          data: { customerId: undefined },
          customerAuthorized: null,
        })

        customer = undefined
      }
    }

    return { customer, org }
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
    const stripe = this.fictionStripe.getServerClient()

    const { _action, email = '', name = '', orgId } = params

    if (!orgId)
      throw new Error('No orgId provided')

    const c = await this.getCustomer(orgId)
    let { customer } = c
    const { org } = c

    if (_action === 'create' || (_action === 'retrieve' && !customer)) {
      this.log.warn(`creating new customer`, { data: { org } })
      customer = await stripe.customers.create({
        email,
        name,
        description: orgId,
        metadata: {
          orgId,
          stripeMode: this.fictionStripe.stripeMode.value,
          deployMode: this.fictionStripe.settings.fictionEnv.mode.value || 'unknown',
        },
      })

      const customerId = customer.id

      await this.saveCustomerInfo({ orgId, customerId: customer.id, data: { customerId } })

      await runHooks<HookDictionary>({
        list: this.fictionStripe.hooks,
        hook: 'onCustomerCreated',
        args: [{ customer, email, orgId, name }, { fictionStripe: this.fictionStripe }],
      })
    }
    else if (_action === 'update') {
      if (!customer)
        throw this.stop('no customer to update')
      customer = await stripe.customers.update(customer.id, { email, name })
    }

    return { status: 'success', data: customer, customerId: customer?.id }
  }
}

export class QueryListSubscriptions extends QueryPayments {
  async run(params: { orgId: string }, _meta: EndpointMeta): Promise<EndpointResponse<Stripe.Subscription[]>> {
    const { orgId } = params

    if (!orgId)
      throw this.stop('no orgId')

    const { customer } = await this.getCustomer(orgId)

    const out: Stripe.Subscription[] = []

    if (customer?.id) {
      const stripe = this.fictionStripe.getServerClient()
      const subs = await stripe.subscriptions.list({ customer: customer?.id })

      // Iterate through the subscriptions
      for (const subscription of subs.data)

        out.push(subscription)
    }

    return { status: 'success', data: out }
  }
}

export class QueryGetCustomerData extends QueryPayments {
  async run({ orgId, orgName, email }: {
    orgId: string
    orgName?: string
    email?: string
    verify?: boolean
  }, meta: EndpointMeta): Promise<EndpointResponse<CustomerData>> {
    if (!orgId)
      throw new Error('no organization id provided to get customer data')

    const customer = await this.fictionStripe.queries.ManageCustomer.serve({ orgId, name: orgName, email, _action: 'retrieve' }, meta)
    const subscriptions = await this.fictionStripe.queries.ListSubscriptions.serve({ orgId }, meta)

    const data: CustomerData = {
      subscriptions: subscriptions.data ?? [],
      customer: customer.data,
    }

    return { status: 'success', data }
  }
}
