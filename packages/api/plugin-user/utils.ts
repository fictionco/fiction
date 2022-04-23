import { FullUser, PublicUser } from "./types"

export const getJsonUserFields = (): (keyof FullUser)[] => {
  return ["settings", "profile"]
}

export const getEditableUserFields = (): (keyof FullUser)[] => {
  const baseEditable: (keyof FullUser)[] = [
    "fullName",
    "avatar",
    "birthday",
    "cover",
    "gender",
    "about",
  ]

  return baseEditable
}

export const getPublicUserFields = (): (keyof PublicUser)[] => {
  const baseEditable: (keyof PublicUser)[] = [
    "userId",
    "email",
    "emailVerified",
    "role",
    "username",
    "fullName",
    "createdAt",
    "updatedAt",
    "avatar",
    "status",
    "lastSeen",
    "username",
    "profile",
  ]
  return baseEditable
}
