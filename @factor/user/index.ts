import { endpointRequest } from "@factor/endpoint"
import { requestPostSingle, requestPostPopulate } from "@factor/post"
import { userToken, handleTokenError } from "./token"

import { RouteGuard } from "@factor/app/types"
import {
  isEmpty,
  isNode,
  emitEvent,
  addFilter,
  runCallbacks,
  addCallback,
  stored,
  storeItem,
  log,
  currentRoute,
  navigateToRoute,
  onEvent
} from "@factor/tools"

import {
  FactorUser,
  FactorUserCredential,
  AuthenticationParameters,
  userRolesMap
} from "./types"
import "./hooks-universal"
import "./edit-account"
import { appMounted } from "@factor/app"

export * from "./email-request"

let _initializedUser: Promise<FactorUser | undefined>

export function currentUser(): FactorUser | undefined {
  return stored("currentUser")
}

addFilter("before-app", () => {
  // Authentication events only work after SSR
  if (!isNode) {
    _initializedUser = requestInitializeUser()
    handleAuthRouting()
  }
})

onEvent("invalid-user-token", () => {
  setUser({ user: null, current: true })
})

// Utility function that calls a callback when the user is set initially
// If due to route change then initialized var is set and its called immediately
export async function userInitialized(
  callback?: Function
): Promise<FactorUser | undefined> {
  const user = await _initializedUser

  if (callback) callback(user)

  return user
}

async function requestInitializeUser(): Promise<FactorUser | undefined> {
  await appMounted()
  const resolvedUser = await retrieveAndSetCurrentUser()

  await runCallbacks("before-user-init", resolvedUser)

  return resolvedUser
}

async function retrieveAndSetCurrentUser(
  userCredential?: FactorUserCredential
): Promise<FactorUser | undefined> {
  let token
  let user

  if (userCredential && userCredential.token) {
    token = userCredential.token
  } else if (userToken()) {
    token = userToken()
  }

  try {
    if (token) {
      user = await requestPostSingle({ token })

      setUser({ user, token, current: true })
    }
  } catch (error) {
    handleTokenError(error, { onError: () => log.error(error) })
  }

  return user
}

export function isCurrentUser(_id: string): boolean {
  const current = currentUser()
  return current && current._id === _id ? true : false
}

export function userId(): string {
  const current = currentUser()
  return current && current._id ? current._id : ""
}

export function isLoggedIn(): boolean {
  return !isEmpty(currentUser())
}

export function isEmailVerified(): boolean {
  const current = currentUser()
  return current && current.emailVerified ? true : false
}

async function sendUserRequest(method: string, params: object): Promise<unknown> {
  return await endpointRequest({ id: "user", method, params })
}

export async function authenticate(
  params: AuthenticationParameters
): Promise<FactorUserCredential> {
  const user = (await sendUserRequest("authenticate", params)) as FactorUserCredential

  await runCallbacks("authenticated", user)

  if (user && user.token) {
    requestPostPopulate({ posts: [user] })
    setUser({ user, token: user.token, current: true })
  }

  return user
}

export async function logout(args: { redirect?: string } = {}): Promise<void> {
  setUser({ user: null, current: true })
  emitEvent("logout")
  emitEvent("notify", "Successfully logged out.")

  if (args.redirect || currentRoute().matched.some((r) => r.meta.auth)) {
    const { redirect: path = "/" } = args
    navigateToRoute({ path })
  } else {
    emitEvent("reset-ui")
  }
}

// Set persistent user info
export function setUser({ user, token = "", current = false }): void {
  if (current) {
    _initializedUser = user ? user : {}

    if (token && user) userToken(token)
    else if (user === null) userToken(null)

    storeItem("currentUser", user)

    // In certain environments (testing) and with high privacy settings, localStorage is unset
    if (localStorage) {
      localStorage[user ? "setItem" : "removeItem"]("user", JSON.stringify(user))
    }
  }

  if (user && user._id) storeItem(user._id, user)
}

// Very basic version for UI control by  role
// Needs improvement for more fine grained control
export function userCan({
  role = "",
  accessLevel = -1
}: {
  role?: string;
  accessLevel?: number;
}): boolean {
  const current = currentUser()
  const userAccessLevel = current && current.accessLevel ? current.accessLevel : 0
  const roleAccessLevel = role ? userRolesMap[role] : 1000
  if (accessLevel >= 0 && userAccessLevel >= accessLevel) {
    return true
  } else if (role && userAccessLevel >= roleAccessLevel) {
    return true
  } else {
    return false
  }
}

function handleAuthRouting(): void {
  addCallback("client-route-before", async ({ to, next }: RouteGuard) => {
    const user = await userInitialized()
    const { path: toPath } = to

    // Is authentication needed
    const auth = to.matched.some((_r) => {
      return _r.meta.auth
    })

    if (auth === true && !user) {
      emitEvent("sign-in-modal", { redirect: toPath })
      next(false)
    }
  })

  addCallback("before-user-init", (user: FactorUser | undefined) => {
    const { path, matched } = currentRoute()
    const auth = matched.some((_r) => _r.meta.auth)

    if (auth === true && (!user || !user._id)) {
      navigateToRoute({ path: "/signin", query: { redirect: path } })
    }
  })
}
