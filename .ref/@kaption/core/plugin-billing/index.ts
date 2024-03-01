import { vue } from '@factor/api'
import type stripe from 'stripe'
import type {
  OrganizationCustomerData,
  OrganizationMember,
} from '@factor/api/plugin-admin'
import {
  AppTable,
} from '@factor/api/plugin-admin'
import type { KaptionPluginSettings } from '../utils'
import { KaptionPlugin } from '../utils'
import type { KaptionEventOps, UsageData } from '../plugin-beacon/ops'
import type { KaptionCache } from '../plugin-cache'
import routes from './routes'
import type * as types from './types'

export type KaptionBillingSettings = {
  kaptionEventOps: KaptionEventOps
  kaptionCache: KaptionCache
  isLive: vue.Ref<boolean>
} & KaptionPluginSettings

export class KaptionBilling extends KaptionPlugin<KaptionBillingSettings> {
  factorStripe = this.settings.factorStripe
  factorAdmin = this.settings.factorAdmin
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorRouter = this.settings.factorRouter
  kaptionCache = this.settings.kaptionCache
  factorApp = this.settings.factorApp
  customerLoadingKey = 'customerLoading'
  isLive = this.settings.isLive
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: KaptionBillingSettings) {
    super('billing', settings)
    this.addStripeHooks()

    this.factorRouter?.update(routes)
    this.factorEnv?.uiPaths.push(`${this.root}/*.vue`)

    this.settings.kaptionEventOps.addHook({
      hook: 'hour',
      callback: usage => this.reportUsage('hour', usage),
    })
  }

  activeCustomerId = vue.computed(() => {
    return this.factorAdmin?.activeOrganization.value?.customerId
  })

  activeCustomerData = vue.computed(() => {
    return this.utils.stored<types.CustomerData>('customerData')
  })

  activeSubscription = vue.computed(() => {
    const subs = this.activeCustomerData.value?.subscriptions ?? []

    return subs.find(_ => _.status)
  })

  /**
   * Get active sub plan
   * @computed
   */
  activePlan = vue.computed<types.Plan>(() => {
    const sub = this.activeSubscription.value
    const name
      = sub && ['active', 'trialing'].includes(sub.status) ? 'pro' : 'free'

    // to prevent flash of free/pro that doesn't represent state as user loads
    const defaultName = this.activeCustomerData.value ? 'free' : 'unknown'
    return sub ? { name, status: sub.status } : { name: defaultName }
  })

  activeMembership = vue.computed<OrganizationMember | undefined>(() => {
    const user = this.factorUser?.activeUser.value
    const org = this.factorAdmin?.activeOrganization.value
    return org?.members.find(_ => _.userId === user?.userId)
  })

  activeIsPro = vue.computed(() => {
    return this.activePlan.value.name === 'pro'
  })

  addStripeHooks() {
    this.factorStripe?.addHook({
      hook: 'onCustomerCreated',
      callback: this.handleCustomerCreated,
    })

    this.factorStripe?.addHook({
      hook: 'onSubscriptionUpdate',
      callback: this.handleSubscriptionUpdate,
    })
  }

  setCustomerData = async (organizationId: string): Promise<void> => {
    this.log.info(`set customer: ${organizationId}`)
    const org = this.factorAdmin?.activeOrganizations.value.find(
      o => o.organizationId === organizationId,
    )
    if (!org)
      throw new Error('missing organization')

    const { customerId, organizationName, organizationEmail } = org

    this.utils.storeItem(this.customerLoadingKey, true)

    await this.factorStripe?.requests.ManageCustomer.request({
      customerId,
      organizationId,
      name: organizationName,
      email: organizationEmail ?? this.factorUser?.activeUser.value?.email,
      _action: 'retrieve',
    })
    this.utils.storeItem(this.customerLoadingKey, false)
  }

  initializeCustomer = (): void => {
    this.utils.storeItem(this.customerLoadingKey, true)
    this.utils.vue.watch(
      () => this.factorAdmin?.activeOrganization.value?.organizationId,
      async (v) => {
        if (v)
          await this.setCustomerData(v)
      },

      { immediate: true },
    )
  }

  saveCustomerInfo = async (
    customerId: string,
    data: Partial<OrganizationCustomerData>,
  ): Promise<void> => {
    const db = this.factorDb.client()

    const customerField = this.isLive.value ? 'customer' : 'customer_test'

    const customerMerge = db.raw(
      `coalesce(${customerField}::jsonb, '{}'::jsonb) || ?::jsonb`,
      JSON.stringify(data),
    )

    const save = this.isLive.value
      ? { customer: customerMerge }
      : { customerTest: customerMerge }

    const where = this.isLive.value
      ? { customerId }
      : { customerIdTest: customerId }

    const org = await db
      .update(save)
      .from(AppTable.Organizations)
      .where(where)
      .returning('*')

    this.log.info(`added customer id to org`, { data: { org } })
  }

  handleCustomerCreated = async ({
    customer,
    organizationId,
  }: {
    customer: stripe.Customer
    organizationId: string
  }): Promise<void> => {
    const customerId = customer.id
    const db = this.factorDb.client()
    const save = this.isLive.value
      ? { customerId }
      : { customerIdTest: customerId }

    await db.update(save).from(AppTable.Organizations).where({ organizationId })

    await this.saveCustomerInfo(customerId, { customerId })
  }

  handleSubscriptionUpdate = async (
    sub: stripe.Subscription,
  ): Promise<void> => {
    const customerId
      = typeof sub.customer === 'object' ? sub.customer.id : sub.customer

    const { id: subscriptionId, items, status: subscriptionStatus } = sub
    const {
      id: subscriptionItemId,
      price: { id: priceId, product },
    } = items.data[0]

    const productId = typeof product === 'string' ? product : product.id

    await this.saveCustomerInfo(customerId, {
      subscriptionId,
      subscriptionStatus,
      subscriptionItemId,
      priceId,
      productId,
    })

    this.log.debug(`stripe event`, { data: { sub } })
  }

  async reportUsage(
    period: 'day' | 'hour' | 'quarterHour',
    usage: UsageData,
  ): Promise<void> {
    const cache = this.kaptionCache.getCache()
    if (!cache)
      throw new Error('no cache')

    try {
      const subs = [
        { env: 'live', customerId: usage.customerId },
        { env: 'test', customerId: usage.customerIdTest },
      ] as const

      /**
       * Report usage to stripe
       */
      const _promises = subs.map(
        async ({ env, customerId }): Promise<stripe.UsageRecord | void> => {
          if (!this.factorStripe)
            throw new Error('no stripe')
          if (!customerId)
            return
          if (env === 'live' && !this.isLive.value)
            return

          const timestamp = this.utils.dayjs()

          const stripeInstance = this.factorStripe.getServerClient()

          const sessionUsageAmount = usage[period]?.session || 0

          this.log.info(
            `filing ${period} usage report org:${usage.organizationId}: ${sessionUsageAmount} sessions`,
            {
              data: usage,
            },
          )

          let billedQuantity = -1

          // get customer subscriptions with stripe for env
          const subs: stripe.ApiList<stripe.Subscription>
            = await stripeInstance.subscriptions.list({ customer: customerId })

          if (!subs.data) {
            this.log.error(`no subscriptions for ${customerId}`, { data: subs })
            return
          }

          // get subscription Ids
          const subscriptionItems = subs.data.flatMap(sub => sub.items.data)
          const si
            = subscriptionItems.length > 0 ? subscriptionItems[0].id : undefined

          // The user doesn't have a stripe subscription so don't report
          let usageRecord: stripe.UsageRecord | undefined
          if (si) {
            try {
              usageRecord
                = await stripeInstance.subscriptionItems.createUsageRecord(
                  si,
                  {
                    quantity: sessionUsageAmount,
                    timestamp: timestamp.unix(),
                  },
                  {
                    idempotencyKey: si + timestamp.format('YYYY-MM-DD-HH-MM'),
                  },
                )
            }
            catch (error: unknown) {
              const e = error as Error
              if (e.message.includes('idempotent'))
                this.log.debug(`duplicated request ${e.message}`)
              else
                this.log.error(`could not create usage record`, { error: e })
            }
            try {
              const {
                lines: { data: invoiceItems },
              } = await stripeInstance.invoices.retrieveUpcoming({
                customer: customerId,
              })

              if (invoiceItems.length > 0)
                billedQuantity = invoiceItems[0].quantity ?? -1
            }
            catch (error) {
              this.log.error('no upcoming invoice', { data: error })
            }

            this.log.info(
              `report '${env}' usage: ${sessionUsageAmount}, total: ${billedQuantity}`,
            )
          }
          else {
            this.log.warn(`no subscription for ${usage.organizationId}`, {
              data: subs,
            })
          }

          return usageRecord
        },
      )

      await Promise.all(_promises)
    }
    catch (error) {
      this.log.error('could not report usage', { error })
    }
  }
}
