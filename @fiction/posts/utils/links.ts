import type { Card } from '@fiction/site'
import type { Post } from '../post'

export function postEditLink(args: { post: Post }): string {
  const { post } = args
  return `/app/edit-post?postId=${post.postId}&_reload=1`
}

export function postLink(args: { card?: Card, slug?: string, basePath?: string }): string {
  const { card, slug, basePath = '/p' } = args

  if (!card) {
    return '/no-card-for-link'
  }

  return card.link(`${basePath}/${slug}`)
}

export function taxonomyLink(args: { taxonomy: 'tag' | 'category', term?: string }): string {
  const { taxonomy, term } = args

  const basePath = `/${taxonomy}`
  if (!term) {
    return basePath
  }
  return `${basePath}/${term}`
}

export function allPostsLink(args: { card: Card }): string {
  const { card } = args
  return card.link(`/:viewId`)
}

export function getPostPreviewRoute(args: { post: Post, card: Card, format: 'browser' | 'email' }) {
  const { post, card, format } = args
  const out = card?.link({ path: `/preview-post-${format}`, query: { postId: post.postId, format } })

  return out
}
