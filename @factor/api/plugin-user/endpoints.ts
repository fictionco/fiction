/* eslint-disable @typescript-eslint/no-use-before-define */
import bcrypt from "bcrypt"
import { dayjs } from "../utils/libraries"
import { validateEmail, snakeCase } from "../utils/utils"
import { EndpointResponse, FactorTable } from "../types"
import { _stop } from "../utils/error"
import { runHooks } from "../utils/hook"

import { EndpointMeta } from "../utils/endpoint"
import type { FactorDb } from "../plugin-db"
import { Query } from "../query"
import { FactorEmail } from "../plugin-email"
import { FullUser, FactorUserHookDictionary } from "./types"
import {
  getPublicUserFields,
  getJsonUserFields,
  getEditableUserFields,
} from "./utils"
import type { FactorUser } from "."

export abstract class UserQuery extends Query {
  factorUser: FactorUser
  factorEmail: FactorEmail
  factorDb: FactorDb
  constructor(settings: {
    factorUser: FactorUser
    factorDb: FactorDb
    factorEmail: FactorEmail
  }) {
    super()

    this.factorUser = settings.factorUser
    this.factorEmail = settings.factorEmail
    this.factorDb = settings.factorDb
  }
}

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

/**
 * Verify a new user email is valid and unique
 */
export const verifyNewEmail = async (params: {
  email?: string
  factorUser: FactorUser
}): Promise<true> => {
  const { email, factorUser } = params
  if (!email) throw _stop({ message: "email is required" })
  if (!validateEmail(email)) throw _stop({ message: "email failed validation" })

  const { data: exists } = await factorUser.queries.ManageUser.serve(
    {
      _action: "getPublic",
      email,
    },
    { server: true },
  )

  if (exists) {
    throw _stop({ message: "email already exists", data: { email } })
  }

  return true
}

// abstract export class QueryUser extends UserQuery {
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
export class QueryManageUser extends UserQuery {
  async run(
    params: ManageUserParams,
    _meta?: EndpointMeta,
  ): Promise<ManageUserResponse> {
    const { _action } = params

    const db = this.factorDb.client()

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

      if (!emailVerified) {
        await verifyNewEmail({ email, factorUser: this.factorUser })
      }
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
          codeExpiresAt: this.utils.dayjs().add(7, "day").toISOString(),
        })
        .into(FactorTable.User)
        .returning<FullUser[]>("*")

      if (!user) throw this.stop("problem creating user")
      token = this.factorUser.createClientToken(user)
      isNew = true
    }

    if (
      user &&
      (_action == "getPrivate" || _action == "update" || _action == "create") &&
      _meta
    ) {
      user = await runHooks<FactorUserHookDictionary>({
        list: this.factorUser.hooks,
        hook: "processUser",
        args: [user, { params, meta: _meta }],
      })
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

export class QueryCurrentUser extends UserQuery {
  async run(params: { token: string }): Promise<EndpointResponse<FullUser>> {
    const { token } = params

    if (!token) throw this.stop("auth info not sent (token)")

    const { email } = this.factorUser.decodeClientToken(token)

    if (!email) throw this.stop("email missing in token")

    let user: FullUser | undefined
    try {
      const r = await this.factorUser.queries.ManageUser.serve(
        {
          _action: "update",
          email,
          fields: { lastSeen: this.utils.dayjs().toISOString() },
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
  factorEmail: FactorEmail
}): Promise<void> => {
  const { code, email, factorEmail } = args
  await factorEmail.sendEmail({
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
  factorUser: FactorUser
  factorEmail: FactorEmail
}): Promise<string> => {
  const { email, factorUser, factorEmail } = params

  const code = getSixDigitRandom()
  const fields = {
    verificationCode: code,
    codeExpiresAt: dayjs().add(1, "day").toISOString(),
  }

  await factorUser.queries.ManageUser.serve(
    { _action: "update", email, fields },
    { server: true },
  )

  await sendVerificationEmail({ email, code, factorEmail })

  return code
}
export class QuerySendOneTimeCode extends UserQuery {
  async run(params: { email: string }): Promise<EndpointResponse<boolean>> {
    await sendOneTimeCode({
      ...params,
      factorUser: this.factorUser,
      factorEmail: this.factorEmail,
    })

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
  factorDb: FactorDb
}): Promise<true> => {
  const { email, verificationCode, userId, factorDb } = args

  if (!verificationCode) {
    throw _stop({ message: `no code provided` })
  }
  if (!email && !userId) {
    throw _stop({ message: `need email or userId` })
  }

  const where = userId ? { userId } : { email }

  const db = factorDb.client()
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
export class QueryUpdateCurrentUser extends UserQuery {
  async run(
    params: Partial<FullUser> & { password?: string },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<FullUser> & { token?: string }> {
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

        const setter = this.factorDb
          .client()
          .raw(`coalesce(${snakeCase(f)}::jsonb, '{}'::jsonb) || ?::jsonb`, jsn)

        fields = { ...fields, [f]: setter }
      }
    }

    if (password) {
      const hashedPassword = await hashPassword(password)

      const { data: dbUser } = await this.factorUser.queries.ManageUser.serve(
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
        await verifyCode({
          email,
          userId,
          verificationCode,
          factorDb: this.factorDb,
        })
      }

      if (!correctPassword && !verificationCode) {
        throw this.stop({ message: "account verification required" })
      }

      if (email && email != dbUser.email) {
        await verifyNewEmail({ email, factorUser: this.factorUser })

        fields.email = email
      } else {
        fields.hashedPassword = hashedPassword
      }
    }

    let user, token
    if (Object.keys(fields).length > 0) {
      const response = await this.factorUser.queries.ManageUser.serve(
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
      token = password ? this.factorUser.createClientToken(user) : undefined
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

export class QuerySetPassword extends UserQuery {
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
    await verifyCode({ email, verificationCode, factorDb: this.factorDb })
    const hashedPassword = await hashPassword(password)

    const { data: user } = await this.factorUser.queries.ManageUser.serve(
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
      token: this.factorUser.createClientToken(user),
      user,
    }
  }
}

export class QueryVerifyAccountEmail extends UserQuery {
  async run(params: {
    email: string
    verificationCode: string
  }): Promise<EndpointResponse<FullUser>> {
    const { email, verificationCode } = params

    if (!email) throw this.stop({ message: "email is required" })
    if (!verificationCode) {
      throw this.stop({ message: "confirm code is required" })
    }

    await verifyCode({ email, verificationCode, factorDb: this.factorDb })

    const { data: user } = await this.factorUser.queries.ManageUser.serve(
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

    await runHooks<FactorUserHookDictionary>({
      list: this.factorUser.hooks,
      hook: "onUserVerified",
      args: [user],
    })

    this.log.info(`user verified ${email}`)

    delete user?.verificationCode

    return {
      status: "success",
      data: user,
      message: "verification successful",
      token: this.factorUser.createClientToken(user),
    }
  }
}

export class QueryResetPassword extends UserQuery {
  async run({
    email,
  }: {
    email: string
  }): Promise<EndpointResponse<FullUser> & { internal: string }> {
    if (!email) throw this.stop({ message: "email is required" })

    const code = await sendOneTimeCode({
      email,
      factorUser: this.factorUser,
      factorEmail: this.factorEmail,
    })

    return {
      status: "success",
      message: "verification code sent",
      internal: code,
    }
  }
}

export class QueryStartNewUser extends UserQuery {
  async run(params: { email: string; fullName?: string }): Promise<
    EndpointResponse<Partial<FullUser>> & {
      token: string
      user: FullUser
    }
  > {
    const { email, fullName } = params
    const { data: user } = await this.factorUser.queries.ManageUser.serve(
      {
        _action: "create",
        fields: { email, fullName },
      },
      undefined,
    )

    if (!user) throw this.stop("problem creating user")

    await sendOneTimeCode({
      email: user.email,
      factorUser: this.factorUser,
      factorEmail: this.factorEmail,
    })

    this.log.info(`user started ${email}:${fullName ?? "(no name)"}`)

    return {
      status: "success",
      data: { userId: user.userId, fullName: user.fullName, email: user.email },
      message: "verification code sent",
      user,
      token: this.factorUser.createClientToken(user),
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

export class QueryLogin extends UserQuery {
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
    const { data: user } = await this.factorUser.queries.ManageUser.serve(
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
        await this.factorUser.queries.ManageUser.serve(
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

    const token = this.factorUser.createClientToken(user)

    if (!message) message = "successfully logged in"

    if (!user.emailVerified) {
      await sendOneTimeCode({
        email: user.email,
        factorUser: this.factorUser,
        factorEmail: this.factorEmail,
      })

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

    this.log.info(`user logged in ${email}`)

    return {
      status: "success",
      data: user,
      message,
      token,
      user,
    }
  }
}

export class QueryNewVerificationCode extends UserQuery {
  async run(
    params: {
      email: string
      newAccount?: boolean
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<{ exists: boolean }>> {
    const { email, newAccount } = params

    let { data: existingUser } = await this.factorUser.queries.ManageUser.serve(
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
      const { data: createdUser } =
        await this.factorUser.queries.ManageUser.serve(
          {
            _action: "create",
            fields: { email },
          },
          meta,
        )

      existingUser = createdUser

      this.log.info(`user created ${email}`)
    }

    if (!existingUser) throw this.stop("no user")

    await sendOneTimeCode({
      email: existingUser.email,
      factorUser: this.factorUser,
      factorEmail: this.factorEmail,
    })

    return {
      status: "success",
      data: { exists },
      message: "verification code sent",
    }
  }
}
