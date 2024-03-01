import { getDb } from '@factor/api/engine/db'
import { logger } from '@factor/api'
import type { OrganizationCustomerData } from '@kaption/core'
import { AppTable } from '@kaption/core'
import type { StripeOptions } from '@factor/plugin-stripe'
import { stripeEnv } from '@factor/plugin-stripe'
import type stripe from 'stripe'

function isProd(): boolean {
  return stripeEnv() === 'production'
}
/**
 * Saves a customers information by customer ID into the organization table
 * Using a different key based on ENV
 */
async function saveCustomerInfo(customerId: string, data: Partial<OrganizationCustomerData>): Promise<void> {
  const db = await getDb()

  const customerField = isProd() ? 'customer' : 'customer_test'

  const customerMerge = db.raw(
    `coalesce(${customerField}::jsonb, '{}'::jsonb) || ?::jsonb`,
    JSON.stringify(data),
  )

  const save = isProd()
    ? { customer: customerMerge }
    : { customerTest: customerMerge }

  const where = isProd() ? { customerId } : { customerIdTest: customerId }

  const org = await db
    .update(save)
    .from(AppTable.Organizations)
    .where(where)
    .returning('*')

  logger.log({
    level: 'info',
    context: 'saveCustomerInfo',
    description: `added customer id to org`,
    data: { org },
  })
}

async function handleCustomerCreated({
  customer,
  id,
}: {
  customer: stripe.Customer
  id: string
}): Promise<void> {
  const customerId = customer.id
  const db = await getDb()
  const save = isProd() ? { customerId } : { customerIdTest: customerId }

  await db
    .update(save)
    .from(AppTable.Organizations)
    .where({ organizationId: id })

  await saveCustomerInfo(customerId, { customerId })
}

async function handleSubscriptionUpdate(sub: stripe.Subscription): Promise<void> {
  const customerId
    = typeof sub.customer === 'object' ? sub.customer.id : sub.customer

  const { id: subscriptionId, items, status: subscriptionStatus } = sub
  const {
    id: subscriptionItemId,
    price: { id: priceId, product },
  } = items.data[0]

  const productId = typeof product === 'string' ? product : product.id

  await saveCustomerInfo(customerId, {
    subscriptionId,
    subscriptionStatus,
    subscriptionItemId,
    priceId,
    productId,
  })

  logger.log({
    level: 'debug',
    context: 'billing',
    description: `stripe event`,
    data: { sub },
  })
}

function log(event: stripe.Event): void {
  logger.log({
    level: 'debug',
    context: 'billing',
    description: `stripe event: ${event.object}`,
    data: { event },
  })
}

export function stripeServerConfig(): StripeOptions {
  return {
    hooks: {
      // beforeCreateSubscription: (args): Promise<CreateSubscriptionArgs> =>
      //   refineSubscriptionParams(args),
      onCustomerCreated: (data): Promise<void> => handleCustomerCreated(data),
      onSubscriptionUpdate: (sub: stripe.Subscription): Promise<void> => {
        return handleSubscriptionUpdate(sub)
      },
    },
  }
}
