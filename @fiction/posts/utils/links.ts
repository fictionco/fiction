import type { Organization } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { Post } from '../post'

export function postEditLink(args: { post: Post }): string {
  const { post } = args
  return `/app/edit-post?postId=${post.postId}&_reload=1`
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

export function getPostPreviewRoute(args: {
  post: Post
  card: Card
  format: 'browser' | 'email'
  org?: Organization
}) {
  const { post, card, format, org } = args

  if (format === 'email') {
    return card.link({ path: '/preview-post-email', query: { postId: post.postId, format } })
  }
  if (format === 'browser') {
    const slug = post.slug.value
    const handle = org?.handle

    const origin = card.site?.fictionSites.getOrigin({ subDomain: handle })
    return `${origin}${post.href.value}?preview=true&format=${format}&slug=${slug}`
  }
}
