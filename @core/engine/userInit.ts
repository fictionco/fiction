import { FullUser, PrivateUser } from "@factor/types"

import { clientToken } from "@factor/api/jwt"
import { logger } from "@factor/api/logger"
import { routeAuthRedirects } from "@factor/api/router"
import { currentUser, setCurrentUser, logout } from "@factor/api"
import { getEndpointsMap } from "./user"

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

/**
 * On initial client load, this makes the HTTP request for user auth status
 */
export const requestCurrentUser = async (): Promise<FullUser | undefined> => {
  const token = clientToken({ action: "get" })

  let user: FullUser | undefined = undefined

  if (token) {
    const { status, data, code } = await getEndpointsMap().CurrentUser.request({
      token,
    })

    // If there is a token error, then delete it and force login
    if (status == "error" && code == "TOKEN_ERROR") {
      await logout()
    }

    user = data

    if (user) {
      setCurrentUser({ user })
    }
  }

  // redirect before resolve
  await routeAuthRedirects(user)

  logger.log({
    level: "info",
    context: "user",
    description: "current user loaded",
    data: { user },
  })

  return user
}

/**
 * Make request to initialize user
 * @important only run in browser
 */
export const initializeUser = async (): Promise<void> => {
  await userInitialized()
}
