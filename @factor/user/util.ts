import { userRolesMap, UserRoles } from "./types"

export function roleAccessLevel(role: UserRoles | undefined): number {
  return role && userRolesMap[role] ? userRolesMap[role] : 300
}
