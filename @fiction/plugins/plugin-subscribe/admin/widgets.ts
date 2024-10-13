import { AnalyticsWidget, Widget } from '@fiction/admin/dashboard/widget'

import { vue } from '@fiction/core'
import { type SubscriberEndpointSettings, SubscriptionAnalytics } from '../endpoint.js'

export function getWidgets(service: SubscriberEndpointSettings) {
  const query = new SubscriptionAnalytics({ ...service })

  const subscribers = new AnalyticsWidget({
    key: 'subscribers',
    title: 'Subscribers',
    description: 'New subscribers',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./ChartSubs.vue')),
    layoutHandling: 'chart',
    query,
    valueKey: 'subscriptions',
  })

  const unsubscribes = new AnalyticsWidget({
    key: 'unsubscribes',
    title: 'Unsubscribes',
    description: 'People who have unsubscribed',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./ChartSubs.vue')),
    layoutHandling: 'chart',
    query,
    valueKey: 'unsubscribes',
  })

  const cleaned = new AnalyticsWidget({
    key: 'cleaned',
    title: 'Cleaned',
    description: 'Bounced and dead emails',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./ChartSubs.vue')),
    layoutHandling: 'chart',
    query,
    valueKey: 'cleaned',
  })

  const subscriberIntro = new Widget({
    key: 'subscriberIntro',
    title: 'Subscriber Intro',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('@fiction/admin/dashboard/WidgetVideo.vue')),
  })

  return { subscribers, unsubscribes, cleaned, subscriberIntro }
}
