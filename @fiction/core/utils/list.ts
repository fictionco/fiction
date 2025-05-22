import type { NavListItem } from '../schemas'
import type { IndexMeta, ListItem } from '../types'
import { toLabel, toSlug } from './casing'

export type PaginationInfo = {
  total: number
  hasNext: boolean
  hasPrev: boolean
  currentPageNo: number
  nextPageNo: number
  prevPageNo: number
  totalPages: number
  start: number
  end: number
} & IndexMeta

export function getPaginationInfo(indexMeta: IndexMeta): PaginationInfo {
  const { count = 0, limit = 10, offset = 0 } = indexMeta

  const totalPages = Math.ceil(count / limit) || 1
  const currentPageNo = Math.floor(offset / limit) + 1
  const hasNext = currentPageNo < totalPages
  const hasPrev = currentPageNo > 1
  const start = Math.min(offset + 1, count)
  const end = Math.min(offset + limit, count)
  const nextPageNo = hasNext ? currentPageNo + 1 : 0
  const prevPageNo = hasPrev ? currentPageNo - 1 : 0

  return {
    ...indexMeta,
    count,
    limit,
    offset,
    total: count,
    currentPageNo,
    hasNext,
    nextPageNo,
    hasPrev,
    prevPageNo,
    totalPages,
    start,
    end,
  }
}

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
      return { value: item, name: label, label }
    }

    const { name, value, label, description, desc } = item

    const formattedDescription = description ?? desc
    const formattedName = name ?? label ?? (value ? toLabel(value) : '')
    const formattedValue = value ?? (name ? toSlug(name, { replaceNumbers: false }) : '')
    const finalName = `${prefix}${formattedName}${formattedSuffix}`
    const formattedLabel = label ?? finalName

    return {
      ...item,
      name: finalName,
      value: formattedValue,
      description: formattedDescription,
      label: formattedLabel,
    }
  })
}

export function normList(
  list: (string | number | Partial<NavListItem> | undefined)[] | readonly (string | Partial<NavListItem> | undefined)[] = [],
  options: { prefix?: string, suffix?: string } = {},
): NavListItem[] {
  return normalizeList(list as (string | number | Partial<ListItem> | undefined)[], options) as NavListItem[]
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
