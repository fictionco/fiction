import { z } from 'zod'
import type { EndpointMeta } from '../utils'
import type { FictionDb } from '.'

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

  const privateAccess = true
  const bearerIsAdmin = meta?.bearer?.isSuperAdmin

  const columns = fictionDb.getCols(table)
  const out: Partial<T> = {}

  columns?.forEach((c) => {
    const { key, sch, sec = 'setting', prepare } = c
    const value = (fields as Record<string, any>)[key]

    if (value === undefined)
      return

    const includeField = (
      type === 'internal'
      || (type === 'update' && (sec === 'setting' || (sec === 'admin' && bearerIsAdmin)))
      || (type === 'insert' && sec !== 'authority')
      || (type === 'return' && (
        !['authority', 'private'].includes(sec)
        || (sec === 'authority' && meta?.returnAuthority?.includes(key))
        || (sec === 'private' && privateAccess)
      ))
    )

    let isValid = !sch || value === null
    if (sch && value !== null) {
      const schema = sch({ z })
      const parsed = schema.safeParse(value)
      if (!parsed.success) {
        fictionDb.log.error(`Validation failed for field ${table}:${key} - ${parsed.error.message}`, { data: { value } })
        isValid = false
      }
      else {
        isValid = true
      }
    }

    if (includeField && isValid) {
      (out as Record<string, any>)[key] = value !== null && prepare ? prepare({ value, key }) : value
    }
  })

  if (columns?.some(col => col.key === 'updatedAt')) {
    (out as Record<string, any>).updatedAt = new Date().toISOString()
  }

  return out
}
