import type { EndpointMeta, SyndicateStatus } from '@fiction/core'
import type { FictionSubscribe, TableSubscribeConfig } from '..'
import { t } from '../schema'

export async function getSubscriberMetrics(args: { orgId: string, fictionSubscribe: FictionSubscribe }) {
  const { orgId, fictionSubscribe } = args
  const db = fictionSubscribe.settings.fictionDb.client()

  const counts = await db(t.subscribe)
    .where({ orgId })
    .select('status')
    .count('* as count')
    .groupBy('status')

  const statusCounts = counts.reduce((acc, { status, count }) => ({
    ...acc,
    [status]: Number(count),
  }), { active: 0, unsubscribed: 0, bounced: 0 })

  return {
    totalSubscribed: statusCounts.active as number,
    totalUnsubscribed: statusCounts.unsubscribed as number,
    totalCleaned: statusCounts.bounced as number,
  }
}

export async function trackSubscriberMetrics(args: {
  orgId: string
  fictionSubscribe: FictionSubscribe
  previousStatus?: SyndicateStatus
  subscribe?: TableSubscribeConfig
}, _meta: EndpointMeta) {
  const { orgId, fictionSubscribe, previousStatus, subscribe } = args
  const { status, email, userId } = subscribe || {}

  const analytics = fictionSubscribe.settings.fictionAnalytics
  const metrics = await getSubscriberMetrics({ orgId, fictionSubscribe })

  if (status && status !== previousStatus) {
    const statusEvents = {
      active: 'subscriptionActive',
      unsubscribed: 'subscriptionUnsubscribed',
      cleaned: 'subscriptionCleaned',
      pending: 'subscriptionPending',
    } as const

    const event = statusEvents[status as keyof typeof statusEvents]
    if (event) {
      await analytics.track({ orgId, event, email: email || '', userId: userId || '' })
    }
  }

  await Promise.all([
    analytics.track({ orgId, event: 'subscriptionTotalUnsubscribed', value: metrics.totalSubscribed }),
    analytics.track({ orgId, event: 'subscriptionTotalUnsubscribed', value: metrics.totalUnsubscribed }),
  ])

  return metrics
}
