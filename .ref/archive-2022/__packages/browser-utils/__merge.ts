import deepMergeUtility from 'deepmerge'

/**
 * Deep merge an array of objects into a single object
 *
 * @remarks
 * If two settings are arrays, then we have a special merge strategy
 * If the lower priority array has objects with _item or _ attribute,
 * then we merge with the higher priority array if it has object w same _item or _
 */
export function deepMerge<T>(items: (T | Partial<T> | undefined)[], options: { mergeArrays?: boolean } = {}): T {
  const mergeItems = items.filter(_ => _) as T[]

  const merged: T = deepMergeUtility.all(mergeItems, {
    arrayMerge: (lowerPriority: unknown[], higherPriority: unknown[]) => {
      if (options.mergeArrays)
        return [...higherPriority, ...lowerPriority]

      return higherPriority
    },
  })

  return merged
}
/**
 * merges all and concatenates arrays
 */
export function deepMergeAll<T>(items: (Partial<T> | undefined)[]): Record<string, any> {
  return deepMerge(items, { mergeArrays: true })
}
