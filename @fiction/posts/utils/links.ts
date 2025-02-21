import type { Card } from '@fiction/site'
import type { Post } from '../post'

export function postEditLink(args: { post: Post }): string {
  const { post } = args
  return `/app/edit-post?postId=${post.postId}&_reload=1`
}

export function postLink(args: { card?: Card, slug?: string, viewSlug?: string }): string {
  const { card, slug, viewSlug } = args

  const routeBasePath = viewSlug ? `/${viewSlug}` : '/:viewId'

  if (!card) {
    return '/no-card-for-link'
  }

  if (!slug) {
    return card.link(routeBasePath)
  }

  return card.link(`${routeBasePath}/${slug}`)
}

export function taxonomyLink(args: { card: Card, taxonomy: 'tag' | 'category', term?: string }): string {
  const { card, taxonomy, term } = args

  if (!term) {
    return card.link(`/:viewId`)
  }

  return card.link(`/:viewId?${taxonomy}=${term}`)
}

export function allPostsLink(args: { card: Card }): string {
  const { card } = args
  return card.link(`/:viewId`)
}

export function getPostPreviewRoute(args: { post: Post, card: Card }) {
  const { post, card } = args
  return card?.link({ path: `/preview-post/${post.postId}` })
}
