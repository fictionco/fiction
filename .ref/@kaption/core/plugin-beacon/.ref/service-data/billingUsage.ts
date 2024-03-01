import type { Organization } from '@kaption/engine'
import { getDb } from '@factor/engine/db'
import Stripe from 'stripe'
import dayjs from 'dayjs'
import { logger } from '@factor/api'
import { AppTable } from '@kaption/engine/typesProject'
import { getCache, getKeys } from './cache'

export interface UsageReport {
  organizationId: string
  timestamp: string
  sessions: number
  events: number
  replays: number
}

export function getStripe(env: 'production' | 'development'): Stripe | undefined {
  const keyName
    = env === 'production' ? 'STRIPE_SECRET_KEY' : 'STRIPE_SECRET_KEY_TEST'

  const STRIPE_SECRET_KEY = process.env[keyName]

  if (STRIPE_SECRET_KEY) {
    return new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' })
  }
  else {
    if (process.env.NODE_ENV === env) {
      logger.log({
        level: 'error',
        description: `STRIPE CONFIG: ${keyName} missing for ${env}`,
      })
    }
  }
}

/**
 * Get usage added since last report (from redis)
 */
async function getUsageFromRedis(org: Organization): Promise<UsageReport> {
  const cache = await getCache()

  const keys = getKeys(org.organizationId)

  const results = await cache
    .multi()
    .get(keys.session.usage)
    .get(keys.event.usage)
    .get(keys.replay.usage)
    .exec()

  const [sessionUsage, eventUsage, replayUsage] = results.map(
    ([err, result]) => +result || 0,
  )
  return { sessionUsage, eventUsage, replayUsage }
}

function getCurrentHour(): dayjs.Dayjs {
  return dayjs().startOf('hour')
}
function getPriorHour(): dayjs.Dayjs {
  return dayjs(getCurrentHour()).subtract(1, 'hour')
}
/**
 * Reset usage counters in redis
 */
async function resetUsageCounters(org: Organization): Promise<void> {
  const cache = await getCache()

  const keys = getKeys(org.organizationId)

  await cache
    .multi()
    .set(keys.session.usage, 0)
    .set(keys.event.usage, 0)
    .set(keys.replay.usage, 0)
    .set(keys.lastReported, getCurrentHour().toISOString())
    .exec()
}

async function saveUsageToDb(org: Organization): Promise<void> {
  const { sessionUsage, eventUsage, replayUsage } = await getUsageFromRedis(org)
  const db = await getDb()
  await db
    .insert({
      organizationId: org.organizationId,
      timestamp: getPriorHour().toISOString(),
      sessions: sessionUsage,
      events: eventUsage,
      replays: replayUsage,
      env: env(),
    })
    .into(AppTable.Usage)
}

function getCustomerConfig(org: Organization): {
  env: 'production' | 'development'
  si?: string
  customerId?: string
}[] {
  return [
    {
      env: 'production',
      si: org.customer?.subscriptionItemId,
      customerId: org.customerId,
    },
    {
      env: 'development',
      si: org.customerTest?.subscriptionItemId,
      customerId: org.customerIdTest,
    },
  ]
}

export async function reportOrganizationUsage(org: Organization): Promise<void> {
  const cache = await getCache()
  const keys = getKeys(org.organizationId)
  const lastReportedValue = await cache.get(keys.lastReported)

  const { sessionUsage, eventUsage, replayUsage } = await getUsageFromRedis(org)

  if (lastReportedValue === getCurrentHour().toISOString())
    return

  if (sessionUsage === 0 && eventUsage === 0 && replayUsage === 0)
    return

  try {
    await cache.set(keys.lastReported, getCurrentHour().toISOString())

    const subs = getCustomerConfig(org)

    /**
     * Report usage to stripe
     */
    const _promises = subs.map(
      async ({ env, customerId }): Promise<Stripe.UsageRecord | void> => {
        if (!customerId)
          return

        const stripeInstance = getStripe(env as 'production' | 'development')

        if (!stripeInstance) {
          logger.log({
            level: 'info',
            context: 'usage',
            description: `could not get stripe for ${env}`,
          })
          return
        }

        logger.log({
          level: 'info',
          context: 'usage',
          description: `filing usage report ${org.organizationName}: ${sessionUsage} sessions`,
          data: {
            customerId,
            env,
            sessionUsage,
            eventUsage,
            replayUsage,
            keys,
          },
        })

        let billedQuantity = -1

        const subs: Stripe.ApiList<Stripe.Subscription>
          = await stripeInstance.subscriptions.list({ customer: customerId })

        if (!subs.data) {
          return logger.log({
            level: 'error',
            context: 'usage',
            description: `no subscriptions for ${customerId}`,
            data: subs,
          })
        }

        const subscriptionItems = subs.data.flatMap(sub => sub.items.data)
        const si
          = subscriptionItems.length > 0 ? subscriptionItems[0].id : undefined

        // The user doesn't have a stripe subscription so don't report
        let usageRecord: Stripe.UsageRecord | undefined
        if (si) {
          try {
            usageRecord
              = await stripeInstance.subscriptionItems.createUsageRecord(
                si,
                {
                  quantity: sessionUsage,
                  timestamp: getPriorHour().unix(),
                },
                {
                  idempotencyKey: si + getPriorHour().format('YYYY-MM-DD-HH'),
                },
              )
          }
          catch (error: any) {
            const e = error as Error
            if (e.message.includes('idempotent')) {
              logger.log({
                level: 'debug',
                context: 'usage',
                description: `duplicated idempotent request made ${e.message}`,
              })
            }
            else {
              logger.log({
                level: 'error',
                description: `could not create usage record`,
                data: error,
              })
            }
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
            logger.log({
              level: 'error',
              description: 'no upcoming invoice',
              data: error,
            })
          }

          logger.log({
            level: 'info',
            context: 'usage',
            description: `report '${env}' usage: ${sessionUsage}, total: ${billedQuantity}`,
          })
        }
        else {
          logger.log({
            level: 'warn',
            context: 'usage',
            description: `no stripe subscription for ${org.organizationName}`,
            data: subs,
          })
        }

        return usageRecord
      },
    )

    await Promise.all(_promises)

    await saveUsageToDb(org)

    await resetUsageCounters(org)

    logger.log({ level: 'info', description: `report usage ended` })
  }
  catch (error) {
    logger.log({
      level: 'error',
      description: 'could not report usage',
      data: error,
    })
  }
}

/**
 * Run usage reports for all valid organizations
 */
export async function reportUsage(): Promise<void> {
  const db = await getDb()
  const organizations = await db
    .select<Organization[]>('*')
    .from(AppTable.Organizations)
    .whereNotNull('customerId')
    .orWhereNotNull('customerIdTest')

  await Promise.all(organizations.map(org => reportOrganizationUsage(org)))
}
