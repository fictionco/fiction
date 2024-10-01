import type { PostsQuerySettings } from '../endpoint.js'
import { AnalyticsWidget } from '@fiction/admin/dashboard/widget'
import { vue } from '@fiction/core'
import { QueryManagePost } from '../endpoint.js'

export function getWidgets(service: PostsQuerySettings) {
  const query = new QueryManagePost({ ...service, key: 'posts' })
  const recentPosts = new AnalyticsWidget({
    key: 'recentPosts',
    query,
    title: 'Recent Posts',
    description: 'Your latest posts',
    el: vue.defineAsyncComponent<vue.Component>(async () => import('./WidgetPosts.vue')),
    layoutHandling: 'chart',
  })

  return { recentPosts }
}
