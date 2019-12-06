import { getModel } from "@factor/post/database"
import { pushToFilter, applyFilters, addCallback } from "@factor/tools"
import * as endpointHandler from "@factor/user/server"
import { Model, Document } from "mongoose"

import { userCredential } from "./jwt"
import { FactorUserCredential, AuthenticationParameters, FactorUser } from "./types"
import "./hooks-universal"

if (!process.env.TOKEN_SECRET) {
  pushToFilter("setup-needed", {
    title: "JWT Secret",
    value: "A JWT string secret, used for verifying authentication status.",
    location: ".env/TOKEN_SECRET"
  })
}

addCallback("endpoints", { id: "user", handler: endpointHandler })

export function getUserModel(): Model<FactorUser & Document> {
  return getModel<FactorUser>("user")
}

export async function authenticate(
  params: AuthenticationParameters
): Promise<FactorUserCredential | {}> {
  const { newAccount, email, password, displayName } = params

  let user
  if (newAccount) {
    try {
      user = await getUserModel().create({
        email,
        password,
        displayName
      })
    } catch (error) {
      const e =
        error.code == 11000 ? `Account with email: "${email}" already exists.` : error
      throw new Error(e)
    }

    applyFilters("create-new-user", user)
    return userCredential(user)
  } else {
    user = await getUserModel().findOne({ email }, "+password")

    if (!user) {
      throw new Error(`Couldn't find user.`)
    }

    const compareResult = user ? await user.comparePassword(password) : false

    if (!compareResult) {
      throw new Error("Incorrect Login Information.")
    } else {
      user.signedInAt = Date.now()
      await user.save()

      return userCredential(user)
    }
  }
}
