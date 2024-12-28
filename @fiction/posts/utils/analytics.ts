import type { EndpointMeta } from '@fiction/core'
import type { FictionPosts, TablePostConfig } from '..'
import { getObjectWordCount } from '@fiction/core/utils/wordCount'
import { t } from '../schema'

export async function updatePostWordCount(args: { orgId: string, post?: TablePostConfig, fictionPosts: FictionPosts }) {
  const { orgId, post, fictionPosts } = args

  if (post) {
    const db = fictionPosts.settings.fictionDb.client()
    const postId = post.postId

    const wordCount = getObjectWordCount(post)

    if (wordCount !== post.wordCount) {
      await db(t.posts)
        .where({ postId, orgId })
        .update({ wordCount })

      post.wordCount = wordCount

      console.warn('UPDATE WORD COUNT', wordCount)
    }
  }

  return post
}

export async function getPostMetrics(args: { orgId: string, fictionPosts: FictionPosts }) {
  const { orgId, fictionPosts } = args
  const db = fictionPosts.settings.fictionDb.client()

  // Query to get totals from pages table
  const result = await db(t.posts)
    .where({ orgId })
    .select<{ totalWords: string, totalPostsCount: string }[]>(
      db.raw('COALESCE(SUM(word_count), 0)::integer as total_words'),
      db.raw('COUNT(post_id)::integer as total_posts_count'),
    )
    .first()

  return {
    totalWords: Number(result?.totalWords || 0),
    totalPostsCount: Number(result?.totalPostsCount || 0),
  }
}

export async function trackPostMetrics(args: {
  orgId: string
  status?: 'published' | 'all'
  fictionPosts: FictionPosts
  post?: TablePostConfig
}, _meta: EndpointMeta): Promise<ReturnType<typeof getPostMetrics>> {
  const { orgId, fictionPosts, post } = args

  if (post) {
    await updatePostWordCount(args)
  }

  const metrics = await getPostMetrics({ orgId, fictionPosts })

  await Promise.all([
    fictionPosts.settings.fictionAnalytics.track({ orgId, event: 'contentTotalWordsPosts', value: metrics.totalWords }),
    fictionPosts.settings.fictionAnalytics.track({ orgId, event: 'contentTotalPosts', value: metrics.totalPostsCount }),
  ])

  return metrics
}
