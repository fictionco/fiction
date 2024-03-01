import { logger } from '@factor/api/logger'
import { getTrackingMode } from '../../@core/client-tag/settings'
import { isValidJson } from './utils'

type LocalScope = 'functional' | 'tracking' | 'session'
type LocalType = 'session' | 'persistent' | 'all'

function hasStorage(): boolean {
  if (!localStorage || !sessionStorage)
    return false
  else return true
}

function trackingEligible({
  scope,
  type,
}: {
  scope: LocalScope
  type?: LocalType
}): boolean {
  const mode = getTrackingMode()

  if (mode === 'basic' && (scope === 'tracking' || type === 'persistent'))
    return false
  else
    return true
}

interface SetLocalBase {
  key: string
  scope: LocalScope
  type?: LocalType
}

type SetLocalArgs<T = unknown> = T extends string
  ? SetLocalBase & { raw?: boolean, value: string }
  : SetLocalBase & { raw?: undefined, value: T }

export function setLocal<T = unknown>(args: SetLocalArgs<T>): void {
  const { key, value, scope, type = 'persistent', raw } = args

  if (!hasStorage())
    return

  if (!trackingEligible({ scope, type }))
    return

  let v: string
  if (raw)
    v = value as string
  else
    v = JSON.stringify(value)

  if (type === 'session')
    sessionStorage.setItem(key, v)
  else
    localStorage.setItem(key, v)
}

interface LocalArgs {
  key: string
  type?: LocalType
  raw?: boolean
}

interface loc {
  <T = unknown>(args: LocalArgs): T | undefined
  <T = string>(args: LocalArgs & { raw: true }): T | undefined
}

export const getLocal: loc = (args) => {
  if (!hasStorage())
    return

  const { key, raw } = args

  let v: string | undefined = sessionStorage.getItem(key) ?? undefined

  if (!v)
    v = localStorage.getItem(key) ?? undefined

  if (raw)
    return v

  if (!v)
    return undefined

  const result = isValidJson(v)

  if (result) {
    return result
  }
  else {
    logger.log({
      level: 'error',
      description: '(getLocal) json invalid',
      data: { key, v },
    })
    return undefined
  }
}

export function removeLocal(args: LocalArgs): void {
  if (!hasStorage())
    return

  const { key } = args

  sessionStorage.removeItem(key)
  localStorage.removeItem(key)
}
