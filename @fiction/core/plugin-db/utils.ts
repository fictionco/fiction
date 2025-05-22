import type { EndpointMeta } from '../utils/endpoint'
import type { FictionDb } from './index'
import type { SecurityType } from './objects'
import { z } from 'zod/v4'
import { removeUndefined } from '../utils/obj'

type ScenarioType = 'internal' | 'update' | 'insert' | 'return'

function canIncludeField(args: {
  type: ScenarioType
  sec: SecurityType
  hasAuth: { return?: boolean, privateAuth?: boolean, admin?: boolean }
}) {
  const { type, sec, hasAuth } = args

  if (type === 'internal')
    return true
  if (type === 'insert')
    return sec !== 'authority'
  if (type === 'update')
    return sec === 'setting' || (sec === 'settingAdmin' && hasAuth.admin) || (sec === 'settingPrivate' && hasAuth.privateAuth)
  if (type === 'return') {
    if (!['authority', 'settingPrivate'].includes(sec))
      return true
    return sec === 'authority' ? hasAuth.return : (hasAuth.privateAuth || hasAuth.return)
  }
  return false
}

type BasePrepObject = {
  userId?: string
  orgId?: string
  [key: string]: any
}

function hasPrivateAuth(args: { fields: BasePrepObject, meta?: EndpointMeta }) {
  const { fields, meta } = args

  if (meta?.bearer?.isSuperAdmin) {
    return true
  }

  else if (fields.userId && fields.userId === meta?.bearer?.userId) {
    return true
  }

  else if (fields.orgId && meta?.bearer?.orgs?.find(_ => _.orgId === fields.orgId)) {
    return true
  }

  return false
}

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

  const privateAuth = hasPrivateAuth({ fields: fields as BasePrepObject, meta })

  const hasAuth = {
    privateAuth,
    admin: meta?.bearer?.isSuperAdmin,
    return: false,
  }

  const out: Partial<T> = {}
  const columns = fictionDb.getCols(table)

  columns?.forEach(({ key, sch, sec = 'setting', prepare }) => {
    let value = (fields as Record<string, any>)[key]
    if (value === undefined)
      return

    hasAuth.return = meta?.returnAuthority?.includes(key) || false

    if (value instanceof Date)
      value = value.toISOString()

    const includeField = canIncludeField({ type, sec, hasAuth })

    let isValid = !sch || value === null
    if (sch && value !== null) {
      const schema = sch({ z })
      value = removeUndefined(value, { removeNull: true })
      const parsed = schema.safeParse(value)
      if (parsed.success) {
        isValid = true
      }
      else {
        const expected = meta?.expectError
        fictionDb.log.error(
          `DB PREP(${type})${expected ? '(EXPECTED)' : ''}: Validation failed for field ${table}:${key}`,
          { data: { value, error: parsed.error.message } },
        )
        isValid = false
      }
    }

    if (includeField && (isValid || type === 'return')) {
      (out as Record<string, any>)[key] = value !== null && prepare ? prepare({ value, key }) : value
    }
  })

  if (columns?.some(col => col.key === 'updatedAt')) {
    (out as Record<string, any>).updatedAt = new Date().toISOString()
  }

  return out
}
