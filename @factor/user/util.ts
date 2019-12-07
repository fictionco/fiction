import { userRolesMap, UserRoles } from "./types"

export const roleAccessLevel = (role: UserRoles | undefined): number => {
  return role && userRolesMap[role] ? userRolesMap[role] : 300
}