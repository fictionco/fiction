import { Widget } from '@fiction/admin/dashboard/widget'
import { Query, vue } from '@fiction/core'
import type { PostsQuerySettings } from '../endpoint.js'
import { QueryManagePost } from '../endpoint.js'

export function getWidgets(service: PostsQuerySettings) {
  const query = new QueryManagePost({ ...service, key: 'posts' })
  const subscribers = new Widget({
    key: 'subscribers',
    query,
    title: 'Subscribers',
    description: 'New subscribers',
    el: vue.defineAsyncComponent<vue.Component>(() => import('./WidgetPosts.vue')),
    layoutHandling: 'chart',
  })

  const unsubscribes = new Widget({
    key: 'unsubscribes',
    query,
    title: 'Unsubscribes',
    description: 'People who have unsubscribed',
    el: vue.defineAsyncComponent<vue.Component>(() => import('./WidgetPosts.vue')),
    layoutHandling: 'chart',
  })

  return { subscribers, unsubscribes }
}
