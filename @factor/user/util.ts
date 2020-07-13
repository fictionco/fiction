import { emitEvent, currentRoute, navigateToRoute, storeItem } from "@factor/api"
import { userRolesMap, CurrentUserState, UserRoles } from "./types"
import { userToken } from "./token"

let __initializedUser: Promise<CurrentUserState> | CurrentUserState

export const initializedUser = (
  action?: "set" | "get",
  value?: Promise<CurrentUserState> | CurrentUserState
): Promise<CurrentUserState> | CurrentUserState => {
  if (action == "set") {
    __initializedUser = value
  }

  return __initializedUser
}

export const roleAccessLevel = (role: UserRoles | undefined): number => {
  return role && userRolesMap[role] ? userRolesMap[role] : 0
}

export interface SetUser {
  user: CurrentUserState
  token?: string
  current?: boolean
}

/**
 * Set persistent user info
 */
export const setUser = ({ user, token = "", current = false }: SetUser): void => {
  if (current) {
    initializedUser("set", user ? user : undefined)

    if (token && user) userToken(token)
    else if (user === undefined) userToken("destroy")

    storeItem("currentUser", user)

    // In certain environments (testing) and with high privacy settings, localStorage is unset
    if (localStorage) {
      localStorage[user ? "setItem" : "removeItem"]("user", JSON.stringify(user))
    }
  }

  if (user && user._id) storeItem(user._id, user)
}

/**
 * Shows sign in
 */
export const showSignIn = (
  options: {
    redirect?: string
    view?: string
    mode?: "page" | "modal"
  } = {}
): void => {
  const { mode = "modal" } = options

  if (mode == "modal") {
    emitEvent("signin-redirect-client", options)
  } else {
    emitEvent("signin-redirect", options)
    // navigateToRoute({ path: "/signin", query: { redirect } })
  }
}

/**
 * Logs out the current user
 */
export const logout = async (args: { redirect?: string } = {}): Promise<void> => {
  setUser({ user: undefined, current: true })
  emitEvent("logout")
  emitEvent("notify", "Successfully logged out.")

  if (args.redirect || currentRoute().matched.some((r) => r.meta.auth)) {
    const { redirect: path = "/" } = args
    navigateToRoute({ path })
  } else {
    emitEvent("reset-ui")
  }
}
