import jwt from "jsonwebtoken"
import { FactorUser, FactorUserAuthentication, FactorUserCredential } from "./types"

export function userCredential(
  user: FactorUserAuthentication
): FactorUserCredential | {} {
  if (!user || !process.env.TOKEN_SECRET) return {}

  const credentialUser = user.toObject()

  delete credentialUser.password

  return {
    ...credentialUser,
    token: jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  }
}

export function decodeTokenIntoUser(token: string): FactorUser {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("Can't decode token. No TOKEN_SECRET is set.")
  }

  try {
    return jwt.verify(token, process.env.TOKEN_SECRET) as FactorUser
  } catch (error) {
    throw new Error(error)
  }
}
