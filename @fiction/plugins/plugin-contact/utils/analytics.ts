import type { EndpointMeta, SyndicateStatus } from '@fiction/core'
import type { FictionContact, TableContactConfig } from '..'
import { t } from '../schema'

export async function getContactMetrics(args: { orgId: string, fictionContact: FictionContact }) {
  const { orgId, fictionContact } = args
  const db = fictionContact.settings.fictionDb.client()

  const counts = await db(t.contact)
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

export async function trackContactMetrics(args: {
  orgId: string
  fictionContact: FictionContact
  previousStatus?: SyndicateStatus
  contact?: TableContactConfig
}, _meta: EndpointMeta) {
  const { orgId, fictionContact, previousStatus, contact } = args
  const { status, email, userId } = contact || {}

  const analytics = fictionContact.settings.fictionAnalytics
  const metrics = await getContactMetrics({ orgId, fictionContact })

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
    analytics.track({ orgId, event: 'subscriptionTotalActive', value: metrics.totalSubscribed }),
    analytics.track({ orgId, event: 'subscriptionTotalUnsubscribed', value: metrics.totalUnsubscribed }),
  ])

  return metrics
}
