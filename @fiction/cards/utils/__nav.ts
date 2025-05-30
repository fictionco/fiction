import type { FictionRouter, FictionUser, NavListItem } from '@fiction/core'
import { shortId } from '@fiction/core'

export function processNavItems<T extends NavListItem = NavListItem>(args: {
  fictionUser: FictionUser
  fictionRouter?: FictionRouter
  items: T[]
  basePathPrefix?: string
}): T[] {
  const { items, basePathPrefix, fictionUser, fictionRouter } = args
  const out = items.map((item) => {
    return { ...item, isActive: item.href === fictionRouter?.current.value.path }
  })

  return out
}
