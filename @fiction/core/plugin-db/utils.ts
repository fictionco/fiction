import type { FictionDb } from '.'
import { z } from 'zod'
import { type EndpointMeta, removeUndefined } from '../utils'

type ScenarioType = 'insert' | 'update' | 'internal' | 'return'

export function dbPrep<T>(args: {
  type: ScenarioType
  fields: T
  table: string
  meta?: EndpointMeta
  fictionDb: FictionDb
}): Partial<T> {
  const { type, fields, meta, table, fictionDb } = args

  if (!fields || typeof fields !== 'object')
    return fields

  const hasPrivateAuthority = true
  const bearerIsAdmin = meta?.bearer?.isSuperAdmin

  const columns = fictionDb.getCols(table)
  const out: Partial<T> = {}

  columns?.forEach((c) => {
    const { key, sch, sec = 'setting', prepare } = c
    let value = (fields as Record<string, any>)[key]

    const hasReturnAuthority = meta?.returnAuthority?.includes(key)

    if (value === undefined)
      return

    // normalize to string (db returns Date, strings are easier to work with)
    if (value instanceof Date) {
      value = value.toISOString()
    }

    const includeField = (
      type === 'internal'
      || (type === 'update' && (sec === 'setting' || (sec === 'admin' && bearerIsAdmin)))
      || (type === 'insert' && sec !== 'authority')
      || (type === 'return' && (
        !['authority', 'private'].includes(sec)
        || (sec === 'authority' && hasReturnAuthority)
        || (sec === 'private' && (hasPrivateAuthority || hasReturnAuthority))
      ))
    )

    let isValid = !sch || value === null
    if (sch && value !== null) {
      const schema = sch({ z })
      value = removeUndefined(value, { removeNull: true })
      const parsed = schema.safeParse(value)
      if (!parsed.success) {
        fictionDb.log.error(`DB PREP: Validation failed for field ${table}:${key} - ${parsed.error.message}`, { data: { value, fields } })
        isValid = false
      }
      else {
        isValid = true
      }
    }

    const useValid = isValid || (!isValid && type === 'return')

    if (includeField && useValid && value) {
      (out as Record<string, any>)[key] = value !== null && prepare ? prepare({ value, key }) : value
    }
  })

  if (columns?.some(col => col.key === 'updatedAt')) {
    (out as Record<string, any>).updatedAt = new Date().toISOString()
  }

  return out
}
