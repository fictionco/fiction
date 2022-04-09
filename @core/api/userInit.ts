import { FullUser, PrivateUser, AuthCallback } from "@factor/types"

import { userEndpoints } from "@factor/engine/user"
import { clientToken } from "./jwt"
import { log } from "./logger"
import { getRouter } from "./router"
import { isSearchBot, isNode } from "./utils"
import { currentUser, setCurrentUser, logout } from "./user"

/**
 * Utility function that calls a callback when the user is set initially
 * If due to route change then initialized var is set and its called immediately
 * @notes
 *  - recursions - watch for recursions while making the request
 *  - promise - many requests should share the same promise
 */
let __userInitialized: Promise<boolean>
let __promiseResolve:
  | undefined
  | ((value: boolean | PromiseLike<boolean>) => void)

export const userInitialized = async (
  callback?: (u: PrivateUser | undefined) => void,
): Promise<PrivateUser | undefined> => {
  if (!__userInitialized) {
    __userInitialized = new Promise(async (resolve) => {
      __promiseResolve = resolve
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
 * Set the user to initialized
 */
export const setUserInitialized = (): void => {
  if (__promiseResolve) __promiseResolve(true)
}

interface RouteAuthConfig {
  required?: boolean
  redirect?: string
  allowBots?: boolean
}

export const routeAuthRedirects = async (
  user: FullUser | undefined,
): Promise<void> => {
  // don't worry about redirects on server
  // if runs in node, this hangs causing test problems
  if (isNode) return

  const router = getRouter()
  const currentRoute = router.currentRoute.value

  if (!currentRoute) return

  const { matched } = currentRoute

  let authConfig: RouteAuthConfig = { redirect: "/" }
  matched.forEach(({ meta: { auth } }) => {
    if (auth) {
      authConfig = { ...authConfig, ...(auth as RouteAuthConfig) }
    }
  })

  for (const matchedRoute of matched) {
    const auth = matchedRoute.meta.auth as AuthCallback
    if (auth) {
      const redirect = await auth({ user, searchBot: isSearchBot() })

      if (redirect) {
        log.info("routeAuthRedirects", "auth required redirect", {
          data: { redirect },
        })
        await router.push({ path: redirect })
      }
    }
  }
}

/**
 * On initial client load, this makes the HTTP request for user auth status
 */
export const requestCurrentUser = async (): Promise<FullUser | undefined> => {
  const token = clientToken({ action: "get" })

  let user: FullUser | undefined = undefined

  if (token) {
    const { status, data, code } = await userEndpoints().CurrentUser.request({
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

  log.debug("requestCurrentUser", "user loaded", { data: { user } })

  return user
}

/**
 * Make request to initialize user
 * @important only run in browser
 */
export const initializeUser = async (): Promise<void> => {
  await userInitialized()
}
