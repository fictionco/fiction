import { requestPostSingle, requestPostPopulate } from "@factor/post/request"
import { appMounted } from "@factor/app"
import { RouteGuard } from "@factor/app/types"
import Vue from "vue"
import { isEmpty } from "@factor/api/utils-lodash"
import { isNode } from "@factor/api/utils"
import { addFilter, runCallbacks, addCallback } from "@factor/api/hooks"
import { currentRoute, navigateToRoute } from "@factor/app/router"
import { stored } from "@factor/app/store"
import log from "@factor/api/logger"
import { onEvent, emitEvent } from "@factor/api/events"
import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { showResetPassword, verifyEmail } from "./email-request"
import { VerifyEmail } from "./email-types"
import { setUser } from "./util"
import {
  FactorUserCredential,
  AuthenticationParameters,
  userRolesMap,
  CurrentUserState,
  UserRoles
} from "./types"
import "./hooks-universal"
import "./edit-account"

import { userToken, handleTokenError } from "./token"

export const postType = "user"
/**
 * Information for the currently logged in user
 */
export const currentUser = (): CurrentUserState => {
  return stored("currentUser")
}

/**
 * Utility function that calls a callback when the user is set initially
 * If due to route change then initialized var is set and its called immediately
 *
 * @param callback - Called after user is initialized with value of user
 */
export const userInitialized = async (callback?: Function): Promise<CurrentUserState> => {
  const user = await Vue.$initializedUser

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
        log: "loadUser"
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

  const resolvedUser = await loadUser()

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
  return !isEmpty(currentUser())
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
    emitEvent("userAuthenticated", { user, params })

    await runCallbacks("userAuthenticatedCallbacks", user, params)

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
  accessLevel = -1
}: {
  role?: string;
  accessLevel?: number;
}): boolean => {
  const current = currentUser()
  const userAccessLevel = current && current.accessLevel ? current.accessLevel : 0
  const roleAccessLevel = role ? userRolesMap[role as UserRoles] : 1000
  if (accessLevel >= 0 && userAccessLevel >= accessLevel) {
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

      // Is authentication needed
      const auth = to.matched.some(_r => {
        return _r.meta.auth
      })

      if (auth === true && !user) {
        emitEvent("sign-in-modal", { redirect: toPath })
        return false
      } else {
        return true
      }
    }
  })

  addCallback({
    key: "authRouting",
    hook: "before-user-init",
    callback: (user: CurrentUserState) => {
      const { path, matched } = currentRoute()
      const auth = matched.some(_r => _r.meta.auth)

      if (auth === true && (!user || !user._id)) {
        navigateToRoute({ path: "/signin", query: { redirect: path } })
      }
    }
  })
}

export const setup = (): void => {
  addCallback({
    key: "verifyEmail",
    hook: "route-query-action-verify-email",
    callback: (_: VerifyEmail) => verifyEmail(_)
  })
  addCallback({
    key: "resetPassword",
    hook: "route-query-action-reset-password",
    callback: () => showResetPassword()
  })

  addFilter({
    key: "userInit",
    hook: "before-app",
    callback: () => {
      // Authentication events only work after SSR
      if (!isNode && !Vue.$initializedUser) {
        Vue.$initializedUser = requestInitializeUser()
        handleAuthRouting()
      }
    }
  })

  onEvent("invalid-user-token", () => {
    setUser({ user: undefined, current: true })
  })
}
setup()
