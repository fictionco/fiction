/* eslint-disable @typescript-eslint/no-use-before-define */
import bcrypt from "bcrypt"
import { dayjs } from "../utils/libraries"
import { validateEmail } from "../utils/utils"
import { EndpointResponse, FactorTable } from "../types"
import { _stop } from "../utils/error"
import { runHooks } from "../utils/hook"

import { EndpointMeta } from "../utils/endpoint"
import type { FactorDb } from "../plugin-db"
import { Query } from "../query"
import { FactorEmail } from "../plugin-email"
import { FullUser, PublicUser } from "./types"
import type { FactorUserHookDictionary, FactorUser } from "."

type UserQuerySettings = {
  factorUser: FactorUser
  factorDb: FactorDb
  factorEmail?: FactorEmail
}
export abstract class UserQuery extends Query<UserQuerySettings> {
  factorUser = this.settings.factorUser
  factorEmail = this.settings.factorEmail
  factorDb = this.settings.factorDb
  constructor(settings: UserQuerySettings) {
    super(settings)
  }

  publicUserFieldKeys() {
    const cols = this.factorDb.getColumns("factor_user")

    return cols
      ?.map(({ key, isPrivate }) => (!isPrivate ? key : undefined))
      .filter(Boolean) as (keyof PublicUser)[]
  }

  prepareUserFields(
    type: "settings" | "internal" | "returnInfo",
    user?: Partial<FullUser>,
    meta?: EndpointMeta,
  ): Partial<FullUser> {
    if (!user || (!meta?.server && meta?.bearer?.userId !== user.userId)) {
      return {}
    }

    const out: Record<string, any> = {}

    const db = this.factorDb.client()

    const cols = this.factorDb.getColumns("factor_user")

    cols?.forEach(({ key, isSetting, isAuthority, prepare }) => {
      const k = key as keyof FullUser
      if ((type == "internal" || isSetting) && user[k]) {
        const value = user[k]
        out[key] = prepare ? prepare({ value, key, db }) : value
      } else if (
        type == "returnInfo" &&
        user[k] &&
        (!isAuthority || meta?.returnAuthority)
      ) {
        out[key] = user[k]
      }
    })

    return out as Partial<FullUser>
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
        invitedById?: string
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
    meta?: EndpointMeta,
  ): Promise<ManageUserResponse> {
    const { _action } = params

    const db = this.factorDb.client()

    let user: FullUser | undefined

    let isNew = false
    let token: string | undefined = undefined

    if (_action === "getPublic") {
      const { userId, email } = params
      const where = userId ? { userId } : { email }

      user = await db
        .select(this.publicUserFieldKeys())
        .from(FactorTable.User)
        .where(where)
        .first<PublicUser>()
    } else if (_action == "getPrivate") {
      const { userId, email } = params
      const where = userId ? { userId } : { email }

      user = await db
        .select<FullUser[]>(["*"])
        .where(where)
        .from(FactorTable.User)
        .first()
    } else if (_action == "update") {
      const { email, userId, fields } = params
      if (!fields || (!email && !userId)) {
        throw this.stop("update user requires email, or user, and fields")
      }

      const fType = meta?.server ? "internal" : "settings"
      const insertFields = this.prepareUserFields(fType, fields, meta)

      const where = userId ? { userId } : { email }

      ;[user] = await db(FactorTable.User)
        .update(insertFields)
        .where(where)
        .returning<FullUser[]>("*")

      if (!user) {
        throw this.stop({
          message: "user not found",
          data: where,
          code: "TOKEN_ERROR",
        })
      }
    } else if (_action == "create") {
      const { fields } = params

      if (!fields) throw this.stop("fields required")

      const hashedPassword = await hashPassword(fields.password)

      if (!fields.email) throw this.stop("email required")

      if (!fields.emailVerified) {
        await verifyNewEmail({
          email: fields.email,
          factorUser: this.factorUser,
        })
      }

      const insertFields = this.prepareUserFields(
        "internal",
        {
          ...fields,
          hashedPassword,
          verificationCode: getSixDigitRandom(),
          codeExpiresAt: this.utils.dayjs().add(7, "day").toISOString(),
        },
        { server: true },
      )

      ;[user] = await db
        .insert(insertFields)
        .into(FactorTable.User)
        .returning<FullUser[]>("*")

      if (!user) throw this.stop("problem creating user")

      user = await runHooks<FactorUserHookDictionary, "createUser">({
        list: this.factorUser.hooks,
        hook: "createUser",
        args: [user, { params, meta }],
      })

      token = user ? this.factorUser.createClientToken(user) : undefined
      isNew = true
    }

    // don't return authority info to client
    // some functions (email endpoint) need code though
    user = this.prepareUserFields("returnInfo", user, meta) as FullUser

    user = await runHooks<FactorUserHookDictionary, "processUser">({
      list: this.factorUser.hooks,
      hook: "processUser",
      args: [user, { params, meta }],
    })

    const response: ManageUserResponse = {
      status: "success",
      data: user,
      isNew,
      token,
    }

    // replace the user state if the bearer is user being updated
    if (meta?.bearer && meta?.bearer.userId == user?.userId) {
      response.user = user
    }

    return response
  }
}

export class QueryCurrentUser extends UserQuery {
  async run(params: { token: string }): Promise<EndpointResponse<FullUser>> {
    const { token } = params

    if (!token) throw this.stop("auth info not sent (token)")

    try {
      const { userId } = this.factorUser.decodeClientToken(token)

      if (!userId) throw this.stop("userId missing in token")

      const r = await this.factorUser.queries.ManageUser.serve(
        {
          _action: "getPrivate",
          userId,
        },
        { server: true },
      )

      return r
    } catch (error) {
      const e = error as Error

      return { status: "error", message: e.message, code: "TOKEN_ERROR" }
    }
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
    if (!this.factorEmail) throw new Error("no factorEmail")

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
    userFields: Partial<FullUser> & { password?: string },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<FullUser> & { token?: string }> {
    if (!meta.bearer) throw this.stop({ message: "must be logged in" })

    const { email, userId, password, verificationCode } = userFields
    const { bearer } = meta

    if (!bearer || !bearer.email) throw this.stop("bearer email required")

    const fields: Partial<FullUser> = this.prepareUserFields(
      "settings",
      userFields,
      meta,
    )

    if (userFields.password) {
      const hashedPassword = await hashPassword(userFields.password)

      const { data: dbUser } = await this.factorUser.queries.ManageUser.serve(
        {
          _action: "getPrivate",
          userId: bearer.userId,
        },
        meta,
      )

      if (!dbUser) throw this.stop({ message: "couldn't find user" })

      const correctPassword = await comparePassword(
        userFields.password,
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
          userId: bearer.userId,
          fields,
        },
        { server: true, ...meta },
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
    if (!this.factorEmail) throw new Error("no factorEmail")

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
    if (!this.factorEmail) throw new Error("no factorEmail")
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
    if (!this.factorEmail) throw new Error("no factorEmail")
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
    if (!this.factorEmail) throw new Error("no factorEmail")
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
