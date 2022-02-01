import {
  _stop,
  runProcessors,
  getEditableUserFields,
  getJsonUserFields,
  getPublicUserFields,
  validateEmail,
  snakeCase,
  logger,
} from "@factor/api"

import { getServerConfig } from "../serverConfig"
import {
  EndpointResponse,
  FactorTable,
  FullUser,
  PublicUser,
  PrivateUser,
} from "@factor/types"
import bcrypt from "bcrypt"
import dayjs from "dayjs"

import { getDb } from "@factor/engine/db"
import { sendEmail } from "../serverEmail"
import { createClientToken, decodeClientToken } from "../serverJwt"

import { QueryFactor } from "../query"
import { serverUrl } from "@factor/api"
import { EndpointMethodOptions, Endpoint } from "@factor/engine/endpoint"

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
 * Find a single user or return undefined if they don't exist
 */
export const findOneUser = async <T extends PublicUser = PublicUser>(args: {
  email?: string
  userId?: string
  select?: (keyof FullUser)[] | ["*"]
}): Promise<T | undefined> => {
  const { userId, email, select = [] } = args
  const where = userId ? { userId } : { email }
  const db = await getDb()
  const returnFields = [...getPublicUserFields(), ...select]

  const user: T | undefined = await db
    .select<T | undefined>(...returnFields)
    .from(FactorTable.User)
    .where(where)
    .first()

  return user
}

/**
 * Add user data about the current user
 */
const refineUser = async (
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
 * Update a user
 */
export const updateUser = async (args: {
  email?: string
  userId?: string
  fields: Partial<FullUser>
  select?: (keyof FullUser)[] | ["*"]
}): Promise<FullUser> => {
  const { userId, email, fields, select = [] } = args
  const where = userId ? { userId } : { email }
  const db = await getDb()
  const returnFields = [...getPublicUserFields(), ...select]
  const [user] = await db(FactorTable.User)
    .update(fields)
    .where(where)
    .returning<FullUser[]>(returnFields)

  if (!user) throw _stop({ message: "can't find user", data: where })

  const refined = await refineUser(user)

  return refined
}

class QueryCurrentUser extends QueryFactor {
  constructor() {
    super()
  }
  async run(params: { token: string }): Promise<EndpointResponse<FullUser>> {
    const { token } = params

    if (!token) throw this.stop({ message: "token is required" })

    const { email } = decodeClientToken(token)

    const user = await updateUser({
      email,
      fields: { lastSeen: dayjs().toISOString() },
    })

    return { status: "success", data: user }
  }
}

/**
 * Get a single user
 */
export const getPublicUser = async (args: {
  email?: string
  userId?: string
}): Promise<EndpointResponse<PublicUser | false>> => {
  const user = (await findOneUser(args)) ?? false

  return { status: "success", data: user }
}
class QueryGetPublicUser extends QueryFactor {
  constructor() {
    super()
  }
  async run(
    params: { email: string } | { userId: string },
  ): Promise<EndpointResponse<PublicUser | false>> {
    if (!this.qu) {
      throw new Error("no knex")
    }
    return getPublicUser(params)
  }
}

/**
 * Gets user with private information accessible by admins or
 */
export const getPrivateUser = async (args: {
  email?: string
  userId?: string
}): Promise<EndpointResponse<FullUser | undefined>> => {
  let user = (await findOneUser<FullUser>(args)) ?? undefined

  if (user) {
    user = await refineUser(user)
  }

  return { status: "success", data: user as FullUser }
}
/**
 * Send a verification email with code
 */
export const sendVerificationEmail = async (args: {
  email: string
  code: string | number
}): Promise<void> => {
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

  await updateUser({ ...params, fields })

  await sendVerificationEmail({ email, code })

  return { status: "success", data: true }
}
class QuerySendOneTimeCode extends QueryFactor {
  constructor() {
    super()
  }
  async run(params: { email: string }): Promise<EndpointResponse<boolean>> {
    if (!this.qu) {
      throw new Error("no knex")
    }
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
 * Verify a new user email is valid and unique
 */
export const verifyNewEmail = async (email?: string): Promise<true> => {
  if (!email) throw _stop({ message: "email is required" })
  if (!validateEmail(email)) throw _stop({ message: "email failed validation" })

  const exists = await findOneUser({ email })

  if (exists) {
    throw _stop({ message: "email already exists", data: { email } })
  }

  return true
}

/**
 * Updates the current user with new info
 * Detecting if auth fields have changed and verifying account code
 */
class QueryUpdateCurrentUser extends QueryFactor {
  constructor() {
    super()
  }
  async run(
    params: Partial<FullUser> & { password?: string; bearer: PrivateUser },
  ): Promise<EndpointResponse<FullUser> & { token?: string }> {
    if (!this.qu) {
      throw new Error("no knex")
    }

    const { email, userId, password, verificationCode, bearer } = params

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

      const dbUser = await findOneUser<FullUser>({
        userId: bearer.userId,
        select: ["*"],
      })

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
      user = await updateUser({ userId: bearer.userId, fields })

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

class QuerySetPassword extends QueryFactor {
  constructor() {
    super()
  }
  async run(params: {
    password: string
    email: string
    verificationCode: string
    bearer: PrivateUser
  }): Promise<EndpointResponse<FullUser> & { token: string }> {
    if (!this.qu) throw new Error("no knex")

    const { password, email: emailArg, bearer, verificationCode } = params

    const email = emailArg ?? bearer.email
    if (!email) {
      throw _stop({ message: `email must be verified to set new password` })
    }
    // code verification is needed because on password reset the user is logged out
    await verifyCode({ email, verificationCode })
    const hashedPassword = await hashPassword(password)

    const user = await updateUser({
      email,
      fields: { hashedPassword },
    })

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

class QueryVerifyAccountEmail extends QueryFactor {
  constructor() {
    super()
  }
  async run(params: {
    email: string
    verificationCode: string
  }): Promise<EndpointResponse<FullUser>> {
    if (!this.qu) throw new Error("no knex")

    const { email, verificationCode } = params

    if (!email) throw _stop({ message: "email is required" })
    if (!verificationCode) throw _stop({ message: "confirm code is required" })

    await verifyCode({ email, verificationCode })

    const user = await updateUser({
      email,
      fields: { emailVerified: true },
    })
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
/**
 * Sends a confirmation code to reset password to a user's email
 */
// export const resetPassword: UserEndpointMethod<"resetPassword"> = async ({
//   email,
// }) => {
//   if (!email) throw _stop({ message: "email is required" })

//   await sendOneTimeCode({ email })

//   return {
//     status: "success",
//     message: "verification code sent",
//   }
// }
class QueryResetPassword extends QueryFactor {
  constructor() {
    super()
  }
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

export const createUser = async (
  userFields: Partial<FullUser>,
): Promise<FullUser> => {
  const { email } = userFields

  await verifyNewEmail(email)

  const db = await getDb()

  const r = await db
    .insert({
      ...userFields,
      verificationCode: getSixDigitRandom(),
      codeExpiresAt: dayjs().add(7, "day").toISOString(),
    })
    .into(FactorTable.User)
    .returning<FullUser[]>("*")

  const user = r && r.length > 0 ? r[0] : undefined

  if (!user) throw _stop({ message: "problem creating user" })

  return user
}

class QueryStartNewUser extends QueryFactor {
  constructor() {
    super()
  }
  async run(params: { email: string; fullName?: string }): Promise<
    EndpointResponse<Partial<FullUser>> & {
      token: string
      user: PublicUser
    }
  > {
    if (!this.qu) throw new Error("no knex")

    const { email, fullName } = params
    const user = await createUser({ email, fullName })
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

class QueryLogin extends QueryFactor {
  constructor() {
    super()
  }
  async run(params: { email: string; password: string }): Promise<
    EndpointResponse<FullUser> & {
      token: string
      user: FullUser
      next?: "verify"
    }
  > {
    if (!this.qu) throw new Error("no knex")

    const { email, password } = params
    let user = await findOneUser<FullUser>({
      email,
      select: ["hashedPassword"],
    })

    if (!user) throw this.stop({ message: "user does not exist" })

    const correctPassword = await comparePassword(
      password,
      user.hashedPassword ?? "",
    )

    if (!correctPassword) {
      throw this.stop({ message: "password is incorrect" })
    }

    delete user.hashedPassword

    user = await refineUser(user)

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

class QueryNewVerificationCode extends QueryFactor {
  constructor() {
    super()
  }
  async run(params: {
    email: string
    newAccount?: boolean
  }): Promise<EndpointResponse<{ exists: boolean }>> {
    if (!this.qu) throw new Error("no knex")

    const { email, newAccount } = params

    let existingUser = await findOneUser({ email })

    const exists = existingUser ? true : false

    if (newAccount && exists) {
      throw _stop({ message: "email exists", data: { exists } })
    } else if (!existingUser) {
      existingUser = await createUser({ email })

      logger.log({
        level: "info",
        context: "user",
        description: `user created ${email}`,
      })
    }

    await sendOneTimeCode({ email: existingUser.email })

    return {
      status: "success",
      data: { exists },
      message: "verification code sent",
    }
  }
}

export class UserMethod<T extends QueryFactor> extends Endpoint<T> {
  constructor(options: EndpointMethodOptions<T>) {
    super({ baseURL: serverUrl(), basePath: "/user", ...options })
  }
}

export const endpoints = [
  new UserMethod({
    key: "login",
    queryHandler: new QueryLogin(),
  }),
  new UserMethod({
    key: "newVerificationCode",
    queryHandler: new QueryNewVerificationCode(),
  }),
  new UserMethod({
    key: "setPassword",
    queryHandler: new QuerySetPassword(),
  }),
  new UserMethod({
    key: "",
    queryHandler: new QueryGetPublicUser(),
  }),
  new UserMethod({
    key: "resetPassword",
    queryHandler: new QueryResetPassword(),
  }),
  new UserMethod({
    key: "updateCurrentUser",
    queryHandler: new QueryUpdateCurrentUser(),
  }),
  new UserMethod({
    key: "sendOneTimeCode",
    queryHandler: new QuerySendOneTimeCode(),
  }),
  new UserMethod({
    key: "verifyAccountEmail",
    queryHandler: new QueryVerifyAccountEmail(),
  }),
  new UserMethod({
    key: "startNewUser",
    queryHandler: new QueryStartNewUser(),
  }),
  new UserMethod({
    key: "currentUser",
    queryHandler: new QueryCurrentUser(),
  }),
]

// export const endpointMap = {
//   login: new UserMethod({
//     queryHandler: new QueryLogin(),
//   }),
//   newVerificationCode: new UserMethod({
//     queryHandler: new QueryNewVerificationCode(),
//   }),
//   setPassword: new UserMethod({
//     queryHandler: new QuerySetPassword(),
//   }),
//   getPublicUser: new UserMethod({
//     queryHandler: new QueryGetPublicUser(),
//   }),
//   resetPassword: new UserMethod({
//     queryHandler: new QueryResetPassword(),
//   }),
//   updateCurrentUser: new UserMethod({
//     queryHandler: new QueryUpdateCurrentUser(),
//   }),
//   sendOneTimeCode: new UserMethod({
//     queryHandler: new QuerySendOneTimeCode(),
//   }),
//   verifyAccountEmail: new UserMethod({
//     queryHandler: new QueryVerifyAccountEmail(),
//   }),
//   startNewUser: new UserMethod({
//     queryHandler: new QueryStartNewUser(),
//   }),
//   currentUser: new UserMethod({
//     queryHandler: new QueryCurrentUser(),
//   }),
// }

/**
 * Get user data from token
 */
// export const currentUser = async (args: {
//   token: string
// }): Promise<EndpointResponse<FullUser>> => {
//   const { token } = args

//   if (!token) throw _stop({ message: "token is required" })

//   const { email } = decodeClientToken(token)

//   const user = await updateUser({
//     email,
//     fields: { lastSeen: dayjs().toISOString() },
//   })

//   return { status: "success", data: user }
// }
// /**
//  * Updates the current user with new info
//  * Detecting if auth fields have changed and verifying account code
//  */
// export const updateCurrentUser: UserEndpointMethodWithBearer<
//   "updateCurrentUser"
// > = async (userFields) => {
//   const db = await getDb()
//   const { email, userId, password, verificationCode, bearer } = userFields

//   let fields: Partial<FullUser> = {}

//   getEditableUserFields().forEach((f) => {
//     if (typeof userFields[f] != "undefined") {
//       fields = { ...fields, [f]: userFields[f] }
//     }
//   })

//   getJsonUserFields().forEach((f) => {
//     if (typeof userFields[f] != "undefined") {
//       const jsn = JSON.stringify(userFields[f])

//       const setter = db.raw(
//         `coalesce(${snakeCase(f)}::jsonb, '{}'::jsonb) || ?::jsonb`,
//         jsn,
//       )

//       fields = { ...fields, [f]: setter }
//     }
//   })

//   if (password) {
//     const hashedPassword = await hashPassword(password)

//     const dbUser = await findOneUser<FullUser>({
//       userId: bearer.userId,
//       select: ["*"],
//     })

//     if (!dbUser) throw _stop({ message: "couldn't find user" })

//     const correctPassword = await comparePassword(
//       password,
//       dbUser.hashedPassword ?? "",
//     )

//     if (verificationCode) {
//       await verifyCode({ email, userId, verificationCode })
//     }

//     if (!correctPassword && !verificationCode) {
//       throw _stop({ message: "account verification required" })
//     }

//     if (email && email != dbUser.email) {
//       await verifyNewEmail(email)

//       fields.email = email
//     } else {
//       fields.hashedPassword = hashedPassword
//     }
//   }

//   let user, token
//   if (Object.keys(fields).length > 0) {
//     user = await updateUser({ userId: bearer.userId, fields })

//     // if email or password were changed, create new token
//     token = password ? createClientToken(user) : undefined
//   }

//   return {
//     status: "success",
//     data: user,
//     message: "changes saved",
//     token,
//     user,
//   }
// }
/**
 * Sets a new user password
 * @note
 *  - returns a token which will log a user in
 */
// export const setPassword: UserEndpointMethodWithBearer<"setPassword"> = async (
//   args,
// ) => {
//   const { password, email: emailArg, bearer, verificationCode } = args

//   const email = emailArg ?? bearer.email
//   if (!email) {
//     throw _stop({ message: `email must be verified to set new password` })
//   }
//   // code verification is needed because on password reset the user is logged out
//   await verifyCode({ email, verificationCode })
//   const hashedPassword = await hashPassword(password)

//   const user = await updateUser({
//     email,
//     fields: { hashedPassword },
//   })

//   user.hashedPassword = hashedPassword

//   return {
//     status: "success",
//     data: user,
//     message: "new password created",
//     token: createClientToken(user),
//     user,
//   }
// }
/**
 * Verify an email address with code
 */
// export const verifyAccountEmail: UserEndpointMethod<
//   "verifyAccountEmail"
// > = async ({ email, verificationCode }) => {
//   if (!email) throw _stop({ message: "email is required" })
//   if (!verificationCode) throw _stop({ message: "confirm code is required" })

//   await verifyCode({ email, verificationCode })

//   const user = await updateUser({
//     email,
//     fields: { emailVerified: true },
//   })
//   // send it back for convenience
//   user.verificationCode = verificationCode

//   const config = getServerConfig()

//   const onVerified = config?.user?.onVerified

//   if (onVerified) {
//     Promise.resolve(onVerified(user)).catch((error) => console.error(error))
//   }

//   logger({
//     level: "info",
//     context: "user",
//     description: `user verified ${email}`,
//   })

//   return {
//     status: "success",
//     data: user,
//     message: "verification successful",
//     token: createClientToken(user),
//   }
// }
/**
 * Authenticates users, signing them up if newAccount is set
 */
// export const startNewUser: UserEndpointMethod<"startNewUser"> = async (
//   args,
// ) => {
//   const { email, fullName } = args
//   const user = await createUser({ email, fullName })
//   await sendOneTimeCode({ email: user.email })

//   logger({
//     level: "info",
//     context: "user",
//     description: `user started ${email}:${fullName ?? "(no name)"}`,
//   })

//   return {
//     status: "success",
//     data: { userId: user.userId, fullName: user.fullName, email: user.email },
//     message: "verification code sent",
//     user,
//     token: createClientToken(user),
//   }
// }

// export const newVerificationCode: UserEndpointMethod<
//   "newVerificationCode"
// > = async (args) => {
//   const { email, newAccount } = args

//   let existingUser = await findOneUser({ email })

//   const exists = existingUser ? true : false

//   if (newAccount && exists) {
//     throw _stop({ message: "email exists", data: { exists } })
//   } else if (!existingUser) {
//     existingUser = await createUser({ email })

//     logger({
//       level: "info",
//       context: "user",
//       description: `user created ${email}`,
//     })
//   }

//   await sendOneTimeCode({ email: existingUser.email })

//   return {
//     status: "success",
//     data: { exists },
//     message: "verification code sent",
//   }
// }

/**
 * Login a user and return a signed token
 */
// export const login: UserEndpointMethod<"login"> = async (args) => {
//   const { email, password } = args
//   let user = await findOneUser<FullUser>({
//     email,
//     select: ["hashedPassword"],
//   })

//   if (!user) throw _stop({ message: "user does not exist" })

//   const correctPassword = await comparePassword(
//     password,
//     user.hashedPassword ?? "",
//   )

//   if (!correctPassword) {
//     throw _stop({ message: "password is incorrect" })
//   }

//   delete user.hashedPassword

//   user = await refineUser(user)

//   const token = createClientToken(user)

//   if (!user.emailVerified) {
//     await sendOneTimeCode({ email: user.email })
//     return {
//       status: "success",
//       data: user,
//       message: "verification email sent",
//       next: "verify",
//       token,
//       user,
//     }
//   }

//   logger({
//     level: "info",
//     context: "user",
//     description: `user logged in ${email}`,
//   })

//   return {
//     status: "success",
//     data: user,
//     message: "successfully logged in",
//     token,
//     user,
//   }
// }

/**
 * A unit-testable endpoint handler
 */
// export const userEndpointHandler = async <
//   T extends keyof UserEndpoint,
// >(config: {
//   _method: T
//   args: UserEndpoint[T]["request"] & { email?: string }
//   bearer?: PrivateUser
//   query?: Record<string, any>
//   params?: Record<string, any>
// }): Promise<EndpointResponse> => {
//   const { _method, args, bearer, query, params } = config

//   let r: EndpointResponse = {
//     status: "fail",
//     message: "Server Error (No Method)",
//   }

//   try {
//     if (EPMap[_method]) {
//       const _args = { ...args, bearer }

//       if (bearerRequired.includes(_method) && !_args.bearer) {
//         throw _stop({ message: "only logged in users can do this" })
//       }
//       // email should always be lower case to prevent duplicates
//       if (_args.email) {
//         _args.email = _args.email.toLowerCase()
//       }
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//       r = await EPMap[_method](_args as any)
//     }
//   } catch (error: unknown) {
//     logger({
//       level: "error",
//       context: "user",
//       description: `user endpoint error ${_method}`,
//       data: error,
//     })

//     logger({
//       level: "error",
//       context: "user",
//       description: `user endpoint error args ${_method}`,
//       data: { query, params, bearer },
//     })

//     const err = error as ErrorConfig

//     r = {
//       status: "error",
//       message: err.expose ? err.message : "",
//       code: err.code,
//       data: err.data,
//       expose: err.expose,
//     }
//   }

//   return r
// }
/**
 * The Factor Endpoint handler wrapper
 */
// export const userEndpoint = {
//   name: "userEndpoint",
//   route: "/user/:_method",
//   handler: async (request: express.Request): Promise<EndpointResponse> => {
//     const _method = request.params._method as keyof UserEndpoint
//     const args = request.body as Record<string, any>
//     const { query, params, bearer } = request
//     return await userEndpointHandler({ _method, args, query, params, bearer })
//   },
// }
