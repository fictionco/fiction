/* eslint-disable @typescript-eslint/no-use-before-define */
import bcrypt from "bcrypt"
import dayjs from "dayjs"
import { createClientToken, decodeClientToken } from "../jwt"
import { EndpointResponse, FactorTable, FullUser } from "../types"
import { _stop } from "../error"
import { runProcessors } from "../processor"
import { validateEmail, snakeCase } from "../utils"
import { logger } from "../logger"

import { runHooks } from "../engine/hook"
import { getUserConfig } from "../engine/plugins"
import { getDb } from "../engine/db"

import { EndpointMeta } from "../engine/endpoint"

import { Query } from "../engine/query"
import {
  getPublicUserFields,
  getJsonUserFields,
  getEditableUserFields,
} from "./userClient"

/**
 * A random 6 digit number, ideal for verification code
 */
const getSixDigitRandom = (): string => {
  return Math.random().toString().slice(2, 8)
}
/**
 * Create a md5 of password
 * @remarks
 * 6 salt rounds - https://security.stackexchange.com/a/83382
 */
const hashPassword = async (password?: string): Promise<string | undefined> => {
  return password ? await bcrypt.hash(password, 6) : undefined
}
const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

type ProcessorMeta = { params?: ManageUserParams; meta?: EndpointMeta }

/**
 * Add user data about the current user
 */
const processUser = async (
  user: FullUser,
  meta: ProcessorMeta,
): Promise<FullUser> => {
  const config = getUserConfig()

  const processors = config?.userProcessors ?? []

  if (processors && processors.length > 0) {
    const result = await runProcessors<FullUser, ProcessorMeta>(
      processors,
      user,
      meta,
    )
    return result
  } else {
    return user
  }
}

/**
 * Verify a new user email is valid and unique
 */
export const verifyNewEmail = async (email?: string): Promise<true> => {
  if (!email) throw _stop({ message: "email is required" })
  if (!validateEmail(email)) throw _stop({ message: "email failed validation" })

  const { data: exists } = await Queries.ManageUser.serve(
    {
      _action: "getPublic",
      email,
    },
    {},
  )

  if (exists) {
    throw _stop({ message: "email already exists", data: { email } })
  }

  return true
}

// abstract class QueryUser extends Query {
//   async serveRequest(
//     params: Parameters<this["run"]>[0],
//     meta: EndpointMeta,
//   ): Promise<Awaited<ReturnType<this["run"]>>> {
//     const result = await this.serve(params, meta)

//     if (result.status == "success") {
//       const r = result as Awaited<ReturnType<this["run"]>>

//       return r
//     }

//     return result as Awaited<ReturnType<this["run"]>>
//   }
// }

const checkServerFields = (
  fields: Partial<FullUser>,
  _meta: EndpointMeta = {},
): void => {
  if (
    !_meta?.server &&
    (fields.emailVerified || fields.googleId || fields.hashedPassword)
  ) {
    throw _stop({
      message: "server meta required for fields",
      data: { fields },
    })
  }
}

export type ManageUserParams =
  | {
      _action: "create"
      fields: {
        email: string
        password?: string
        fullName?: string
        firstName?: string
        lastName?: string
        googleId?: string
        emailVerified?: boolean
        picture?: string
        invitedBy?: string
      }
    }
  | ({
      _action: "update"
      fields: Partial<FullUser>
      email?: string
      userId?: string
    } & ({ email: string } | { userId: string }))
  | ({
      _action: "getPrivate" | "getPublic"
      select?: (keyof FullUser)[] | ["*"]
      email?: string
      userId?: string
    } & ({ email: string } | { userId: string }))

type ManageUserResponse = EndpointResponse<FullUser> & {
  isNew: boolean
  token?: string
  user?: FullUser
}
class QueryManageUser extends Query {
  async run(
    params: ManageUserParams,
    _meta?: EndpointMeta,
  ): Promise<ManageUserResponse> {
    const { _action } = params

    const db = await this.getDb()

    let user: FullUser | undefined

    const publicFields = getPublicUserFields()

    let isNew = false
    let token: string | undefined = undefined

    if (_action == "getPrivate" || _action == "getPublic") {
      const { userId, email } = params
      const where = userId ? { userId } : { email }

      const returnFields = _action == "getPrivate" ? ["*"] : publicFields

      user = await db
        .select(...returnFields)
        .from(FactorTable.User)
        .where(where)
        .first<FullUser>()

      if (user && _action == "getPublic") {
        delete user?.hashedPassword
      }
    } else if (_action == "update") {
      const { email, userId, fields } = params
      if (!fields || (!email && !userId)) {
        throw this.stop("update user requires email, or user, and fields")
      }

      checkServerFields(fields, _meta)

      const where = userId ? { userId } : { email }

      ;[user] = await db(FactorTable.User)
        .update(fields)
        .where(where)
        .returning<FullUser[]>("*")

      if (!user) {
        throw this.stop({
          message: "user not found",
          data: where,
        })
      }
    } else if (_action == "create") {
      const { fields } = params

      if (!fields) throw this.stop("fields required")

      const {
        email,
        fullName,
        firstName,
        lastName,
        password,
        googleId,
        emailVerified = false,
        picture,
      } = fields

      checkServerFields(fields, _meta)

      const hashedPassword = await hashPassword(password)

      if (!email) throw this.stop("email required")

      if (!emailVerified) await verifyNewEmail(email)
      ;[user] = await db
        .insert({
          email,
          fullName,
          firstName,
          lastName,
          googleId,
          emailVerified,
          hashedPassword,
          picture,
          verificationCode: getSixDigitRandom(),
          codeExpiresAt: dayjs().add(7, "day").toISOString(),
        })
        .into(FactorTable.User)
        .returning<FullUser[]>("*")

      if (!user) throw this.stop("problem creating user")
      token = createClientToken(user)
      isNew = true
    }

    if (
      user &&
      (_action == "getPrivate" || _action == "update" || _action == "create")
    ) {
      user = await processUser(user, { params, meta: _meta })
    }

    // don't return authority info to client
    delete user?.verificationCode

    const response: ManageUserResponse = {
      status: "success",
      data: user,
      isNew,
      token,
    }

    if (_meta?.bearer && _meta?.bearer.userId == user?.userId) {
      response.user = user
    }

    return response
  }
}

class QueryCurrentUser extends Query {
  async run(params: { token: string }): Promise<EndpointResponse<FullUser>> {
    const { token } = params

    if (!token) throw this.stop("auth info not sent (token)")

    const { email } = decodeClientToken(token)

    if (!email) throw this.stop("email missing in token")

    let user: FullUser | undefined
    try {
      const r = await Queries.ManageUser.serve(
        {
          _action: "update",
          email,
          fields: { lastSeen: dayjs().toISOString() },
        },
        { server: true },
      )
      user = r.data
    } catch (error) {
      throw { ...(error as Error), code: "TOKEN_ERROR" }
    }

    return { status: "success", data: user }
  }
}

/**
 * Send a verification email with code
 */
export const sendVerificationEmail = async (args: {
  email: string
  code: string | number
}): Promise<void> => {
  const { sendEmail } = await import("../engine/email")
  const { code, email } = args
  await sendEmail({
    subject: `${code} is your verification code`,
    text: `This email is to verify your account using a one-time code.\n\n Your code is: **${code}**`,
    to: email,
  })
}

/**
 * Create a verification code, save it to user and email the user with the code
 */
export const sendOneTimeCode = async (params: {
  email: string
}): Promise<string> => {
  const { email } = params

  const code = getSixDigitRandom()
  const fields = {
    verificationCode: code,
    codeExpiresAt: dayjs().add(1, "day").toISOString(),
  }

  await Queries.ManageUser.serve(
    { _action: "update", email, fields },
    { server: true },
  )

  await sendVerificationEmail({ email, code })

  return code
}
class QuerySendOneTimeCode extends Query {
  async run(params: { email: string }): Promise<EndpointResponse<boolean>> {
    await sendOneTimeCode(params)

    return { status: "success", data: true }
  }
}

/**
 * Verify if a passed code matches the stored one
 */
export const verifyCode = async (args: {
  email?: string
  userId?: string
  verificationCode: string
}): Promise<true> => {
  const { email, verificationCode, userId } = args

  if (!verificationCode) {
    throw _stop({ message: `no code provided` })
  }
  if (!email && !userId) {
    throw _stop({ message: `need email or userId` })
  }

  const where = userId ? { userId } : { email }

  const db = await getDb()
  const r = await db
    .select<{ verificationCode: string; codeExpiresAt: string }[]>([
      "verificationCode",
      "codeExpiresAt",
    ])
    .from(FactorTable.User)
    .where(where)

  const codeDetails = r && r.length > 0 ? r[0] : undefined

  // allow short circuit in development
  if (process.env.NODE_ENV !== "production" && verificationCode == "test") {
    return true
  }

  if (!codeDetails || codeDetails.verificationCode !== verificationCode) {
    throw _stop({
      message: `verification code is not a match (${process.env.NODE_ENV})`,
    })
  } else if (
    !codeDetails.codeExpiresAt ||
    dayjs().isAfter(codeDetails.codeExpiresAt)
  ) {
    throw _stop({ message: `verification code is expired` })
  }

  return true
}

/**
 * Updates the current user with new info
 * Detecting if auth fields have changed and verifying account code
 */
class QueryUpdateCurrentUser extends Query {
  async run(
    params: Partial<FullUser> & { password?: string },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<FullUser> & { token?: string }> {
    if (!this.qu) throw new Error("no knex")
    if (!meta.bearer) throw this.stop({ message: "must be logged in" })

    const { email, userId, password, verificationCode } = params
    const { bearer } = meta

    if (!bearer || !bearer.email) throw this.stop("bearer email required")

    let fields: Partial<FullUser> = {}

    for (const f of getEditableUserFields()) {
      if (typeof params[f] != "undefined") {
        fields = { ...fields, [f]: params[f] }
      }
    }

    for (const f of getJsonUserFields()) {
      if (typeof params[f] != "undefined") {
        const jsn = JSON.stringify(params[f])

        const setter = this.qu.raw(
          `coalesce(${snakeCase(f)}::jsonb, '{}'::jsonb) || ?::jsonb`,
          jsn,
        )

        fields = { ...fields, [f]: setter }
      }
    }

    if (password) {
      const hashedPassword = await hashPassword(password)

      const { data: dbUser } = await Queries.ManageUser.serve(
        {
          _action: "getPrivate",
          userId: bearer.userId,
        },
        meta,
      )

      if (!dbUser) throw this.stop({ message: "couldn't find user" })

      const correctPassword = await comparePassword(
        password,
        dbUser.hashedPassword ?? "",
      )

      if (verificationCode) {
        await verifyCode({ email, userId, verificationCode })
      }

      if (!correctPassword && !verificationCode) {
        throw this.stop({ message: "account verification required" })
      }

      if (email && email != dbUser.email) {
        await verifyNewEmail(email)

        fields.email = email
      } else {
        fields.hashedPassword = hashedPassword
      }
    }

    let user, token
    if (Object.keys(fields).length > 0) {
      const response = await Queries.ManageUser.serve(
        {
          _action: "update",
          email: bearer.email,
          fields,
        },
        meta,
      )

      user = response.data

      if (!user) throw this.stop("problem updating user")

      // if email or password were changed, create new token
      token = password ? createClientToken(user) : undefined
    }

    return {
      status: "success",
      data: user,
      message: "changes saved",
      token,
      user,
    }
  }
}

class QuerySetPassword extends Query {
  async run(
    params: {
      password: string
      email: string
      verificationCode: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<FullUser> & { token: string }> {
    if (!meta.bearer) throw this.stop({ message: "must be logged in" })

    const { password, email: emailArg, verificationCode } = params

    const email = emailArg ?? meta.bearer.email

    if (!email) throw this.stop(`email must be verified to set new password`)
    if (!password) throw this.stop(`password required`)

    // code verification is needed because on password reset the user is logged out
    await verifyCode({ email, verificationCode })
    const hashedPassword = await hashPassword(password)

    const { data: user } = await Queries.ManageUser.serve(
      {
        _action: "update",
        email,
        fields: { hashedPassword },
      },
      { ...meta, server: true },
    )

    if (!user) throw this.stop("problem updating user")

    user.hashedPassword = hashedPassword

    return {
      status: "success",
      data: user,
      message: "new password created",
      token: createClientToken(user),
      user,
    }
  }
}

class QueryVerifyAccountEmail extends Query {
  async run(params: {
    email: string
    verificationCode: string
  }): Promise<EndpointResponse<FullUser>> {
    if (!this.qu) throw new Error("no knex")

    const { email, verificationCode } = params

    if (!email) throw _stop({ message: "email is required" })
    if (!verificationCode) throw _stop({ message: "confirm code is required" })

    await verifyCode({ email, verificationCode })

    const { data: user } = await Queries.ManageUser.serve(
      {
        _action: "update",
        email,
        fields: { emailVerified: true },
      },
      { server: true },
    )

    if (!user) throw this.stop("problem updating user")

    // send it back for convenience
    user.verificationCode = verificationCode

    await runHooks("onUserVerified", user)

    logger.log({
      level: "info",
      context: "QueryVerifyAccountEmail",
      description: `user verified ${email}`,
    })

    delete user?.verificationCode

    return {
      status: "success",
      data: user,
      message: "verification successful",
      token: createClientToken(user),
    }
  }
}

class QueryResetPassword extends Query {
  async run({
    email,
  }: {
    email: string
  }): Promise<EndpointResponse<FullUser> & { internal: string }> {
    if (!email) throw this.stop({ message: "email is required" })

    const code = await sendOneTimeCode({ email })

    return {
      status: "success",
      message: "verification code sent",
      internal: code,
    }
  }
}

class QueryStartNewUser extends Query {
  async run(params: { email: string; fullName?: string }): Promise<
    EndpointResponse<Partial<FullUser>> & {
      token: string
      user: FullUser
    }
  > {
    if (!this.qu) throw new Error("no knex")

    const { email, fullName } = params
    const { data: user } = await Queries.ManageUser.serve(
      {
        _action: "create",
        fields: { email, fullName },
      },
      undefined,
    )

    if (!user) throw this.stop("problem creating user")

    await sendOneTimeCode({ email: user.email })

    logger.log({
      level: "info",
      context: "QueryStartNewUser",
      description: `user started ${email}:${fullName ?? "(no name)"}`,
    })

    return {
      status: "success",
      data: { userId: user.userId, fullName: user.fullName, email: user.email },
      message: "verification code sent",
      user,
      token: createClientToken(user),
    }
  }
}

type LoginResponse = Promise<
  EndpointResponse<FullUser> & {
    token: string
    user: FullUser
    next?: "verify"
  }
>

class QueryLogin extends Query {
  public async run(
    params: {
      email: string
      password?: string
      googleId?: string
      emailVerified?: boolean
    },
    _meta: EndpointMeta,
  ): LoginResponse {
    const { email, password, googleId, emailVerified } = params
    const { data: user } = await Queries.ManageUser.serve(
      {
        _action: "getPrivate",
        email,
      },
      _meta,
    )

    let message = ""

    if (!user) throw this.stop({ message: "user does not exist" })

    if (googleId && _meta.server) {
      if (!user.googleId && emailVerified) {
        await Queries.ManageUser.serve(
          {
            _action: "update",
            email,
            fields: { googleId, emailVerified },
          },
          _meta,
        )
        message = "linked google account"
      } else if (user.googleId != googleId) {
        throw this.stop({ message: "user linked to another google account" })
      }
    } else if (password) {
      if (!user.hashedPassword) throw this.stop({ message: "password error" })

      const correctPassword = await comparePassword(
        password,
        user.hashedPassword ?? "",
      )

      if (!correctPassword) {
        throw this.stop({ message: "password is incorrect" })
      }

      delete user.hashedPassword
    } else {
      throw this.stop({ message: "no auth provided" })
    }

    const token = createClientToken(user)

    if (!message) message = "successfully logged in"

    if (!user.emailVerified) {
      await sendOneTimeCode({ email: user.email })

      message = "verification email sent"
      return {
        status: "success",
        data: user,
        message,
        next: "verify",
        token,
        user,
      }
    }

    logger.log({
      level: "info",
      context: "QueryLogin",
      description: `user logged in ${email}`,
    })

    return {
      status: "success",
      data: user,
      message,
      token,
      user,
    }
  }
}

class QueryNewVerificationCode extends Query {
  async run(
    params: {
      email: string
      newAccount?: boolean
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<{ exists: boolean }>> {
    if (!this.qu) throw new Error("no knex")

    const { email, newAccount } = params

    let { data: existingUser } = await Queries.ManageUser.serve(
      {
        _action: "getPrivate",
        email,
      },
      meta,
    )

    const exists = existingUser ? true : false

    if (newAccount && exists) {
      throw this.stop({ message: "email exists", data: { exists } })
    } else if (!existingUser) {
      const { data: createdUser } = await Queries.ManageUser.serve(
        {
          _action: "create",
          fields: { email },
        },
        meta,
      )

      existingUser = createdUser

      logger.log({
        level: "info",
        context: "user",
        description: `user created ${email}`,
      })
    }

    if (!existingUser) throw this.stop("no user")

    await sendOneTimeCode({ email: existingUser.email })

    return {
      status: "success",
      data: { exists },
      message: "verification code sent",
    }
  }
}

export const Queries = {
  Login: new QueryLogin(),
  NewVerificationCode: new QueryNewVerificationCode(),
  SetPassword: new QuerySetPassword(),
  ResetPassword: new QueryResetPassword(),
  UpdateCurrentUser: new QueryUpdateCurrentUser(),
  SendOneTimeCode: new QuerySendOneTimeCode(),
  VerifyAccountEmail: new QueryVerifyAccountEmail(),
  StartNewUser: new QueryStartNewUser(),
  CurrentUser: new QueryCurrentUser(),
  ManageUser: new QueryManageUser(),
}
