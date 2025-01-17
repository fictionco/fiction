import type { PostHandlingObject } from '@fiction/core'
import type { FictionPosts, Post } from '@fiction/posts'
import type { Card, Site } from '@fiction/site'
import type { SiteContentPath } from '@fiction/site/load'
import { loadPosts } from '../utils/post'

export function getNextPost(args: { single?: Post, posts?: Post[] }) {
  const { single, posts = [] } = args
  if (!single)
    return undefined

  const index = posts.findIndex(p => p.slug.value === single.slug.value)
  if (index === -1)
    return undefined

  return posts[index + 1] || posts[index - 1] || undefined
}

export async function getPostPaths(args: {
  site: Site
  card: Card
  viewPath: string
  posts: PostHandlingObject
}): Promise<SiteContentPath[]> {
  const { site, viewPath, posts } = args
  const { fictionPosts } = site.fictionSites.fictionEnv.getService<{ fictionPosts: FictionPosts }>()

  const result = await loadPosts({
    fictionPosts,
    ...args,
    postConfig: posts,
    indexMeta: { limit: 1000 },
  })

  return result.posts.map(post => ({
    type: 'post',
    path: `/${viewPath}/${post.slug}`,
  }))
}
