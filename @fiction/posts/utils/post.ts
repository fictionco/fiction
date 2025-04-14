import type { ComplexDataFilter, IndexMeta, PostHandlingObject } from '@fiction/core'
import type { FictionPosts, Post, TablePostConfig } from '@fiction/posts'
import type { Card, Site } from '@fiction/site'
import type { SiteContentPath } from '@fiction/site/load'

import type { WherePost } from '../endpoint'
import { getSiteContentPaths } from '@fiction/site/load'
import { manageSiteIndex } from '@fiction/site/utils/manage'
import { activeSiteDisplayUrl } from '@fiction/site/utils/site'

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

  const r = await fictionPosts.requests.ManagePost.request({ _action: 'get', orgId, where: { orgId, ...where } })

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

export type PostLocation = {
  url: string
  site: Site
  isCanonical?: boolean
}

export async function findPostLocations(args: { post: Post, fictionPosts: FictionPosts }): Promise<PostLocation[]> {
  const { post, fictionPosts } = args
  const fictionSites = fictionPosts.settings.fictionSites
  if (!post)
    return []

  // Get all sites for the organization
  const { sites } = await manageSiteIndex({ fictionSites, params: { _action: 'list' } })

  const allLocations = await Promise.all(sites.map(async (site) => {
    // Get all content paths for this site
    const contentPaths = await getSiteContentPaths(site)

    // Filter paths that match this post
    const postPaths = contentPaths.filter(path => path.type === 'post' && path.meta?.postId === post.postId)

    const siteUrl = activeSiteDisplayUrl(site, { mode: 'display' }).value

    // Format the results
    return postPaths.map((pathDetails) => {
      const url = new URL(pathDetails.path, siteUrl).toString()
      return { url, site }
    })
  }))

  // Flatten the results
  const locations = allLocations.flat()

  return locations
}
