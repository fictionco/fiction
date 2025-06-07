import type { MemberAccess } from '../plugin-user/types'
import type { EndpointMeta } from './endpoint'
import { _stop } from './error'

export const userCapabilities = {
  canExecute: 1000,
  canAdministrate: 500,
  canManage: 300,
  canEdit: 200,
  canView: 100,
}

export type UserCapability = keyof typeof userCapabilities

export function getAccessLevel(access?: MemberAccess): number {
  if (access === 'owner')
    return 1000
  else if (access === 'admin')
    return 500
  else if (access === 'manager')
    return 300
  else if (access === 'editor')
    return 200
  else if (access === 'observer')
    return 100
  else if (access === 'profile')
    return 50
  else return 0
}

export function userCan(opts: {
  capability: keyof typeof userCapabilities
  access?: MemberAccess
}) {
  const { capability, access } = opts

  if (!opts.access)
    return false

  const accessLevel = getAccessLevel(access)
  return accessLevel >= userCapabilities[capability]
}

export function hasAccessLevel(access: MemberAccess, meta: EndpointMeta) {
  const reqAccess = getAccessLevel(access)

  const bearerAccess = meta.bearer?.relation?.accessLevel || 0

  const hasAccess = meta.server || (bearerAccess && bearerAccess >= reqAccess)

  if (!hasAccess) {
    throw _stop(
      `not enough access (${meta.bearer?.relation?.access ?? 'unknown'})`,
    )
  }

  return hasAccess
}
