import { _stop } from './error'
import type { MemberAccess } from '../plugin-user/types'
import type { EndpointMeta } from './endpoint'

export const userCapabilities = {
  canExecute: 1000,
  canAdministrate: 500,
  canManage: 300,
  canEdit: 200,
  canView: 100,
}

export type UserCapability = keyof typeof userCapabilities

export function getAccessLevel(memberAccess?: MemberAccess): number {
  if (memberAccess === 'owner')
    return 1000
  else if (memberAccess === 'admin')
    return 500
  else if (memberAccess === 'manager')
    return 300
  else if (memberAccess === 'editor')
    return 200
  else if (memberAccess === 'observer')
    return 100
  else if (memberAccess === 'profile')
    return 50
  else return 0
}

export function userCan(opts: {
  capability: keyof typeof userCapabilities
  memberAccess?: MemberAccess
}) {
  const { capability, memberAccess } = opts

  if (!opts.memberAccess)
    return false

  const accessLevel = getAccessLevel(memberAccess)
  return accessLevel >= userCapabilities[capability]
}

export function hasAccessLevel(memberAccess: MemberAccess, meta: EndpointMeta) {
  const reqAccess = getAccessLevel(memberAccess)

  const bearerAccess = meta.bearer?.relation?.accessLevel || 0

  const hasAccess = meta.server || (bearerAccess && bearerAccess >= reqAccess)

  if (!hasAccess) {
    throw _stop(
      `not enough access (${meta.bearer?.relation?.memberAccess ?? 'unknown'})`,
    )
  }

  return hasAccess
}
