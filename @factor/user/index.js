import { endpointRequest } from "@factor/endpoint"
import { requestPostSingle } from "@factor/post"

import {
  isEmpty,
  isNode,
  emitEvent,
  addFilter,
  runCallbacks,
  addCallback,
  stored,
  storeItem,
  log
} from "@factor/tools"

import "./hooks-universal"
import "./edit-account"
import Factor from "@factor/core"
import { appMounted } from "@factor/app"
export * from "./email-request"

let _initializedUser

addFilter("before-app", () => {
  // Authentication events only work after SSR
  if (!isNode) {
    _initializedUser = requestInitializeUser()
    handleAuthRouting()
  }
})

// Utility function that calls a callback when the user is set initially
// If due to route change then initialized var is set and its called immediately
export async function userInitialized(callback) {
  const user = await _initializedUser

  if (callback) callback(user)

  return user
}

async function requestInitializeUser(user) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      let resolvedUser

      if (currentUser()._id && !user) {
        resolvedUser = currentUser()
      } else {
        await appMounted()

        resolvedUser = await retrieveAndSetCurrentUser(user)
      }

      await runCallbacks("before-user-init", resolvedUser)

      resolve(resolvedUser)
    } catch (error) {
      reject(error)
    }
  })
}

async function retrieveAndSetCurrentUser(user) {
  const token = user && user.token ? user.token : (userToken() ? userToken() : null)

  try {
    user = token ? await requestPostSingle({ token }) : {}

    setUser({ user, token, current: true })

    return user
  } catch (error) {
    if (!handleTokenError(error)) {
      log.error(error)
    }
  }
}

export function isCurrentUser(_id) {
  return currentUser()._id == _id ? true : false
}

export function userId() {
  return currentUser() && currentUser()._id ? currentUser()._id : ""
}

export function currentUser() {
  return stored("currentUser") || {}
}

export function isLoggedIn() {
  return !isEmpty(currentUser())
}

export function isEmailVerified() {
  return currentUser().emailVerified ? true : false
}

async function sendUserRequest(method, params) {
  return await endpointRequest({ id: "user", method, params })
}

export async function authenticate(params) {
  let user = await sendUserRequest("authenticate", params)

  await runCallbacks("authenticated", user)

  if (user && user.token) {
    setUser({ user, token: user.token, current: true })
  }

  return user
}

export async function logout(args = {}) {
  setUser({ user: null, current: true })
  emitEvent("logout")
  emitEvent("notify", "Successfully logged out.")

  if (args.redirect || Factor.$router.currentRoute.matched.some(r => r.meta.auth)) {
    const { redirect: path = "/" } = args
    Factor.$router.push({ path })
  } else {
    emitEvent("reset-ui")
  }
}

export async function sendPasswordReset({ email }) {
  return await sendUserRequest("passwordReset", { email })
}

export async function sendEmailVerification({ email }) {
  return await sendUserRequest("verifyEmail", { email })
}

function setUser({ user, token, current = false }) {
  const { _id } = user ? user : {}

  if (current) {
    if (token && user) userToken(token)
    else if (user === null) userToken(null)

    storeItem("currentUser", user)
    localStorage[user ? "setItem" : "removeItem"]("user", JSON.stringify(user))
  }

  storeItem(_id, user)
}

export function userToken(token) {
  if (typeof localStorage == "undefined" || !localStorage) {
    return ""
  }
  const keyName = "token"
  if (token === false || token === null) {
    localStorage.removeItem(keyName)
  } else if (token) {
    localStorage.setItem(keyName, JSON.stringify({ token }))
  } else {
    const v = localStorage.getItem(keyName)
    return v ? JSON.parse(v).token : ""
  }
}

export function handleTokenError(error) {
  // If JWT auth fails then delete token, etc.
  if (error && error.includes("JsonWebTokenError: invalid signature")) {
    setUser({ user: null, current: true })
    return true
  } else {
    return false
  }
}
// Very basic version of this function for MVP dev
// Needs improvement for more fine grained control
export function userCan({ role, accessLevel }) {
  const userAccessLevel = currentUser().accessLevel
  const roleAccessLevel = role ? roles()[role] : 1000
  if (accessLevel && userAccessLevel >= accessLevel) {
    return true
  } else if (role && userAccessLevel >= roleAccessLevel) {
    return true
  } else {
    return false
  }
}

function handleAuthRouting() {
  addCallback("client-route-before", async ({ to, next }) => {
    const user = await userInitialized() //currentUser()
    const { path: toPath } = to

    // Is authentication needed
    const auth = to.matched.some(_r => {
      return _r.meta.auth
    })

    // Get accessLevel needed
    // eslint-disable-next-line no-unused-vars
    let accessLevel
    to.matched.forEach(_r => {
      if (_r.meta.accessLevel) {
        accessLevel = _r.meta.accessLevel
      }
    })

    if (auth === true && !user._id) {
      emitEvent("sign-in-modal", { redirect: toPath })
      next(false)
    }
  })

  addCallback("before-user-init", user => {
    const { path, matched } = Factor.$router.currentRoute
    const auth = matched.some(_r => _r.meta.auth)

    if (auth === true && (!user || !user._id)) {
      Factor.$router.push({ path: "/signin", query: { redirect: path } })
    }
  })
}

export function roles() {
  return require("./roles.json")
}
