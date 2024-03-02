import type { NavItem } from '../types'

export function getNavComponentType(item: NavItem, fallback: 'button' | 'div' = 'div'): 'RouterLink' | 'div' | 'a' | 'button' {
  if (item.href?.startsWith('/') && !item.href.includes('load'))
    return 'RouterLink'
  else if (item.href)
    return 'a'
  else
    return fallback
}
