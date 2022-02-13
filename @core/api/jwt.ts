import { FullUser, PrivateUser } from "@factor/types"
import jwt from "jsonwebtoken"
import { setCookie, getCookie, removeCookie } from "./cookie"
import { _stop } from "./error"
import { logger } from "./logger"
/**
 * Gets, Sets or Destroys the user JWT token out of local storage
 */
export const clientToken = (
  args: {
    action?: "set" | "get" | "destroy"
    token?: string
  } = {},
): string | undefined => {
  if (typeof localStorage == "undefined" || !localStorage) {
    return
  }
  const domain =
    process.env.NODE_ENV == "production" ? window.location.hostname : undefined

  const { action = "get", token } = args
  const TOKEN_KEY = "ffUser"
  if (action === "destroy") {
    removeCookie(TOKEN_KEY, { domain })
    //localStorage.removeItem(TOKEN_KEY)
  } else if (action == "set" && token) {
    setCookie(TOKEN_KEY, token, { expires: 14, domain })
    // localStorage.setItem(TOKEN_KEY, token)
  } else {
    // let localValue = localStorage.getItem(TOKEN_KEY)
    const cookieValue = getCookie(TOKEN_KEY)
    // if (!localValue && cookieValue) {
    //   localStorage.setItem(TOKEN_KEY, cookieValue)
    //   localValue = cookieValue
    // }
    return cookieValue ? cookieValue : ""
  }
}

export type TokenFields = Partial<PrivateUser> & { userId: string }
/**
 * Sets the auth token secret or falls back to a basic one (insecure)
 */
const getTokenSecret = (): string => {
  const secret = process.env.TOKEN_SECRET || process.env.FACTOR_TOKEN_SECRET
  if (!secret) {
    logger.log({
      level: "warn",
      description: "JWT token secret is missing (TOKEN_SECRET)",
      context: "auth",
    })
  }

  return secret ?? "INSECURE"
}
/**
 * Returns a user authentication credential including token for storage in client
 */
export const createClientToken = (user: Partial<FullUser>): string => {
  const { role = "", userId, email } = user
  return jwt.sign({ role, userId, email }, getTokenSecret())
}
/**
 * Take a JWT token and decode into the associated user _id
 */
export const decodeClientToken = (token: string): TokenFields => {
  const r = jwt.verify(token, getTokenSecret()) as TokenFields

  if (!r.userId || !r.email) {
    throw _stop({ message: "token error", code: "TOKEN_ERROR" })
  }

  return r
}
