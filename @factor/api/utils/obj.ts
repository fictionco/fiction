import deepMergeUtility from 'deepmerge'
import type { PriorityItem } from '../types'
import { sortPriority } from './utils'

export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  // Create a shallow copy of the object
  const copy = { ...obj }
  // Remove each key in keys from the copy
  keys.forEach(key => delete copy[key])
  return copy
}

export function removeUndefined<T>(
  value: T,
  options: { removeNull?: boolean } = {},
): T {
  const { removeNull = false } = options // Destructure for convenience

  if (Array.isArray(value)) {
    return value.filter(item => item !== undefined && (!removeNull || item !== null)) as T
  }
  else if (typeof value === 'object' && value !== null) {
    const cleanedObject: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined && (!removeNull || val !== null))
        cleanedObject[key] = removeUndefined(val, options)
    }
    return cleanedObject as T
  }
  else {
    return value
  }
}

export function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null)
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

interface RefineFunction<T, U> {
  (param: { value: T, key?: string | number }): U
}

export function parseObject<T, U>(args: { obj: T, onValue: RefineFunction<unknown, U> }): T {
  const parseValue = <V>(value: V, key?: string | number): any => {
    if (Array.isArray(value)) {
      return value.map((v, i) => parseValue(v, i))
    }
    else if (value instanceof Date || value instanceof RegExp) {
      return args.onValue({ value, key })
    }
    else if (value && typeof value === 'object') {
      const refinedObject: Record<string, any> = {}
      Object.entries(value).forEach(([objKey, val]) => {
        refinedObject[objKey] = parseValue(val, objKey)
      })
      return refinedObject
    }
    return args.onValue({ value, key })
  }

  return parseValue(args.obj) as T
}

/**
 * gets or sets a nested property in an object
 */
export function setNested<T extends Record<string, any> = Record<string, any>>(args: {
  data?: T
  path?: string
  value?: unknown
}): T {
  const { data = {}, path, value } = args

  if (!path)
    return (value ?? data) as T

  const clone = JSON.parse(JSON.stringify(data)) as Record<string, any>
  const keys = path.split('.')
  let current = clone

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    current[key] = current[key] || {}
    current = current[key]
  }

  const lastKey = keys[keys.length - 1]

  if (value === undefined && !Object.prototype.hasOwnProperty.call(current, lastKey))
    return clone as T

  current[lastKey] = value
  return clone as T
}

export function getNested<T = unknown>(args: {
  data?: Record<string, any>
  path?: string
}): T {
  const { data = {}, path } = args

  if (!path)
    return data as T

  const clone = JSON.parse(JSON.stringify(data)) as Record<string, any>
  const keys = path.split('.')
  let current = clone

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    current[key] = current[key] || {}
    current = current[key]
  }

  const lastKey = keys[keys.length - 1]

  return current[lastKey]
}

/**
 * finds a value in an object by property name (first)
 */
export function findValueByKey(obj: Record<string, any> | any[] | undefined | unknown, keyToFind: string): any {
  if (!obj || !keyToFind || typeof obj !== 'object')
    return undefined

  const o = obj as Record<string, any>

  if (Array.isArray(o)) {
    for (const item of o) {
      const found = findValueByKey(item, keyToFind)
      if (found !== undefined)
        return found
    }
  }
  else if (o && typeof o === 'object') {
    if (Object.prototype.hasOwnProperty.call(o, keyToFind))
      return o[keyToFind]
    for (const key in o) {
      if (Object.prototype.hasOwnProperty.call(o, key)) {
        const found = findValueByKey(o[key], keyToFind)
        if (found !== undefined)
          return found
      }
    }
  }
}

/**
 * Deep merge an array of objects into a single object
 *
 * @remarks
 * If two settings are arrays, then we have a special merge strategy
 * If the lower priority array has objects with _item or _ attribute,
 * then we merge with the higher priority array if it has object w same _item or _
 */
export function deepMerge<T extends Record<string, any>>(items: (T | Partial<T> | undefined)[], options: {
  mergeArrays?: boolean
  isMergeableObject?: (o: any) => boolean
  plainOnly?: boolean
} = {}): T {
  const mergeItems = items.filter(Boolean) as T[]

  const mergeOptions: deepMergeUtility.Options = {
    arrayMerge: (lowerPriority: unknown[], higherPriority: unknown[]) => {
      if (options.mergeArrays)
        return [...lowerPriority, ...higherPriority]

      return higherPriority
    },
  }

  if (options.plainOnly)
    mergeOptions.isMergeableObject = isPlainObject
  else if (options.isMergeableObject)
    mergeOptions.isMergeableObject = options.isMergeableObject

  const merged: T = deepMergeUtility.all(mergeItems, mergeOptions) as T

  return merged
}
/**
 * merges all and concatenates arrays
 */
export function deepMergeAll<T extends Record<string, any>>(items: (Partial<T> | undefined)[]): T {
  const i = items.filter(Boolean) as T[]

  return deepMerge<T>(i, { mergeArrays: true })
}

/**
 * Merges an array of objects, but first sorts them by priority attr
 * @param arr - array of objects w priority key
 */
export function sortMerge(arr: PriorityItem[]): Record<string, any> {
  return deepMerge(sortPriority(arr))
}
