import type { Organization } from '@fiction/core'
import type * as StripeJS from '@stripe/stripe-js'
import type express from 'express'
import type { FictionStripe } from './index.js'
import { abort, dayjs, toLabel } from '@fiction/core'
import Stripe from 'stripe'

export type CheckoutQueryParams = {
  priceLookupKey?: string
  loginPath?: string
  customerId?: string
  orgId?: string
  trialPeriod?: string
  customerEmail?: string
}

export type CustomerStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
export type ProductInterval = 'month' | 'year'

export type StripeProductConfig = {
  key: string
  tier: number
}

export type RawCustomerData = {
  customer?: Stripe.Customer & { deleted?: boolean }
  subscriptions?: Stripe.Subscription[]
  org: Organization
}

export type CustomerData = {
  status: CustomerStatus
  tier: number
  plan?: {
    id: string
    name: string
    amount: number
    interval: ProductInterval
    key: string
  }
  currentPeriodEnd?: string
  cancelAt?: string
  isActive: boolean
  isTrialing: boolean
  trialEndAtIso?: string
  hasPastDue: boolean

  // Billing cycle
  cycleStartAtIso?: string
  cycleEndAtIso?: string
  percentComplete?: number
  daysUntilRenewal?: number
  isCanceled?: boolean // Derived from cancelAt

  // Payment method
  nextPaymentAmount?: number
  paymentMethod?: Stripe.PaymentMethod
} & RawCustomerData

export async function checkoutEndpointHandler(args: {
  fictionStripe: FictionStripe
  request: express.Request
  response: express.Response
}): Promise<void> {
  const { fictionStripe, request, response } = args
  const query = request.query as Record<string, string>
  const params = request.params as { action?: 'init' }

  const { action } = params

  if (!action) {
    fictionStripe.log.error('Invalid request', { action })
    response.status(400).send('Invalid request')
    return
  }

  try {
    if (action === 'init') {
      const { priceLookupKey, trialPeriod, orgId } = query as CheckoutQueryParams

      if (!priceLookupKey)
        throw abort('no priceLookupKey')

      if (!orgId)
        throw abort('no orgId')

      const r = await fictionStripe.queries.ManageCustomer.serve({ orgId, _action: 'retrieve' }, { server: true })

      const customerId = r.data?.customer?.id

      if (!customerId)
        throw abort('no customerId')

      const stripe = fictionStripe.getServerClient()

      const { successUrl, cancelUrl } = getCheckoutConfig({
        orgId,
        fictionStripe,
      })

      const trialPeriodNum = trialPeriod ? +trialPeriod : 0

      if (+trialPeriodNum > 14)
        throw new Error('trial error')

      const subscription_data = trialPeriodNum
        ? { description: `${trialPeriodNum} Days Free`, trial_period_days: +trialPeriodNum }
        : {}

      const priceId = await fictionStripe.getPriceByLookupKey(priceLookupKey)

      const details: Stripe.Checkout.SessionCreateParams = {
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        customer: customerId,
        subscription_data,
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
      }

      const session = await stripe.checkout.sessions.create(details)

      fictionStripe.log.info('creating checkout session', {
        data: {
          details,
          stripeMode: fictionStripe.stripeMode.value,
          publicKey: fictionStripe.publicKey.value,
          stripeRedirectUrl: session.url,
        },
      })

      if (session.url)
        response?.redirect(303, session.url)
    }
    else {
      throw abort('invalid action')
    }
  }
  catch (error) {
    const e = error as Error
    fictionStripe.log.error('endpoint threw an error', { error })
    response.status(400).send({ status: 'error', message: e.message }).end()
  }
}

export function getCheckoutConfig(args: { orgId: string, fictionStripe: FictionStripe }) {
  const { fictionStripe } = args
  const base = fictionStripe.settings.fictionApp.appUrl.value
  const successPathCallback = fictionStripe.settings.checkoutSuccessPathname
  const cancelPathCallback = fictionStripe.settings.checkoutCancelPathname

  const successPath = successPathCallback ? successPathCallback(args) : '/checkout-success'
  const cancelPath = cancelPathCallback ? cancelPathCallback(args) : '/checkout-cancel'

  const config = {
    successUrl: `${base}${successPath}`,
    cancelUrl: `${base}${cancelPath}`,
  }

  fictionStripe.log.info('checkout config', { data: config })

  return config
}

type ProcessCustomerDataArgs = {
  raw: RawCustomerData
  products: StripeProductConfig[]
}

export function processCustomerData(args: ProcessCustomerDataArgs): CustomerData {
  const { raw, products } = args
  const sub = raw.subscriptions?.[0]
  const price = sub?.items.data[0]?.price
  const priceKey = price?.lookup_key
  const productKey = priceKey ? priceKey.split('_')[0] : 'free'
  const productConfig = products.find(p => p.key === productKey) || products[0]
  const paymentMethod = raw.customer?.invoice_settings?.default_payment_method as Stripe.PaymentMethod

  const { current_period_end, current_period_start } = sub || {}

  return {
    ...raw,
    status: (sub?.status || 'incomplete') as CustomerStatus,
    tier: productConfig.tier,
    plan: price && {
      id: price.id,
      key: productKey,
      name: price.nickname || toLabel(productKey),
      amount: price.unit_amount || 0,
      interval: (price.recurring?.interval || 'month') as ProductInterval,
    },

    // Billing cycle info using UTC
    cycleStartAtIso: current_period_start ? dayjs.unix(current_period_start).utc().toISOString() : undefined,
    cycleEndAtIso: current_period_end ? dayjs.unix(current_period_end).utc().toISOString() : undefined,

    // Status flags
    isActive: sub?.status === 'active' || sub?.status === 'trialing',
    isTrialing: sub?.status === 'trialing',
    trialEndAtIso: sub?.trial_end ? dayjs.unix(sub.trial_end).utc().toISOString() : undefined,
    hasPastDue: sub?.status === 'past_due',
    isCanceled: !!sub?.cancel_at,
    paymentMethod,
  }
}

export async function getPortalUrl(args: { fictionStripe: FictionStripe, returnUrl?: string }): Promise<string> {
  const { fictionStripe, returnUrl } = args

  const portalSession = await fictionStripe.requests.PortalSession.projectRequest({ returnUrl })

  if (portalSession.status === 'success' && portalSession.data?.url) {
    return portalSession.data?.url
  }

  const customerDataResponse = await fictionStripe.requests.ManageCustomer.projectRequest({
    _action: 'retrieve',
  })
  const customerDetails = customerDataResponse.data
  const stripeCustomer = customerDetails?.customer

  let prefilledEmail = ''
  if (stripeCustomer && 'email' in stripeCustomer)
    prefilledEmail = `?prefilled_email=${encodeURIComponent(stripeCustomer.email || '')}`

  return `${fictionStripe.settings.customerPortalUrl}${prefilledEmail}`
}

export async function getCheckoutUrl(args: { fictionStripe: FictionStripe, query: CheckoutQueryParams }): Promise<string> {
  const { query, fictionStripe } = args

  const { loginPath } = query

  await fictionStripe.settings.fictionUser.userInitialized({ caller: 'getCheckoutUrl' })

  const u = fictionStripe.settings.fictionUser.activeUser.value

  let link

  if (u) {
    const baseUrl = fictionStripe.settings.fictionServer.serverUrl.value
    const url = new URL(`${baseUrl}/api/stripe-checkout/init`)

    query.orgId = fictionStripe.settings.fictionUser.activeOrgId.value || ':orgId'

    if (args)
      url.search = new URLSearchParams(query as Record<string, string>).toString()

    link = url.toString()
  }
  else if (typeof location !== 'undefined') {
    const redirect = encodeURIComponent(location.href)
    link = `${loginPath}?redirect=${redirect}`
  }

  return link || ''
}

export function getStripeServerClient(args: { fictionStripe: FictionStripe }): Stripe {
  const { fictionStripe } = args
  const key = fictionStripe.secretKey.value

  if (!key)
    throw new Error(`stripe getServerClient: secretKey not found (${fictionStripe.stripeMode.value})`)

  return new Stripe(key)
}

export async function getStripeBrowserClient(args: { fictionStripe: FictionStripe }): Promise<StripeJS.Stripe> {
  const { fictionStripe } = args

  const StripeJS = await import('@stripe/stripe-js')

  const publicKey = fictionStripe.publicKey.value
  if (!publicKey)
    throw new Error(`Stripe getBrowserClient: publicKey not found (${fictionStripe.stripeMode.value})`)

  const createdClient = await StripeJS.loadStripe(publicKey)

  if (!createdClient)
    throw new Error('no stripe client created')

  return createdClient
}
