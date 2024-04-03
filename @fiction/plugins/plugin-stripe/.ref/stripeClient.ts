import {
  emitEvent,
  endpointRequest,
  objectId,
  setting,
  storeItem,
  stored,
  waitFor,
} from '@factor/api'
import type StripeNode from 'stripe'
import type {
  CustomerComposite,
  PlanInfo,
  ProductConfig,
  SubscriptionCustomerData,
  SubscriptionResult,
  UpdateSubscription,
} from './types'

/**
 * Used to prevent duplicate transactions
 * https://stripe.com/docs/api/idempotent_requests
 */
const idempotencyKey = objectId()

/**
 * Client stripe is added to global window
 */
declare global {
  interface Window {
    Stripe: stripe.Stripe
  }
}

export async function sendRequest<T>(method: string, params: EndpointParameters = {}): Promise<T> {
  return await endpointRequest<T>({
    id: 'pluginCheckout',
    method,
    params: { idempotencyKey, ...params },
  })
}

/**
 * Gets a coupon's details with its code
 */
export async function requestCoupon(params: {
  coupon: string
}): Promise<StripeNode.Coupon> {
  return await sendRequest<StripeNode.Coupon>('serverRetrieveCoupon', params)
}

export async function requestAllPlans(): Promise<PlanInfo[]> {
  if (stored('allPlans'))
    return stored('allPlans')

  const allPlans = await sendRequest<PlanInfo[]>('serverRetrieveAllPlans')

  storeItem('allPlans', allPlans)

  return allPlans
}

/**
 * Gets a composite of relevant customer information
 * @param customerId - stripe customer id
 */
export async function requestCustomerComposite(customerId: string): Promise<CustomerComposite> {
  const composite = await sendRequest<CustomerComposite>(
    'serverCustomerComposite',
    {
      customerId,
    },
  )

  storeItem('customerComposite', composite)

  return composite
}

export async function requestUpdateSubscription(options: UpdateSubscription): Promise<StripeNode.Subscription | undefined> {
  const result = await sendRequest<StripeNode.Subscription | undefined>(
    'serverUpdateSubscription',
    options as UpdateSubscription & EndpointParameters,
  )
  emitEvent('refresh-user')

  return result
}

export async function requestCustomer(user: FactorUser): Promise<StripeNode.Customer> {
  const customer = await sendRequest<StripeNode.Customer>(
    'serverRetrieveCustomer',
    {
      customerId: user.stripeCustomerId,
    },
  )

  storeItem('stripeCustomer', customer)

  return customer
}

export function getProductConfig(slug: string): ProductConfig | undefined {
  const products: ProductConfig[] = setting(`subscriptions.products`) ?? {}

  return products.find(product => product.slug === slug)
}

export function getPlanId(slug: string, interval: 'year' | 'month' = 'year'): string | undefined {
  const product = getProductConfig(slug)

  const plan = product?.plans.find(plan => plan.interval === interval)

  const env = process.env.NODE_ENV ?? 'production'
  return plan ? plan[env] : undefined
}

export async function requestPlanInfo(productKey: string, interval = 'year'): Promise<PlanInfo> {
  const id = getPlanId(productKey, interval as 'month' | 'year')

  const { plan, product } = await sendRequest<PlanInfo>('serverRetrievePlan', {
    id,
  })

  storeItem('planInfo', plan)
  storeItem('productInfo', product)

  return { plan, product }
}

export async function requestCreateSubscription(params: SubscriptionCustomerData): Promise<SubscriptionResult> {
  params.subscriptionPlanId = params.plan?.id

  if (!params.subscriptionPlanId)
    throw new Error('Missing subscription ID')

  emitEvent('refresh-user')

  return await sendRequest<SubscriptionResult>('createSubscription', params)
}

export async function requestPaymentMethodAction(params: {
  customerId: string
  paymentMethodId: string
  action: 'default' | 'delete' | 'setup'
}): Promise<StripeNode.SetupIntent | StripeNode.Customer> {
  const result = await sendRequest<
    StripeNode.SetupIntent | StripeNode.Customer
  >('serverPaymentMethodAction', params)

  emitEvent('refresh-user')

  return result
}

let __tries = 0
let __stripeClient: stripe.Stripe
export async function getStripeClient(): Promise<stripe.Stripe> {
  await waitFor(50)

  if (__stripeClient) {
    return __stripeClient
  }
  else if (window.Stripe) {
    const key = setting(`subscriptions.publishableKey.${process.env.NODE_ENV}`)

    __stripeClient = window.Stripe(key)

    return __stripeClient
  }
  else if (__tries < 5) {
    __tries++

    return await getStripeClient()
  }
  else {
    throw new Error('Couldn\'t get Stripe client')
  }
}
