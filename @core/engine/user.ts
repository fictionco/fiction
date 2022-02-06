/* eslint-disable @typescript-eslint/no-use-before-define */
import { _stop } from "@factor/api/error"
import { runProcessors } from "@factor/api/extend"
import {
  getPublicUserFields,
  getJsonUserFields,
  getEditableUserFields,
} from "@factor/api/user"
import { serverUrl } from "@factor/api/url"
import { validateEmail, snakeCase } from "@factor/api/utils"
import { logger } from "@factor/api/logger"
import { getServerConfig } from "../server/config"
import {
  EndpointResponse,
  FactorTable,
  FullUser,
  PublicUser,
} from "@factor/types"
import bcrypt from "bcrypt"
import dayjs from "dayjs"

import { getDb } from "./db"

import { createClientToken, decodeClientToken } from "./jwt"

import { EndpointMethodOptions, Endpoint, EndpointMeta } from "./endpoint"

import { Query } from "./query"

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
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 6)
}
const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Add user data about the current user
 */
const processUser = async (
  user: FullUser,
  meta?: { private: boolean },
): Promise<FullUser> => {
  meta = meta || { private: true }
  const config = getServerConfig()

  const processors = config?.user?.processors ?? []

  if (processors && processors.length > 0) {
    const result = await runProcessors<FullUser>(processors, user, meta)
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

class QueryManageUser extends Query {
  async run(
    params:
      | { _action: "create"; fields: Partial<FullUser> & { email: string } }
      | {
          _action: "update"
          fields: Partial<FullUser>
          email?: string
          userId?: string
        }
      | {
          _action: "getPrivate" | "getPublic"
          email?: string
          userId?: string
          select?: (keyof FullUser)[] | ["*"]
        },
    _meta?: EndpointMeta,
  ): Promise<EndpointResponse<FullUser>> {
    const { _action } = params

    const db = await this.getDb()

    let user: FullUser | undefined

    const publicFields = getPublicUserFields()

    if (_action == "getPrivate" || _action == "getPublic") {
      const { userId, email } = params
      const where = userId ? { userId } : { email }

      const returnFields = _action == "getPrivate" ? ["*"] : publicFields

      user = await db
        .select(...returnFields)
        .from(FactorTable.User)
        .where(where)
        .first<FullUser>()

      if (user && _action == "getPrivate") {
        user = await processUser(user)
      }
    } else if (_action == "update") {
      const { userId, email, fields } = params
      if (!fields || (!userId && !email)) {
        throw this.stop("missing required fields")
      }

      const where = userId ? { userId } : { email }

      ;[user] = await db(FactorTable.User)
        .update(fields)
        .where(where)
        .returning<FullUser[]>("*")

      if (!user) throw this.stop({ message: "user not found", data: where })

      user = await processUser(user)
    } else if (_action == "create") {
      const { fields } = params

      if (!fields) throw this.stop("fields required")

      const { email } = fields

      if (!email) throw this.stop("email required")

      await verifyNewEmail(email)
      ;[user] = await db
        .insert({
          ...fields,
          verificationCode: getSixDigitRandom(),
          codeExpiresAt: dayjs().add(7, "day").toISOString(),
        })
        .into(FactorTable.User)
        .returning<FullUser[]>("*")

      if (!user) throw this.stop("problem creating user")
    }

    return { status: "success", data: user }
  }
}

class QueryCurrentUser extends Query {
  async run(params: { token: string }): Promise<EndpointResponse<FullUser>> {
    const { token } = params

    if (!token) throw this.stop({ message: "auth info not sent (token)" })

    const { email } = decodeClientToken(token)

    const { data: user } = await Queries.ManageUser.serve(
      {
        _action: "update",
        email,
        fields: { lastSeen: dayjs().toISOString() },
      },
      undefined,
    )

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
  const { sendEmail } = await import("./email")
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
}): Promise<EndpointResponse<boolean>> => {
  const { email } = params

  const code = getSixDigitRandom()
  const fields = {
    verificationCode: code,
    codeExpiresAt: dayjs().add(1, "day").toISOString(),
  }

  await Queries.ManageUser.serve(
    { _action: "update", email, fields },
    undefined,
  )

  await sendVerificationEmail({ email, code })

  return { status: "success", data: true }
}
class QuerySendOneTimeCode extends Query {
  async run(params: { email: string }): Promise<EndpointResponse<boolean>> {
    if (!this.qu) throw new Error("no knex")

    return sendOneTimeCode(params)
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
  if (process.env.NODE_ENV == "development" && verificationCode == "123456") {
    return true
  }

  if (!codeDetails || codeDetails.verificationCode !== verificationCode) {
    throw _stop({ message: `verification code is not a match` })
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
          userId: bearer.userId,
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
    if (!this.qu) throw new Error("no knex")
    if (!meta.bearer) throw this.stop({ message: "must be logged in" })

    const { password, email: emailArg, verificationCode } = params

    const email = emailArg ?? meta.bearer.email
    if (!email) {
      throw _stop({ message: `email must be verified to set new password` })
    }
    // code verification is needed because on password reset the user is logged out
    await verifyCode({ email, verificationCode })
    const hashedPassword = await hashPassword(password)

    const { data: user } = await Queries.ManageUser.serve(
      {
        _action: "update",
        email,
        fields: { hashedPassword },
      },
      meta,
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
      undefined,
    )

    if (!user) throw this.stop("problem updating user")

    // send it back for convenience
    user.verificationCode = verificationCode

    const config = getServerConfig()

    const onVerified = config?.user?.onVerified

    if (onVerified) {
      Promise.resolve(onVerified(user)).catch((error) => console.error(error))
    }

    logger.log({
      level: "info",
      context: "QueryVerifyAccountEmail",
      description: `user verified ${email}`,
    })

    return {
      status: "success",
      data: user,
      message: "verification successful",
      token: createClientToken(user),
    }
  }
}

class QueryResetPassword extends Query {
  async run({ email }: { email: string }): Promise<EndpointResponse<FullUser>> {
    if (!this.qu) throw new Error("no knex")

    if (!email) throw this.stop({ message: "email is required" })

    await sendOneTimeCode({ email })

    return {
      status: "success",
      message: "verification code sent",
    }
  }
}

class QueryStartNewUser extends Query {
  async run(params: { email: string; fullName?: string }): Promise<
    EndpointResponse<Partial<FullUser>> & {
      token: string
      user: PublicUser
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

class QueryLogin extends Query {
  async run(
    params: { email: string; password: string },
    _meta: EndpointMeta,
  ): Promise<
    EndpointResponse<FullUser> & {
      token: string
      user: FullUser
      next?: "verify"
    }
  > {
    const { email, password } = params
    let { data: user } = await Queries.ManageUser.serve(
      {
        _action: "getPrivate",
        email,
      },
      _meta,
    )

    if (!user) throw this.stop({ message: "user does not exist" })

    const correctPassword = await comparePassword(
      password,
      user.hashedPassword ?? "",
    )

    if (!correctPassword) {
      throw this.stop({ message: "password is incorrect" })
    }

    delete user.hashedPassword

    user = await processUser(user)

    const token = createClientToken(user)

    if (!user.emailVerified) {
      await sendOneTimeCode({ email: user.email })
      return {
        status: "success",
        data: user,
        message: "verification email sent",
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
      message: "successfully logged in",
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

export class UserMethod<T extends Query> extends Endpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ baseURL: serverUrl(), basePath: "/user", ...options })
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

type EndpointMap = {
  [P in keyof typeof Queries]: UserMethod<typeof Queries[P]>
}

export const getEndpointsMap = (): EndpointMap => {
  return Object.fromEntries(
    Object.entries(Queries).map(([key, query]) => {
      return [key, new UserMethod({ key, queryHandler: query })]
    }),
  ) as EndpointMap
}

export const endpointsMap = getEndpointsMap()
export const endpointsList = Object.values(endpointsMap)
