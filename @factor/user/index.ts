import { requestPostSingle, requestPostPopulate } from "@factor/post/request"
import { appMounted } from "@factor/app"
import { RouteGuard } from "@factor/app/types"

import { isNode, isSearchBot } from "@factor/api/utils"
import { addFilter, runCallbacks, addCallback } from "@factor/api/hooks"
import { currentRoute, navigateToRoute } from "@factor/app/router"
import { stored } from "@factor/app/store"
import log from "@factor/api/logger"
import { onEvent, emitEvent } from "@factor/api/events"
import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { FactorPost } from "@factor/post/types"
import { waitFor, getPostTypeConfig } from "@factor/api"
import { showResetPassword, verifyEmail } from "./email-request"
import { VerifyEmail } from "./email-types"
import { setUser, showSignIn, initializedUser } from "./util"
import { setUserGeolocation } from "./geo"
import {
  FactorUserCredential,
  AuthenticationParameters,
  userRolesMap,
  CurrentUserState,
  UserRoles,
} from "./types"
import "./hooks-universal"
import "./edit-account"
import { userToken, handleTokenError } from "./token"

export * from "./util"

export const postType = "user"

/**
 * Information for the currently logged in user
 */
export const currentUser = (): CurrentUserState => {
  return stored("currentUser")
}

/**
 * Return just the userId
 */
export const currentUserId = (): string => {
  const user = currentUser()
  return user?._id ?? ""
}

/**
 * Utility function that calls a callback when the user is set initially
 * If due to route change then initialized var is set and its called immediately
 *
 * @param callback - Called after user is initialized with value of user
 */
export const userInitialized = async (
  callback?: (u: CurrentUserState) => void
): Promise<CurrentUserState> => {
  // this function needs to take at least 50ms, for consistency in rendering
  // If user is logged out, this function happens too fast and can cause hydration issues
  const [user] = await Promise.all([initializedUser(), waitFor(50)])

  if (callback) callback(user)

  return user
}

/**
 * Gets the information for a user based on a token
 * If no token is passed in, it looks in localStorage
 * @param userCredential - user credentialing information (password/token)
 */
export const loadUser = async (
  userCredential?: FactorUserCredential
): Promise<CurrentUserState> => {
  let token
  let user

  if (userCredential && userCredential.token) {
    token = userCredential.token
  } else if (userToken()) {
    token = userToken()
  }

  try {
    if (token) {
      user = (await requestPostSingle({
        token,
        postType,
        log: "loadUser",
      })) as FactorUserCredential

      setUser({ user, token, current: true })
    }
  } catch (error) {
    handleTokenError(error, { onError: () => log.error(error) })
  }

  return user
}

/**
 * On initial client load, this makes the HTTP request for user auth status
 */
const requestInitializeUser = async (): Promise<CurrentUserState> => {
  await appMounted()

  // Run this and store for later sync requests
  setUserGeolocation()

  const resolvedUser = await loadUser()

  emitEvent("userInitialized", resolvedUser)

  await runCallbacks("before-user-init", resolvedUser)

  return resolvedUser
}

/**
 * Is the currently logged in user same as _id
 * @param _id - User ObjectId
 */
export const isCurrentUser = (_id: string): boolean => {
  const current = currentUser()
  return current && current._id === _id ? true : false
}

/**
 * Gets the _id of the currently logged in user
 */
export const userId = (): string => {
  const current = currentUser()
  return current && current._id ? current._id : ""
}

/**
 * Is the user logged in?
 */
export const isLoggedIn = (): boolean => {
  return currentUser() ? true : false
}

/**
 * Is the logged in user's email verified?
 */
export const isEmailVerified = (): boolean => {
  const current = currentUser()
  return current && current.emailVerified ? true : false
}

/**
 * Makes a request to the user endpoint
 * @param method - user endpoint method
 * @param params - data to call with
 */
const sendUserRequest = async (
  method: string,
  params: EndpointParameters
): Promise<unknown> => {
  return await endpointRequest({ id: "user", method, params })
}

/**
 * Authenticates a user based on email and password. Optionally creates a new account.
 */
export const authenticate = async (
  params: AuthenticationParameters
): Promise<FactorUserCredential> => {
  const user = (await sendUserRequest("authenticate", params)) as FactorUserCredential

  if (user && user.token) {
    emitEvent("user-authenticated", { user, params })

    await runCallbacks("user-authenticated-callbacks", user, params)

    requestPostPopulate({ posts: [user] })
    setUser({ user, token: user.token, current: true })
  }

  return user
}

/**
 * Very basic version for UI control by  role
 * @remark
 * Needs improvement for more fine grained control
 */
export const userCan = ({
  role = "",
  accessLevel = -1,
  post,
}: {
  role?: string
  accessLevel?: number
  post?: FactorPost
}): boolean => {
  const current = currentUser()
  const userAccessLevel = current && current.accessLevel ? current.accessLevel : 0
  const roleAccessLevel = role ? userRolesMap[role as UserRoles] : 1000

  if (current && post?.author?.includes(current._id)) {
    return true
  } else if (accessLevel >= 0 && userAccessLevel >= accessLevel) {
    return true
  } else if (role && userAccessLevel >= roleAccessLevel) {
    return true
  } else {
    return false
  }
}

/**
 * If a route requires auth, show the signin modal or other handling
 * before they navigate.
 *
 * @return true proceeds with nav, false if prevent
 */
const handleAuthRouting = (): void => {
  addCallback({
    key: "authRouting",
    hook: "client-route-before",
    callback: async ({ to }: RouteGuard): Promise<boolean> => {
      const user = await userInitialized()
      const { path: toPath } = to

      const isBot = isSearchBot()

      // Is authentication needed
      const auth = to.matched.some((_r) => {
        const botsAllowed = _r.meta.allowBots && isBot
        return _r.meta.auth && !botsAllowed
      })

      const userAccessLevel = user?.accessLevel ?? 0
      let accessLevel = 0
      to.matched.forEach(({ meta }) => {
        if (meta.accessLevel && meta.accessLevel > accessLevel) {
          accessLevel = meta.accessLevel
        }
      })

      if (to.path.includes("dashboard") && to.params.postType) {
        const ptAccess = getPostTypeConfig(to.params.postType)?.accessLevel ?? 0

        if (ptAccess > accessLevel) accessLevel = ptAccess
      }

      if ((auth === true || accessLevel > 0) && !user) {
        showSignIn({ redirect: toPath })
        return false
      } else if (accessLevel > userAccessLevel) {
        navigateToRoute({ path: "/" })
        emitEvent("error", "403: Permissions needed")
        return false
      } else {
        return true
      }
    },
  })

  /**
   * Handle auth redirects and protection on initial page load
   */
  addCallback({
    key: "authRouting",
    hook: "before-user-init",
    callback: (user: CurrentUserState) => {
      const { path, matched, params } = currentRoute()

      const isBot = isSearchBot()

      const auth = matched.some((_r) => {
        const botsAllowed = _r.meta.allowBots && isBot
        return _r.meta.auth && !botsAllowed
      })

      const userAccessLevel = user?.accessLevel ?? 0
      let accessLevel = 0

      // If route has access level
      matched.forEach(({ meta }) => {
        if (meta.accessLevel && meta.accessLevel > accessLevel) {
          accessLevel = meta.accessLevel
        }
      })

      // If postType admin ui has access level
      if (path.includes("dashboard") && params.postType) {
        const ptAccess = getPostTypeConfig(params.postType)?.accessLevel ?? 0

        if (ptAccess > accessLevel) accessLevel = ptAccess
      }

      if ((accessLevel > 0 || auth === true) && !user) {
        showSignIn({ redirect: path })
      } else if (accessLevel > userAccessLevel) {
        navigateToRoute({ path: "/" })
        emitEvent("error", "403: You don't have the permissions to view that page.")
      }
    },
  })
}

const setup = (): void => {
  addCallback({
    key: "verifyEmail",
    hook: "route-query-action-verify-email",
    callback: (_: VerifyEmail) => verifyEmail(_),
  })
  addCallback({
    key: "resetPassword",
    hook: "route-query-action-reset-password",
    callback: () => showResetPassword(),
  })

  addFilter({
    key: "userInit",
    hook: "before-app",
    callback: () => {
      // Authentication events only work after SSR
      if (!isNode && !initializedUser()) {
        initializedUser("set", requestInitializeUser())

        handleAuthRouting()
      }
    },
  })

  onEvent("invalid-user-token", () => {
    setUser({ user: undefined, current: true })
  })
}
setup()
