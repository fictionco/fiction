import jwt from "jsonwebtoken"
import log from "@factor/api/logger"
import { FactorUser, FactorUserAuthentication, FactorUserCredential } from "./types"

/**
 * Returns a user authentication credential including token for storage in client
 * @param user - the user who's been authenticated
 *
 * @returns credential including the client token
 */
export const userCredential = (
  user: FactorUserAuthentication
): FactorUserCredential | undefined => {
  if (!user) {
    return
  }

  let tokenSecret = process.env.TOKEN_SECRET

  if (!tokenSecret) {
    log.warn(
      "Security Problem: TOKEN_SECRET is not set in environment variables. Without this secret key, users can login with any account."
    )
    tokenSecret = "DEFAULT_TOKEN_KEY"
  }

  const credentialUser = user.toObject()

  delete credentialUser.password

  return {
    ...credentialUser,
    token: jwt.sign({ _id: user._id }, tokenSecret)
  }
}

/**
 * Take a JWT token and decode into the associated user _id
 * @param token
 */
export const decodeTokenIntoUser = (token: string): FactorUser => {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("Can't decode token. No TOKEN_SECRET is set.")
  }

  try {
    return jwt.verify(token, process.env.TOKEN_SECRET) as FactorUser
  } catch (error) {
    throw new Error(error)
  }
}
