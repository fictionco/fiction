import type { FictionRouter, FictionUser, NavItem } from '@fiction/core'

export function processNavItems<T extends NavItem = NavItem>(args: {
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  items: T[]
  basePathPrefix: string
}): T[] {
  const { items, basePathPrefix, fictionUser, fictionRouter } = args
  const loggedIn = fictionUser.activeUser.value !== undefined
  const currentPath = fictionRouter.current.value.path
  return items.map((item, index) => {
    const isHidden = !!(item.authState === 'loggedIn' && !loggedIn || item.authState === 'loggedOut' && loggedIn)
    return {
      ...item,
      isActive: item.href === currentPath,
      isHidden,
      basePath: `${basePathPrefix}.${index}`,
      items: item.items
        ? processNavItems({
          fictionUser,
          fictionRouter,
          items: item.items,
          basePathPrefix: `${basePathPrefix}.${index}.items`,
        })
        : undefined,
    }
  })
}
