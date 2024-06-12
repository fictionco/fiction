import { diff } from 'deep-object-diff'

export function shouldUpdateChart(newObject?: Record<string, unknown>, oldObject?: Record<string, unknown>): boolean {
  if (!newObject)
    return false
  else if (newObject && !oldObject)
    return true

  const diffResult = diff(oldObject || {}, newObject || {})

  if (Object.keys(diffResult).length === 0)
    return false

  return true
}
