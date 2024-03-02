import validator from 'validator'
import type { FictionDb } from '../plugin-db'
import type { EndpointMeta } from './endpoint'

type ValidationTypes = 'email' | 'domain' | 'url'

export function isValid(value: string, type: ValidationTypes): boolean {
  if (type === 'email') {
    return validator.isEmail(value)
  }
  else if (type === 'domain' || type === 'url') {
    const opts = type === 'domain' ? { require_protocol: false } : {}
    return validator.isURL(value, opts)
  }
  else {
    return false
  }
}

export function prepareFields<T >(args: {
  type: 'create' | 'settings' | 'internal' | 'returnInfo'
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

  const out: Record<string, any> = {}

  const db = fictionDb.client()

  const cols = fictionDb.getColumns(table)

  cols?.forEach(
    ({ key, isSetting, isPrivate, isAuthority, isAdmin, prepare }) => {
      const k = key
      const f = fields as Record<string, any>
      const value = f[k]

      if (
        value !== undefined
        && (type === 'internal'
        || (type === 'settings' && isSetting)
        || (type === 'create' && !isAuthority)
        || (type === 'settings' && isAdmin && bearerIsAdmin))
      ) {
        out[key]
          = value !== null && prepare ? prepare({ value, key, db }) : value
      }
      else if (
        type === 'returnInfo'
          && value
          && (!isAuthority
          || (meta?.returnAuthority?.includes(k)))
          && (!isPrivate || privateAccess)
      ) {
        out[key] = value
      }
    },
  )

  // add updated time
  if (cols?.find(c => c.key === 'updatedAt'))
    out.updatedAt = new Date()

  return out as T
}
