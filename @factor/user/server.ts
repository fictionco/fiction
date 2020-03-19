import { getModel, dbIsOffline } from "@factor/post/database"
import { pushToFilter, applyFilters, addCallback } from "@factor/api"
import * as endpointHandler from "@factor/user/server"
import { Model, Document } from "mongoose"
import { addEndpoint } from "@factor/api/endpoints"
import { emitEvent } from "@factor/api/events"
import { userCredential } from "./jwt"
import {
  FactorUser,
  userRolesMap,
  UserRoles,
  FactorUserCredential,
  AuthenticationParameters
} from "./types"

import "./hooks-universal"

/**
 * Gets the post model associated with user post type
 */
export const getUserModel = <T = FactorUser>(): Model<T & Document> => {
  return getModel<T>("user")
}

/**
 * Authenticates users, signing them up if newAccount is set
 * @param params - authentication information
 */
export const authenticate = async (
  params: AuthenticationParameters
): Promise<FactorUserCredential | undefined> => {
  if (dbIsOffline()) {
    throw new Error(`Can't authenticate user, DB is offline.`)
  }

  const { newAccount, email, password, displayName, noVerify } = params

  let user
  if (newAccount) {
    try {
      const Model = getUserModel()

      user = new Model({
        email,
        password,
        displayName
      })

      // Disable email verification hook
      if (noVerify && user) {
        user.$locals.noVerify = noVerify
      }

      user = await user.save()
    } catch (error) {
      const e =
        error.code == 11000 ? `Account with email: "${email}" already exists.` : error
      throw new Error(e)
    }

    applyFilters("create-new-user", user)

    emitEvent("new-account-created", user)

    return userCredential(user)
  } else {
    user = await getUserModel().findOne({ email }, "+password")

    if (!user) {
      throw new Error(`Couldn't find user.`)
    }

    const compareResult =
      user && user.comparePassword ? await user.comparePassword(password) : false

    if (!compareResult) {
      throw new Error("Incorrect Login Information.")
    } else {
      user.signedInAt = Date.now()
      await user.save()

      return userCredential(user)
    }
  }
}

export const createNewAdminUser = async (
  params: AuthenticationParameters
): Promise<FactorUser | undefined> => {
  const createdUser = await authenticate({ ...params, newAccount: true, noVerify: true })

  if (!createdUser) throw new Error("Could not create user")

  const user = await getUserModel().findById(createdUser._id)

  if (user == null) throw new Error("User missing")

  if (user) {
    user.emailVerified = true
    user.role = UserRoles.Admin
    user.accessLevel = userRolesMap[user.role as UserRoles] || 0
    await user.save()
  }

  return userCredential(user)
}

export const setup = (): void => {
  addCallback({
    hook: "environment-created",
    key: "verifyToken",
    callback: () => {
      /**
       * Add user setup to CLI
       */
      if (!process.env.TOKEN_SECRET) {
        pushToFilter({
          key: "jwt",
          hook: "setup-needed",
          item: {
            title: "Token Secret",
            value:
              "A random JWT token secret is needed to encode user authentication information.",
            file: ".env",
            name: "TOKEN_SECRET"
          }
        })
      }
    }
  })

  /**
   * Adds the user handling endpoint
   */
  addEndpoint({ id: "user", handler: endpointHandler })
}
setup()
