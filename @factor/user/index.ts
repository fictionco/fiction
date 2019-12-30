import { endpointRequest } from "@factor/endpoint"
import { requestPostSingle, requestPostPopulate } from "@factor/post/request"
import { appMounted } from "@factor/app"
import { RouteGuard } from "@factor/app/types"
import Vue from "vue"
import {
  isEmpty,
  isNode,
  emitEvent,
  addFilter,
  runCallbacks,
  addCallback,
  stored,
  log,
  currentRoute,
  navigateToRoute,
  onEvent
} from "@factor/api"

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

export * from "./email-request"

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

const retrieveAndSetCurrentUser = async (
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
      user = (await requestPostSingle({ token })) as FactorUserCredential

      setUser({ user, token, current: true })
    }
  } catch (error) {
    handleTokenError(error, { onError: () => log.error(error) })
  }

  return user
}

const requestInitializeUser = async (): Promise<CurrentUserState> => {
  await appMounted()
  const resolvedUser = await retrieveAndSetCurrentUser()

  await runCallbacks("before-user-init", resolvedUser)

  return resolvedUser
}

export const isCurrentUser = (_id: string): boolean => {
  const current = currentUser()
  return current && current._id === _id ? true : false
}

export const userId = (): string => {
  const current = currentUser()
  return current && current._id ? current._id : ""
}

export const isLoggedIn = (): boolean => {
  return !isEmpty(currentUser())
}

export const isEmailVerified = (): boolean => {
  const current = currentUser()
  return current && current.emailVerified ? true : false
}

const sendUserRequest = async (method: string, params: object): Promise<unknown> => {
  return await endpointRequest({ id: "user", method, params })
}

export const authenticate = async (
  params: AuthenticationParameters
): Promise<FactorUserCredential> => {
  const user = (await sendUserRequest("authenticate", params)) as FactorUserCredential

  await runCallbacks("authenticated", user)

  if (user && user.token) {
    requestPostPopulate({ posts: [user] })
    setUser({ user, token: user.token, current: true })
  }

  return user
}

// Very basic version for UI control by  role
// Needs improvement for more fine grained control
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

const handleAuthRouting = (): void => {
  addCallback({
    key: "authRouting",
    hook: "client-route-before",
    callback: async ({ to, next }: RouteGuard) => {
      const user = await userInitialized()
      const { path: toPath } = to

      // Is authentication needed
      const auth = to.matched.some(_r => {
        return _r.meta.auth
      })

      if (auth === true && !user) {
        emitEvent("sign-in-modal", { redirect: toPath })
        next(false)
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
  addFilter({
    key: "userInit",
    hook: "before-app",
    callback: () => {
      // Authentication events only work after SSR
      if (!isNode) {
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
