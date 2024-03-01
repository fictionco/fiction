import { computed } from "vue"
import { getRouter } from "../@factor/api/utils/routerutils/router"
import { emitEvent } from "../@factor/api/utils/event/utils/event"
import { clientToken } from "../utils/jwt"
import { log } from "../logger"
import { stored, storeItem } from "../@factor/api/utils/store/utils/store"
import { FullUser } from "../@factor/api/plugin-user/typestor/api/plugin-user/types"

export const cacheUser = ({ user }: { user: Partial<FullUser> }): void => {
  if (user && user.userId) storeItem(user.userId, user)
}

/**
 * Active user computed
 */
export const activeUser = computed<FullUser | undefined>({
  get: () => {
    return stored<FullUser>("currentUser")
  },
  set: (v) => {
    storeItem("currentUser", v)
  },
})

/**
 * Information for the currently logged in user
 */
export const currentUser = (): FullUser | undefined => {
  return activeUser.value
}

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
  log.info("deleteCurrentUser", `deleted current user`)

  clientToken({ action: "destroy" })
  activeUser.value = undefined
}

/**
 * Set persistent user info
 */
export const setCurrentUser = (args: {
  user: FullUser | undefined
  token?: string
}): void => {
  const { user, token = "" } = args

  if (!user) return deleteCurrentUser()

  log.debug("setCurrentUser", `set ${user.email}`, { data: user })

  if (token) {
    clientToken({ action: "set", token })
  }

  activeUser.value = user

  cacheUser({ user })
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
    user: FullUser | undefined,
  ) => FullUser | undefined | Promise<FullUser | undefined>,
): Promise<void> => {
  const newUser = await cb(activeUser.value)
  if (newUser) {
    setCurrentUser({ user: newUser })
  }
}
