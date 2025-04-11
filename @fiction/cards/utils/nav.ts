import type { FictionRouter, FictionUser, NavListItem } from '@fiction/core'
import { shortId } from '@fiction/core'

export function processNavItems<T extends NavListItem = NavListItem>(args: {
  fictionUser: FictionUser
  fictionRouter?: FictionRouter
  items: T[]
  basePathPrefix?: string
}): T[] {
  const { items, basePathPrefix, fictionUser, fictionRouter } = args
  const loggedIn = fictionUser.activeUser.value !== undefined
  const current = fictionRouter?.current.value

  const currentPath = current?.fullPath
  const out = items.map((item, index) => {
    const isHidden = !!((item.onAuthState === 'loggedIn' && !loggedIn) || (item.onAuthState === 'loggedOut' && loggedIn))
    const isActive = item.href === currentPath

    const basePath = basePathPrefix ? `${basePathPrefix}.${index}` : undefined

    if (isHidden)
      return undefined

    return {
      ...item,
      isActive,
      isHidden,
      basePath,
      id: shortId(), // Used to track which has dropdown open
      list: {
        ...item.list,
        items: item.list?.items
          ? processNavItems({
              fictionUser,
              fictionRouter,
              items: item.list.items,
              basePathPrefix: `${basePath}.list.items`,
            })
          : undefined,
      },
    }
  }).filter(Boolean) as T[]

  return out
}
