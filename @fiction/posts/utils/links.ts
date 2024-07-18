import type { Card } from '@fiction/site'
import type { Post } from '../post'

export function postEditLink(args: { post: Post }): string {
  const { post } = args
  return `/app/post-edit?postId=${post.postId}&_reload=1`
}

export function postLink(args: { card: Card, slug?: string }): string {
  const { card, slug } = args

  if (!slug) {
    return card.link(`/:viewId`)
  }

  return card.link(`/:viewId/${slug}`)
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
