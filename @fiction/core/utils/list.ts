import type { ListItem } from '../types'
import { toLabel, toSlug } from './casing'

export function normalizeList(
  list: (string | number | Partial<ListItem> | undefined)[] | readonly (string | Partial<ListItem> | undefined)[] = [],
  options: { prefix?: string, suffix?: string } = {},
): ListItem[] {
  if (!Array.isArray(list))
    return []

  const { prefix = '', suffix = '' } = options
  const formattedSuffix = suffix || ''

  return list.filter(item => item !== undefined).map((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      const label = `${prefix}${toLabel(item)}${formattedSuffix}`
      return { value: item, name: label }
    }

    const { name = '', value = '' } = item as Partial<ListItem>

    const formattedName = name || (value ? toLabel(value) : '')
    const formattedValue = value || (name ? toSlug(name, { replaceNumbers: false }) : '')
    const finalName = `${prefix}${formattedName}${formattedSuffix}`

    return { ...item, name: finalName, value: formattedValue }
  })
}

// Sort objects in an array by a priority value that defaults to 100
export function sortPriority<T extends { priority?: number }[]>(arr: T, options?: { centerNumber?: number }): T {
  const { centerNumber = 0 } = options || {}

  if (!arr || arr.length === 0)
    return arr

  return arr.sort((a, b) => {
    const ap = a.priority || centerNumber
    const bp = b.priority || centerNumber

    let result = 0

    if (ap < bp)
      result = -1
    else if (ap > bp)
      result = 1

    return result
  })
}
