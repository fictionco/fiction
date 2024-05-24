import './register'
import type express from 'express'
import type { FictionApp, FictionDb, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import { Endpoint, FictionPlugin, dayjs, isActualBrowser, toLabel, vue } from '@fiction/core'

import type * as StripeJS from '@stripe/stripe-js'
import Stripe from 'stripe'
import { getCycleRange } from './utils'
import { QueryGetCustomerData, QueryListSubscriptions, QueryManageCustomer } from './endpoints'
import type * as types from './types'

interface CheckoutQueryParams {
  priceId?: string
  loginPath?: string
  customerId?: string
  orgId?: string
  trialPeriod?: string
  customerEmail?: string
}

export type StripePluginSettings = {
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionServer: FictionServer
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  fictionDb: FictionDb
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  webhookSecret?: string
  isLive?: vue.Ref<boolean> | boolean
  products: types.StripeProductConfig[]
  checkoutSuccessPathname?: (args: { orgId: string }) => string
  checkoutCancelPathname?: (args: { orgId: string }) => string
  customerPortalUrl: string
  useCustomerManager?: boolean
} & FictionPluginSettings

export class FictionStripe extends FictionPlugin<StripePluginSettings> {
  apiVersion = '2024-04-10' as const

  queries = {
    ManageCustomer: new QueryManageCustomer({ fictionStripe: this, ...this.settings }),
    ListSubscriptions: new QueryListSubscriptions({ fictionStripe: this, ...this.settings }),
    GetCustomerData: new QueryGetCustomerData({ fictionStripe: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  browserClient?: StripeJS.Stripe
  serverClient?: Stripe
  isLive = this.settings.isLive ?? this.settings.fictionEnv.isProd.value
  stripeMode = vue.computed(() => {
    const isLive = this.settings.isLive
    const v = vue.isRef(isLive) ? isLive?.value : isLive
    return v ? 'live' : 'test'
  })

  secretKey = vue.computed(() => this.stripeMode.value === 'live' ? this.settings.secretKeyLive : this.settings.secretKeyTest)
  publicKey = vue.computed(() => this.stripeMode.value === 'live' ? this.settings.publicKeyLive : this.settings.publicKeyTest)
  activeCustomerId = vue.computed(() => this.settings.fictionUser?.activeOrganization.value?.customerId)

  useCustomerManager = this.settings.useCustomerManager ?? false
  activeCustomer = vue.ref<types.CustomerDetails | undefined>()
  initialized?: Promise<boolean>
  resolveCustomerLoad?: (value: boolean | PromiseLike<boolean>) => void
  loading = vue.ref(false)
  cycleEndAtIso = vue.computed(() => this.activeCustomer.value?.cycleEndAtIso)
  cycleStartAtIso = vue.computed(() => this.activeCustomer.value?.cycleStartAtIso)

  customerPortalUrl = vue.computed(() => {
    const activeCustomer = this.activeCustomer.value
    const stripeCustomer = activeCustomer?.customer

    let prefilledEmail = ''
    if (stripeCustomer && 'email' in stripeCustomer)
      prefilledEmail = `?prefilled_email=${encodeURIComponent(stripeCustomer.email || '')}`

    return `${this.settings.customerPortalUrl}${prefilledEmail}`
  })

  constructor(settings: StripePluginSettings) {
    super('stripe', settings)

    const checkoutEndpoint = new Endpoint({
      requestHandler: (...r) => this.checkoutEndpointHandler(...r),
      key: 'oAuthEndpoint',
      basePath: '/stripe-checkout/:action',
      serverUrl: this.settings.fictionServer.serverUrl.value,
      fictionUser: this.settings.fictionUser,
      fictionEnv: this.settings.fictionEnv,
      useNaked: true,
    })

    this.settings.fictionServer.addEndpoints([checkoutEndpoint])

    /**
     * Update customer email information when corresponding org is updated
     */
    this.settings.fictionEnv?.addHook({
      hook: 'updateOrganization',
      callback: async (o) => {
        if (!o.orgId)
          throw new Error('updateOrganization hook missing orgId')

        const { orgId, orgEmail, orgName, customerId } = o
        await this.queries.ManageCustomer.serve(
          { _action: 'update', orgId, email: orgEmail, name: orgName, customerId },
          { server: true },
        )
      },
    })

    if (!this.settings.fictionEnv.isApp.value) {
      this.log.info('initializing stripe', {
        data: { secretKeyExists: !!this.secretKey.value, publicKeyExists: !!this.publicKey.value, stripeMode: this.stripeMode.value },
      })

      if (!this.secretKey.value)
        this.log.warn(`stripe secretKey key not set: ${this.stripeMode.value}`)

      if (!this.publicKey.value)
        this.log.warn(`stripe publicKey key not set: ${this.stripeMode.value}`)
    }

    if (this.useCustomerManager)
      this.customerDataWatcher().catch(console.error)
  }

  async customerDataWatcher() {
    if (!this.settings.fictionEnv.isApp.value)
      return

    if (isActualBrowser())
      this.customerInitialized().catch(console.error)

    await this.settings.fictionUser.pageInitialized()

    this.loading.value = true
    /**
     * Update when organization changes
     */
    vue.watch(
      () => this.settings.fictionUser.activeOrganization.value,
      async () => {
        await this.setCustomerData({ reason: 'organization changed' })
      },

      { immediate: true },
    )
  }

  setCustomerData = async (
    args: { reason?: string } = {},
  ): Promise<types.CustomerDetails | undefined> => {
    const { reason } = args
    this.log.warn(`setCustomerData called: ${reason}`, {
      data: {
        user: this.settings.fictionUser.activeUser.value,
        org: this.settings.fictionUser.activeOrganization.value,
      },
    })

    await this.settings.fictionUser.userInitialized({ caller: 'setCustomerData' })

    const org = this.settings.fictionUser?.activeOrganization.value

    if (!org || !org.orgId) {
      this.activeCustomer.value = undefined
      if (this.resolveCustomerLoad)
        this.resolveCustomerLoad(true)
      return
    }

    const { orgName, orgEmail, orgId, specialPlan, createdAt } = org

    this.loading.value = true

    const r = await this.requests.GetCustomerData.request({
      orgId,
      orgName,
      email: orgEmail ?? this.settings.fictionUser?.activeUser.value?.email,
    })

    const customerData = r.data
    const customerId = customerData?.customer?.id

    this.log.info(`SET CUSTOMER DATA: ${orgId}, live: ${this.stripeMode.value}`, { data: { reason, customer: customerData } })

    const basics = { specialPlan, customerId, orgId, customer: customerData?.customer }

    let details: Partial<types.CustomerDetails> | undefined

    const pricing = this.settings.products.flatMap(_ => _.pricing.map(p => ({ ..._, ...p, planName: p.planName || toLabel(p.alias) })))

    customerData?.subscriptions?.forEach((sub) => {
      const price = pricing.find(p => p.priceId === sub.items.data[0].price.id)

      if (price && (sub.status === `trialing` || sub.status === `active`)) {
        const { timeEnd, timeStart, anchorDateUtc } = getCycleRange({
          timestamp: sub.billing_cycle_anchor,
        })
        const subscriptionId = sub.id
        const isTrial = sub.status === `trialing`
        const isCanceled = !!sub.canceled_at
        details = {
          ...basics,
          ...price,
          subscriptionId,
          isTrial,
          anchorDateUtc,
          cyclePeriod: 'month',
          cycleEndAtIso: timeEnd.toISOString(),
          cycleStartAtIso: timeStart.toISOString(),
          isCanceled,
        }
      }
    })

    if (!details) {
      const dayJsCreatedAt = dayjs(createdAt)

      const now = dayjs()
      const cycleStartAt = dayJsCreatedAt.year(now.year()).month(now.month())

      // If the cycle start date is in the future, move it back one month
      if (cycleStartAt.isAfter(now))
        cycleStartAt.subtract(1, 'month')

      const cycleEndAt = cycleStartAt.add(1, 'month')

      details = {
        ...basics,
        plan: 'free',
        planName: 'Free',
        tier: 0,
        quantity: 0,
        credits: 0,
        icon: 'i-carbon-star-half',
        isTrial: false,
        priceId: '',
        cost: 0,
        group: 'free',
        costPerUnit: 0,
        duration: 'month',
        cycleStartAtIso: cycleStartAt.toISOString(),
        cycleEndAtIso: cycleEndAt.toISOString(),
      }
    }

    if (details.specialPlan)
      details.planName = `${details.planName} (${details.specialPlan})`

    this.log.info(`SET CUSTOMER RESULT ${orgId}`, { data: details })

    this.activeCustomer.value = details as types.CustomerDetails
    this.loading.value = false

    if (this.resolveCustomerLoad)
      this.resolveCustomerLoad(true)

    return details as types.CustomerDetails
  }

  customerInitialized = async (): Promise< types.CustomerDetails | undefined> => {
    if (!this.initialized) {
      this.initialized = new Promise((resolve) => {
        this.resolveCustomerLoad = resolve
      })
    }

    await this.initialized

    return this.activeCustomer.value
  }

  getServerClient(): Stripe {
    if (this.settings.fictionEnv.isApp.value)
      throw new Error('Stripe is server only')

    if (!this.serverClient) {
      const key = this.secretKey.value

      if (!key)
        throw new Error('stripe secret key not found')

      this.serverClient = new Stripe(key, { apiVersion: this.apiVersion })
    }

    return this.serverClient
  }

  getBrowserClient = async (): Promise<StripeJS.Stripe> => {
    const StripeJS = await import('@stripe/stripe-js')

    if (!this.browserClient) {
      const publicKey = this.publicKey.value
      if (!publicKey)
        throw new Error('Stripe secret key not found')

      const createdClient = await StripeJS.loadStripe(publicKey)
      this.browserClient = createdClient ?? undefined
    }

    if (!this.browserClient)
      throw new Error('no stripe client created')

    return this.browserClient
  }

  async getCheckoutUrl(args: CheckoutQueryParams): Promise<string> {
    const { loginPath } = args

    if (this.fictionEnv?.isNode)
      return '#'

    await this.settings.fictionUser.userInitialized({ caller: 'getCheckoutUrl' })

    const u = this.settings.fictionUser.activeUser.value

    let link

    if (u) {
      const baseUrl = this.settings.fictionServer.serverUrl.value
      const url = new URL(`${baseUrl}/api/stripe-checkout/init`)

      args.orgId = this.settings.fictionUser.activeOrgId.value || ':orgId'
      args.customerId = this.activeCustomerId.value || ':customerId'

      if (args)
        url.search = new URLSearchParams(args as Record<string, string>).toString()

      link = url.toString()
    }
    else if (typeof location !== 'undefined') {
      const redirect = encodeURIComponent(location.href)
      link = `${loginPath}?redirect=${redirect}`
    }

    return link || ''
  }

  getCheckoutConfig(args: { orgId: string }) {
    const base = this.settings.fictionApp.appUrl.value
    const successPathCallback = this.settings.checkoutSuccessPathname
    const cancelPathCallback = this.settings.checkoutCancelPathname

    const successPath = successPathCallback ? successPathCallback(args) : '/checkout-success'
    const cancelPath = cancelPathCallback ? cancelPathCallback(args) : '/checkout-cancel'

    const config = {
      successUrl: `${base}${successPath}`,
      cancelUrl: `${base}${cancelPath}`,
    }

    this.log.info('checkout config', { data: config })

    return config
  }

  async checkoutEndpointHandler(
    request: express.Request,
    response: express.Response,
  ): Promise<void> {
    const query = request.query as Record<string, string>
    const params = request.params as { action?: 'init' }

    const { action } = params

    if (!action) {
      this.log.error('Invalid request', { action })
      response.status(400).send('Invalid request')
      return
    }

    try {
      if (action === 'init') {
        const { priceId, customerId, trialPeriod, orgId }
          = query as CheckoutQueryParams

        if (!priceId)
          throw this.stop('no priceId')
        if (!customerId)
          throw this.stop('no customerId')
        if (!orgId)
          throw this.stop('no ordId')

        const stripe = this.getServerClient()

        const { successUrl, cancelUrl } = this.getCheckoutConfig({
          orgId,
        })

        const trialPeriodNum = trialPeriod ? +trialPeriod : 0

        if (+trialPeriodNum > 14)
          throw new Error('trial error')

        const subscription_data = trialPeriodNum
          ? { description: `${trialPeriodNum} Days Free`, trial_period_days: +trialPeriodNum }
          : {}

        const details: Stripe.Checkout.SessionCreateParams = {
          line_items: [{ price: priceId, quantity: 1 }],
          customer: customerId,
          subscription_data,
          mode: 'subscription',
          success_url: successUrl,
          cancel_url: cancelUrl,
          allow_promotion_codes: true,
        }

        const session = await stripe.checkout.sessions.create(details)

        this.log.info('creating checkout session', {
          data: {
            details,
            stripeMode: this.stripeMode.value,
            publicKey: this.publicKey.value,
            stripeRedirectUrl: session.url,
          },
        })

        if (session.url)
          response?.redirect(303, session.url)
      }
      else {
        throw this.stop('invalid action')
      }
    }
    catch (error) {
      const e = error as Error
      this.log.error('endpoint threw an error', { error })
      response.status(400).send({ status: 'error', message: e.message }).end()
    }
  }
}
