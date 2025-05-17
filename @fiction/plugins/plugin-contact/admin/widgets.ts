import type { ContactEndpointSettings } from '../endpoint.js'

import { vue } from '@fiction/core'
import { SubscriptionAnalytics } from '../endpoint.js'

export function getWidgets(service: ContactEndpointSettings) {
  const query = new SubscriptionAnalytics({ ...service })

  const subscribers = {
    key: 'subscribers',
    title: 'Subscribers',
    description: 'New subscribers',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./ChartSubs.vue')),
    layoutHandling: 'chart',
    query,
    valueKey: 'subscriptions',
  }

  const unsubscribes = {
    key: 'unsubscribes',
    title: 'Unsubscribes',
    description: 'People who have unsubscribed',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./ChartSubs.vue')),
    layoutHandling: 'chart',
    query,
    valueKey: 'unsubscribes',
  }

  const cleaned = {
    key: 'cleaned',
    title: 'Cleaned',
    description: 'Bounced and dead emails',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./ChartSubs.vue')),
    query,
    valueKey: 'cleaned',
  }

  return { subscribers, unsubscribes, cleaned }
}
