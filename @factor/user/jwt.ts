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

export function decodeToken(token: string): FactorUser | {} {
  if (!process.env.TOKEN_SECRET) return {}

  try {
    return jwt.verify(token, process.env.TOKEN_SECRET)
  } catch (error) {
    throw new Error(error)
  }
}
