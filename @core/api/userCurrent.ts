import type { UserFetch, UserEndpoint } from "@factor/server/user/serverTypes"
import { FullUser, PrivateUser } from "@factor/types"
import { computed } from "vue"
import { emitEvent } from "./event"
import { clientToken } from "./jwt"
import { dLog } from "./logger"
import { getRouter, routeAuthRedirects } from "./router"
import { stored, storeItem } from "./store"
import { endpointFetch } from "./endpoint"

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
 * Utility function that calls a callback when the user is set initially
 * If due to route change then initialized var is set and its called immediately
 * @notes
 *  - recursions - watch for recursions while making the request
 *  - promise - many requests should share the same promise
 */
let __userInitialized: Promise<true>
export const userInitialized = async (
  callback?: (u: PrivateUser | undefined) => void,
): Promise<PrivateUser | undefined> => {
  if (!__userInitialized) {
    __userInitialized = new Promise(async (resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await requestCurrentUser()
      resolve(true)
    })
  }

  await __userInitialized

  if (callback) callback(currentUser())

  return currentUser()
}

type EndpointProp<
  T extends keyof UserEndpoint,
  U extends "endpoint" | "request" | "response" | "method",
> = UserFetch<T>[U]

export const requestUserEndpoint = async <T extends keyof UserEndpoint>(
  method: EndpointProp<T, "method">,
  data: EndpointProp<T, "request">,
): Promise<EndpointProp<T, "response">> => {
  if (method !== "currentUser") {
    await userInitialized()
  }

  const endpoint = `/user/${method}` as `/user/${T}`
  const r = await endpointFetch<UserFetch<T>>(endpoint, data)

  return r
}

export const cacheUser = ({ user }: { user: Partial<FullUser> }): void => {
  if (user && user.userId) storeItem(user.userId, user)
}

/**
 * Logs out current user and deletes local data
 */
export const deleteCurrentUser = (): void => {
  dLog("info", "deleted current user")
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
 * On initial client load, this makes the HTTP request for user auth status
 */
export const requestCurrentUser = async (): Promise<FullUser | undefined> => {
  const token = clientToken({ action: "get" })

  let user: FullUser | undefined = undefined

  if (token) {
    const { status, data, code } = await requestUserEndpoint("currentUser", {
      token,
    })

    // If there is a token error, then delete it and force login
    if (status == "error" && code == "TOKEN_ERROR") {
      logout()
    }

    user = data

    if (user) {
      setCurrentUser({ user })
    }
  }

  // redirect before resolve
  await routeAuthRedirects(user)

  dLog("info", "user loaded", user)

  return user
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
/**
 * Make request to initialize user
 * @important only run in browser
 */
export const initializeUser = async (): Promise<void> => {
  userInitialized()
}
