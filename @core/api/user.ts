import { PublicUser, FullUser, PrivateUser } from "@factor/types"
import { computed } from "vue"
import { emitEvent } from "./event"
import { clientToken } from "./jwt"
import { logger } from "./logger"
import { getRouter } from "./router"
import { stored, storeItem } from "./store"

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

export const cacheUser = ({ user }: { user: Partial<FullUser> }): void => {
  if (user && user.userId) storeItem(user.userId, user)
}

/**
 * Information for the currently logged in user
 */
export const currentUser = (): PrivateUser | undefined => {
  return stored("currentUser")
}
/**
 * Active user computed
 */
export const activeUser = computed(() => {
  return currentUser()
})
/**
 * Is the current visitor logged in?
 */
export const isLoggedIn = (): boolean => {
  return currentUser() ? true : false
}
/**
 * Logs out current user and deletes local data
 */
export const deleteCurrentUser = (): void => {
  logger.log({
    level: "info",
    context: "user",
    description: "deleted current user",
  })
  clientToken({ action: "destroy" })
  storeItem("currentUser", undefined)
}

/**
 * Set persistent user info
 */
export const setCurrentUser = (args: {
  user: (PrivateUser & Partial<FullUser>) | undefined
  token?: string
}): void => {
  const { user, token = "" } = args

  if (!user) return deleteCurrentUser()

  storeItem("currentUser", user)
  cacheUser({ user })

  if (token) {
    clientToken({ action: "set", token })
  }
}
/**
 * Logs out the current user
 */
export const logout = async (
  args: { redirect?: string } = {},
): Promise<void> => {
  deleteCurrentUser()
  emitEvent("logout")
  emitEvent("notify", "Successfully logged out.")

  const theCurrentRoute = getRouter().currentRoute.value

  if (
    args.redirect ||
    !theCurrentRoute ||
    theCurrentRoute.matched.some((r) => r.meta.auth)
  ) {
    const { redirect: path = "/" } = args
    await getRouter().push({ path })
  } else {
    emitEvent("resetUi")
  }
}

/**
 * Updates the current locally stored user
 */
export const updateUser = async (
  cb: (
    user: PrivateUser | undefined,
  ) => PrivateUser | undefined | Promise<PrivateUser | undefined>,
): Promise<void> => {
  const user = currentUser()
  const newUser = await cb(user)
  if (newUser) {
    setCurrentUser({ user: newUser })
  }
}
