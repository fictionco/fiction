import './register'
import type express from 'express'
import type {
  EndpointResponse,
  FactorApp,
  FactorDb,
  FactorEnv,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
  HookType,
} from '@fiction/core'
import {
  Endpoint,
  FactorPlugin,
  dayjs,
  vue,
} from '@fiction/core'

import type * as StripeJS from '@stripe/stripe-js'
import Stripe from 'stripe'
import { getCycleRange } from './utils'
import {
  QueryAllProducts,
  QueryGetCoupon,
  QueryGetCustomerData,
  QueryGetInvoices,
  QueryGetProduct,
  QueryListSubscriptions,
  QueryManageCustomer,
  QueryManageSubscription,
  QueryPaymentMethod,
} from './endpoints'
import type * as types from './types'
import { FactorUsage } from './plugin-usage'

interface CheckoutQueryParams {
  priceId?: string
  loginPath?: string
  customerId?: string
  orgId?: string
  trialPeriod?: string
  customerEmail?: string
}

export type StripePluginSettings = {
  factorEnv: FactorEnv
  factorApp: FactorApp
  factorServer: FactorServer
  factorUser: FactorUser
  factorRouter: FactorRouter
  factorDb: FactorDb
  publicKeyLive?: string
  publicKeyTest?: string
  secretKeyLive?: string
  secretKeyTest?: string
  webhookSecret?: string
  isLive?: vue.Ref<boolean> | boolean
  hooks?: HookType<types.HookDictionary>[]
  products: types.StripeProductConfig[]
  checkoutSuccessPathname?: (args: { orgId: string }) => string
  checkoutCancelPathname?: (args: { orgId: string }) => string
  customerPortalUrl: string
  useCustomerManager?: boolean
} & FactorPluginSettings

export class FactorStripe extends FactorPlugin<StripePluginSettings> {
  apiVersion = '2023-10-16' as const
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorApp = this.settings.factorApp
  factorEnv = this.settings.factorEnv
  factorDb = this.settings.factorDb
  factorRouter = this.settings.factorRouter
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  browserClient?: StripeJS.Stripe
  serverClient?: Stripe
  isLive = this.settings.isLive ?? this.factorEnv.isProd.value
  stripeMode = this.utils.vue.computed(() => {
    const isLive = this.settings.isLive
    const v = vue.isRef(isLive) ? isLive?.value : isLive
    return v ? 'live' : 'test'
  })

  hooks = this.settings.hooks ?? []
  products = this.utils.vue.computed(() => {
    return this.settings.products
  })

  pricing = this.utils.vue.computed<types.StripePriceConfig[]>(() => {
    return this.products.value.flatMap((_) => {
      return _.pricing.map((p) => {
        const out: types.StripePriceConfig = { ..._, ...p }
        out.planName = out.planName || this.utils.toLabel(out.productKey)
        return out
      })
    })
  })

  publicKeyLive = this.settings.publicKeyLive
  publicKeyTest = this.settings.publicKeyTest
  secretKeyLive = this.settings.secretKeyLive
  secretKeyTest = this.settings.secretKeyTest
  secretKey = this.utils.vue.computed(() => {
    return this.stripeMode.value === 'live'
      ? this.settings.secretKeyLive
      : this.settings.secretKeyTest
  })

  publicKey = this.utils.vue.computed(() => {
    return this.stripeMode.value === 'live'
      ? this.settings.publicKeyLive
      : this.settings.publicKeyTest
  })

  webhookSecret = this.settings.webhookSecret

  activeCustomerId = this.utils.vue.computed(() => {
    return this.factorUser?.activeOrganization.value?.customerId
  })

  useCustomerManager = this.settings.useCustomerManager ?? false
  activeCustomer = this.utils.vue.ref<types.CustomerDetails | undefined>()
  initialized?: Promise<boolean>
  resolveCustomerLoad?: (value: boolean | PromiseLike<boolean>) => void
  loading = this.utils.vue.ref(false)
  usage = new FactorUsage({ ...this.settings, factorStripe: this })
  customerPortalUrl = this.utils.vue.computed(() => {
    const activeCustomer = this.activeCustomer.value
    const stripeCustomer = activeCustomer?.customer

    let prefilledEmail = ''
    if (stripeCustomer && 'email' in stripeCustomer) {
      prefilledEmail = `?prefilled_email=${encodeURIComponent(
        stripeCustomer.email || '',
      )}`
    }

    return `${this.settings.customerPortalUrl}${prefilledEmail}`
  })

  constructor(settings: StripePluginSettings) {
    super('stripe', settings)

    const stripeWebhookEndpoint = new Endpoint({
      requestHandler: (..._) => this.stripeHookHandler(..._),
      key: 'stripeWebhooks',
      basePath: '/stripe-webhook',
      serverUrl: this.factorServer.serverUrl.value,
      factorUser: this.factorUser,
      useNaked: true,
    })

    const checkoutEndpoint = new Endpoint({
      requestHandler: (...r) => this.checkoutEndpointHandler(...r),
      key: 'oAuthEndpoint',
      basePath: '/stripe-checkout/:action',
      serverUrl: this.factorServer.serverUrl.value,
      factorUser: this.factorUser,
      useNaked: true,
    })

    this.factorServer.addEndpoints([stripeWebhookEndpoint, checkoutEndpoint])

    this.factorApp.addHook({
      hook: 'viteConfig',
      callback: (config) => {
        return [
          ...config,
          {
            optimizeDeps: {
              exclude: ['@stripe/stripe-js'],
            },
          },
        ]
      },
    })

    /**
     * Update customer email information when corresponding org is updated
     */
    this.factorUser?.addHook({
      hook: 'updateOrganization',
      callback: async (o) => {
        if (!o.orgId)
          throw new Error('updateOrganization hook missing orgId')

        const {
          orgId,
          orgEmail,
          orgName,
          customerId,
        } = o
        await this.queries.ManageCustomer.serve(
          {
            _action: 'update',
            orgId,
            email: orgEmail,
            name: orgName,
            customerId,
          },
          { server: true },
        )
      },
    })

    if (!this.factorEnv.isApp.value) {
      this.log.info('initializing stripe', {
        data: {
          secretKeyExists: !!this.secretKey.value,
          publicKeyExists: !!this.publicKey.value,
          stripeMode: this.stripeMode.value,
          isProd: this.factorEnv.isProd.value,
        },
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
    if (!this.factorEnv.isApp.value)
      return

    if (this.utils.isActualBrowser())
      this.customerInitialized().catch(console.error)

    await this.factorUser.pageInitialized()

    this.loading.value = true
    /**
     * Update when organization changes
     */
    this.utils.vue.watch(
      () => this.factorUser.activeOrganization.value,
      async () => {
        await this.setCustomerData({ reason: 'organization changed' })
      },

      { immediate: true },
    )

    const loopUsage = async () => {
      setTimeout(async () => {
        await this.customerInitialized()

        await this.usage.setUsage()
        loopUsage().catch(console.error)
      }, 60_000 * 10)
    }
    loopUsage().catch(console.error)

    vue.watch(
      () => this.activeCustomer.value?.customerId,
      async (v) => {
        if (v)
          await this.usage.setUsage()
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
        user: this.factorUser.activeUser.value,
        org: this.factorUser.activeOrganization.value,
      },
    })

    await this.factorUser.userInitialized({ caller: 'setCustomerData' })

    const org = this.factorUser?.activeOrganization.value

    if (!org || !org.orgId) {
      this.activeCustomer.value = undefined
      if (this.resolveCustomerLoad)
        this.resolveCustomerLoad(true)
      return
    }

    const {
      orgName,
      orgEmail,
      orgId,
      specialPlan,
      createdAt,
    } = org

    this.loading.value = true

    const r = await this.requests.GetCustomerData.request({
      orgId,
      orgName,
      email: orgEmail ?? this.factorUser?.activeUser.value?.email,
    })

    const customerData = r.data
    const customerId = customerData?.customer?.id

    this.log.info(
      `SET CUSTOMER DATA: ${orgId}, live: ${this.stripeMode.value}`,
      { data: { reason, customer: customerData } },
    )

    const basics = {
      specialPlan,
      customerId,
      orgId,
      customer: customerData?.customer,
    }

    let details: Partial<types.CustomerDetails> | undefined

    customerData?.subscriptions?.forEach((sub) => {
      const price = this.pricing.value.find(
        p => p.priceId === sub.items.data[0].price.id,
      )

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
          link: this.factorRouter?.link('orgIndex').value,
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
        link: '/',
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

  customerInitialized = async (): Promise<
    types.CustomerDetails | undefined
  > => {
    if (!this.initialized) {
      this.initialized = new Promise((resolve) => {
        this.resolveCustomerLoad = resolve
      })
    }

    await this.initialized

    return this.activeCustomer.value
  }

  public addHook(hook: HookType<types.HookDictionary>): void {
    this.hooks.push(hook)
  }

  protected createQueries() {
    const deps = {
      factorUser: this.factorUser,
      factorStripe: this,
      factorDb: this.factorDb,
    }
    return {
      ManageCustomer: new QueryManageCustomer(deps),
      ListSubscriptions: new QueryListSubscriptions(deps),
      GetInvoices: new QueryGetInvoices(deps),
      ManageSubscription: new QueryManageSubscription(deps),
      ManagePaymentMethod: new QueryPaymentMethod(deps),
      GetCustomerData: new QueryGetCustomerData(deps),
      AllProducts: new QueryAllProducts(deps),
      GetProduct: new QueryGetProduct(deps),
      GetCoupon: new QueryGetCoupon(deps),
    } as const
  }

  getServerClient(): Stripe {
    if (this.factorEnv.isApp.value)
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

  getStripeProduct = (params: {
    productKey?: string
    productId?: string
  }): types.StripeProductConfig | void => {
    if (!params.productKey && !params.productId)
      return

    const p = this.products.value

    let product: types.StripeProductConfig | undefined

    if (params.productKey)
      product = p.find(_ => _.productKey === params.productKey)
    else
      product = p.find(_ => _.productId === params.productId)

    if (!product || !product?.productKey) {
      this.log.error('No product found', { data: { params, product: p } })
      throw new Error(`FactorStripe Error`)
    }

    return product
  }

  getStripePrice = (params: { priceId: string }): types.StripePriceConfig => {
    // write a nested find function that finds subarray items in nested array
    const p = this.products.value
    const price = p
      .flatMap(_ => _.pricing)
      .find(_ => _.priceId === params.priceId)

    if (!price) {
      this.log.error('No price found', { data: { params, product: p } })
      throw new Error(`FactorStripe Error`)
    }

    return price
  }

  stripeHookHandler = async (
    request: express.Request,
    _response: express.Response,
  ): Promise<EndpointResponse> => {
    let event: Stripe.Event
    const stripe = this.getServerClient()
    try {
      const secret = this.webhookSecret
      if (!secret)
        throw new Error('no webhookSecret')

      event = stripe.webhooks.constructEvent(
        request.rawBody,
        request.headers['stripe-signature'] as string,
        secret,
      )
    }
    catch (error) {
      this.log.error(`stripe error`, { error })

      this.log.error(
        `stripe error: Webhook signature verification failed. Check the env file and enter the correct webhook secret`,
      )

      return { status: 'error' }
    }

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    if (event.type === 'invoice.paid') {
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      await this.utils.runHooks({
        list: this.hooks,
        hook: 'onInvoicePayment',
        args: [event, { factorStripe: this }],
      })
    }
    else if (event.type === 'checkout.session.completed') {
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      await this.utils.runHooks({
        list: this.hooks,
        hook: 'onCheckoutSuccess',
        args: [event, { factorStripe: this }],
      })
    }
    else if (event.type === 'invoice.payment_failed') {
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      await this.utils.runHooks({
        list: this.hooks,
        hook: 'onInvoicePaymentFailed',
        args: [event, { factorStripe: this }],
      })
    }
    else if (event.type === 'customer.subscription.deleted') {
      /**
       * if event.request is null, then it was cancelled from settings vs request
       */
      await this.utils.runHooks({
        list: this.hooks,
        hook: 'onCustomerSubscriptionDeleted',
        args: [event, { factorStripe: this }],
      })
    }
    else if (event.type === 'customer.subscription.trial_will_end') {
      /**
       * Three days before the trial period is up, a customer.subscription.trial_will_end event is sent to your webhook endpoint.
       * You can use that notification as a trigger to take any necessary actions, such as informing the customer that billing is about to begin.
       * https://stripe.com/docs/billing/subscriptions/trials
       */
      await this.utils.runHooks({
        list: this.hooks,
        hook: 'onSubscriptionTrialWillEnd',
        args: [event, { factorStripe: this }],
      })
    }
    else {
      this.log.error(`unexpected event type`, {
        data: event.data.object,
      })
    }

    return { status: 'success' }
  }

  async getCheckoutUrl(args: CheckoutQueryParams): Promise<string> {
    const { loginPath } = args
    await this.factorUser.userInitialized({ caller: 'getCheckoutUrl' })

    const u = this.factorUser.activeUser.value

    let link

    if (u) {
      const baseUrl = this.factorServer.serverUrl.value
      const url = new URL(`${baseUrl}/stripe-checkout/init`)

      args.orgId
        = this.factorUser.activeOrgId.value || ':orgId'
      args.customerId = this.activeCustomerId.value || ':customerId'

      if (args)
        url.search = new URLSearchParams(args as Record<string, string>).toString()

      link = url.toString()
    }
    else {
      const redirect = encodeURIComponent(location.href)
      link = `${loginPath}?redirect=${redirect}`
    }

    return link
  }

  getCheckoutConfig(args: { orgId: string }) {
    const base = this.factorApp.appUrl.value
    const successPathCallback = this.settings.checkoutSuccessPathname
    const cancelPathCallback = this.settings.checkoutCancelPathname
    const successPath = successPathCallback
      ? successPathCallback(args)
      : '/checkout-success'
    const cancelPath = cancelPathCallback
      ? cancelPathCallback(args)
      : '/checkout-cancel'

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
    const params = request.params as {
      action?: 'init'
    }

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

        const priceDetails = this.getStripePrice({ priceId })

        const trialPeriodNum = trialPeriod ? +trialPeriod : 0

        if (+trialPeriodNum > 14)
          throw new Error('trial error')

        const subscription_data = trialPeriodNum
          ? {
              description: `${trialPeriodNum} Days Free`,
              trial_period_days: +trialPeriodNum,
            }
          : {}

        const details: Stripe.Checkout.SessionCreateParams = {
          line_items: [
            {
              price: priceDetails.priceId,
              quantity: priceDetails.quantity || 1,
            },
          ],
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

  async requestManageSubscription(
    _action: 'change' | 'cancel' | 'endTrial',
    args: {
      subscriptionId: string
      priceId: string
      coupon?: string
      quantity?: number
    },
  ) {
    const orgId = this.factorUser.activeOrgId.value
    const customerId = this.activeCustomerId.value

    const { subscriptionId, priceId, coupon, quantity } = args

    if (!subscriptionId)
      throw new Error('No subscriptionId provided')
    if (!priceId)
      throw new Error('No priceId provided')
    if (!customerId)
      throw new Error('No customerId provided')
    if (!orgId)
      throw new Error('No orgId provided')

    this.log.info('REQUESTING SUBSCRIPTION MANAGE', { data: args })
    const result = await this.requests.ManageSubscription.request({
      _action,
      subscriptionId,
      priceId,
      orgId,
      customerId,
      coupon,
      quantity,
    })
    this.log.info('RESULT SUBSCRIPTION MANAGE', { data: result })

    return result.data
  }

  // handleSubscriptionUpdate = async (
  //   sub: Stripe.Subscription,
  // ): Promise<void> => {
  //   const customerId =
  //     typeof sub.customer === "object" ? sub.customer.id : sub.customer

  //   const { id: subscriptionId, items, status: subscriptionStatus } = sub
  //   const {
  //     id: subscriptionItemId,
  //     price: { id: priceId, product },
  //   } = items.data[0]

  //   const productId = typeof product === "string" ? product : product.id

  //   await this.saveCustomerInfo(customerId, {
  //     subscriptionId,
  //     subscriptionStatus,
  //     subscriptionItemId,
  //     priceId,
  //     productId,
  //   })

  //   this.log.debug(`stripe event`, { data: { sub } })
  //   return
  // }
}
