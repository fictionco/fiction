import type { NavItem } from '../types/index.js'

export function getNavComponentType(item: NavItem, fallback: 'button' | 'div' | 'span' = 'div'): 'RouterLink' | 'div' | 'a' | 'button' | 'span' {
  if (item.href?.startsWith('/') && !item.href.includes('_reload'))
    return 'RouterLink'
  else if (item.href)
    return 'a'
  else
    return fallback
}

export function pathIsHref(href: string | undefined): boolean {
  return !!(href?.startsWith('http') || href?.includes('_reload') || href?.includes(':'))
}
