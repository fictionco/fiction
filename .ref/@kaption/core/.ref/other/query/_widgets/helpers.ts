import { sharedKeys } from '@kaption/types'
import { cap } from '@kaption/browser-utils/shared'
import type { DataMapType, TimeLineInterval } from './types'

export function isSessionDimension(dimension?: string): boolean {
  if (!dimension)
    return false
  return (sharedKeys as string[]).includes(dimension)
}
/**
 * Removes special prefix added on session sub queries to prevent conflicts
 */
export function removeSessionQueryPrefix(rows: Record<string, any>[]): Record<string, any>[] {
  return rows.map((r) => {
    const out: Record<string, any> = {}
    Object.entries(r).forEach(([k, v]) => {
      const newKey = k.replace('session_', '')
      out[newKey] = v
    })
    return out
  })
}
/**
 * helper function which infers keys and restricts values to ElementType
 * https://stackoverflow.com/questions/54598322/how-to-make-typescript-infer-the-keys-of-an-object-but-define-type-of-its-value
 */
export function mapTypeHelper<T>(et: {
  [K in keyof T]: DataMapType<keyof T>
}): { [K in keyof T]: DataMapType<keyof T> } {
  return et
}

export function formatDateTimeSelect({
  interval,
  timeZone,
  timeField = 'timestamp',
}: {
  interval: TimeLineInterval
  timeZone: string
  timeField?: 'timestamp' | 'session_timestamp'
}): string {
  let startOf = `toStartOf${cap(interval)}(${timeField}, '${timeZone}')`

  // week requires mode = 1 to set monday to be the start of the week
  if (interval === 'week')
    startOf = `toStartOf${cap(interval)}(${timeField}, 1, '${timeZone}')`

  return `formatDateTime(${startOf}, '%FT%T.000Z', 'UTC')`
}
