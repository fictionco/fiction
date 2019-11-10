import jwt from "jsonwebtoken"

export function userCredential(user) {
  if (!user) {
    return {}
  }
  user = user.toObject()
  delete user.password
  return {
    ...user,
    token: jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
  }
}

export function decodeToken(token) {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET)
  } catch (error) {
    throw new Error(error)
  }
}
