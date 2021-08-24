import { _stop } from "@factor/api"
import { nLog } from "@factor/server-utils"
import { FullUser } from "@factor/types"
import jwt from "jsonwebtoken"
interface TokenFields {
  userId: number
  email: string
  role: string
}
/**
 * Sets the auth token secret or falls back to a basic one (insecure)
 */
const getTokenSecret = (): string => {
  const secret = process.env.TOKEN_SECRET || process.env.FACTOR_TOKEN_SECRET
  if (!secret) {
    nLog("warn", "JWT token secret is missing (FACTOR_TOKEN_SECRET)")
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