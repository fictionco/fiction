import type { ComplexDataFilter, IndexMeta } from '@fiction/core'
import type { FictionPosts, PostHandlingObject, TablePostConfig } from '@fiction/posts'
import type { Card, Site } from '@fiction/site'
import type { SiteContentPath } from '@fiction/site/load'

import type { WherePost } from '../endpoint'

export type LoadPostsResult = {
  posts: TablePostConfig[]
  indexMeta: IndexMeta
  singlePost?: TablePostConfig
  nextPost?: TablePostConfig
}

export type LoadPostsConfig = {
  fictionPosts?: FictionPosts
  site?: Site
  indexMeta?: IndexMeta
}

export async function getPost(args: { orgId: string, where: WherePost, fictionPosts: FictionPosts }) {
  const { orgId, where, fictionPosts } = args

  const r = await fictionPosts.requests.ManagePost.request({ _action: 'get', where: { orgId, ...where } })

  return r.data || []
}

export async function getPostIndex(args: {
  orgId: string
  fictionPosts: FictionPosts
  limit?: number
  offset?: number
  filters?: ComplexDataFilter[]
  caller: string
}) {
  const { orgId, limit = 20, offset, caller = 'unknown', filters = [], fictionPosts } = args

  const r = await fictionPosts.requests.ManagePost.request({ _action: 'list', where: { orgId }, limit, offset, filters }, { caller: `getPostIndex-${caller}` })

  return {
    posts: r.data || [],
    indexMeta: r.indexMeta,
  }
}

/**
 * Load posts based on configuration, handles both local and global post loading
 */
export async function loadPosts(config: LoadPostsConfig): Promise<LoadPostsResult> {
  const { fictionPosts, site } = config

  const indexMeta = config.indexMeta || { offset: 0, limit: 12, count: 0 }

  // Default result structure
  const result: LoadPostsResult = { posts: [], indexMeta }

  const orgId = site?.settings.orgId

  if (!fictionPosts || !site || !orgId) {
    console.error('Fiction posts, orgId, site not provided')
    return result
  }

  try {
    const indexArgs = {
      site,
      limit: indexMeta.limit,
      offset: indexMeta.offset,
      orgId,
      caller: 'PostListCard',
      filters: indexMeta.filters,
      fictionPosts,
    }

    const response = await getPostIndex(indexArgs)

    return {
      posts: response?.posts || [],
      indexMeta: { ...indexMeta, ...(response?.indexMeta || {}) },
    }
  }
  catch (error) {
    console.error('Error loading posts:', error)
    return result
  }
}

export async function getPostPaths(args: {
  site: Site
  card: Card
  posts: PostHandlingObject
}): Promise<SiteContentPath[]> {
  const { site, posts } = args
  const { fictionPosts } = site.fictionSites.fictionEnv.getService<{ fictionPosts: FictionPosts }>()

  const result = await loadPosts({
    fictionPosts,
    ...args,
    indexMeta: { limit: 1000 },
  })

  return result.posts.map(post => ({
    type: 'post',
    path: `/p/${post.slug}`,
  }))
}
