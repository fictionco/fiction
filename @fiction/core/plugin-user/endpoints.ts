import bcrypt from 'bcrypt'
import type { Knex } from 'knex'
import { dayjs } from '../utils/libraries'

import type { EndpointResponse } from '../types'
import { abort } from '../utils/error'
import { createUserToken, decodeUserToken } from '../utils/jwt'
import { getRequestIpAddress } from '../utils/network'
import { getGeoFree } from '../utils-analytics/geo'
import type { EndpointManageAction, EndpointMeta } from '../utils/endpoint'
import type { FictionDb } from '../plugin-db'
import type { FictionEnv } from '../plugin-env'
import { Query } from '../query'
import type { FictionEmail } from '../plugin-email'
import { prepareFields } from '../utils'
import { standardTable } from '../tbl'
import type { MemberAccess, MemberStatus, Organization, OrganizationMembership, User } from './types'
import { validateNewEmail, verifyCode } from './utils/email'
import type { FictionUser } from '.'

interface UserQuerySettings {
  fictionUser: FictionUser
  fictionDb: FictionDb
  fictionEmail?: FictionEmail
  fictionEnv: FictionEnv
}
export abstract class UserQuery extends Query<UserQuerySettings> {
  fictionUser = this.settings.fictionUser
  fictionEmail = this.settings.fictionEmail
  fictionDb = this.settings.fictionDb
  fictionEnv = this.settings.fictionEnv
  db = () => this.fictionDb.client()
  constructor(settings: UserQuerySettings) {
    super(settings)
  }

  getToken = (user: User) => createUserToken({ user, tokenSecret: this.fictionUser.tokenSecret })
  decodeToken = (token: string) => decodeUserToken({ token, tokenSecret: this.fictionUser.tokenSecret })

  async returnUser(meta: EndpointMeta): Promise<User | undefined> {
    const userId = meta.bearer?.userId
    if (!userId)
      return

    let user: User | undefined
    if (userId) {
      const response = await this.fictionUser.queries.ManageUser.serve(
        {
          _action: 'getPrivate',
          userId,
        },
        meta,
      )

      user = response.data
    }
    return user
  }

  refineRawOrganization(
    params: { org: Organization, lastOrgId?: string, userId?: string },
    _meta: EndpointMeta,
  ): Organization | undefined {
    const { org, lastOrgId } = params
    if (!org)
      return

    // use development/test values for customer in development mode
    if (this.fictionEnv?.isTest.value) {
      org.customer = org.customerTest
      org.customerId = org.customerIdTest
    }

    // remove nulls from empty joins
    org.members = org.members ?? []

    if (lastOrgId === org.orgId)
      org.lastOrgId = true

    return org
  }

  /**
   * Send a verification email with code
   */
  async sendVerificationEmail(args: {
    email: string
    code: string | number
  }): Promise<void> {
    if (!this.fictionEmail)
      throw new Error('no fictionEmail')
    const { code, email } = args
    const nm = this.fictionEnv.meta.app?.name
    await this.fictionEmail.sendTransactional({
      subject: `${nm}: ${code} is your verification code`,
      bodyMarkdown: `Hi there!\n\n This email is to verify your account using a one-time code.\n\n Your code is: **${code}**`,
      to: email,
    })
  }

  /**
   * Create a verification code, save it to user and email the user with the code
   * userId argument is used to be more specific about user, than email which might be changing
   */
  async sendOneTimeCode(params: { email: string, userId?: string }): Promise<string> {
    const { email, userId } = params

    if (!email)
      throw abort('no email provided to send code to')

    const code = getSixDigitRandom()
    const fields = {
      verificationCode: code,
      codeExpiresAt: dayjs().add(1, 'day').toISOString(),
    }

    const userIdField = userId ? { userId } : { email }

    await this.fictionUser.queries.ManageUser.serve(
      { _action: 'update', ...userIdField, fields },
      { server: true },
    )

    await this.sendVerificationEmail({ email, code })

    return code
  }

  publicUserFieldKeys() {
    const cols = this.fictionDb.getColumns('fiction_user')

    return cols
      ?.map(({ key, isPrivate, isAuthority }) =>
        isPrivate || isAuthority ? undefined : key,
      )
      .filter(Boolean) as (keyof User)[]
  }
}

/**
 * A random 6 digit number, ideal for verification code
 */
function getSixDigitRandom(): string {
  return Math.random().toString().slice(2, 8)
}
/**
 * Create a md5 of password
 * @remarks
 * 6 salt rounds - https://security.stackexchange.com/a/83382
 */
async function hashPassword(password?: string): Promise<string | undefined> {
  return password ? await bcrypt.hash(password, 6) : undefined
}
async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export type ManageUserParams =
  | {
    _action: 'create'
    email?: string
    fields: Partial<User> & {
      email: string
      password?: string
    }
    orgName?: string
    doVerification?: boolean
    noValidate?: boolean
  }
  | ({
    _action: 'update'
    fields: Partial<User>
    email?: string
    userId?: string
  } & ({ email: string } | { userId: string }))
  | (
    {
      _action: 'getPrivate' | 'getPublic'
      select?: (keyof User)[] | ['*']
      email?: string
      userId?: string
      username?: string
    } & ({ email: string } | { userId: string } | { username: string })
   )

type ManageUserResponse = EndpointResponse<User> & {
  isNew: boolean
  token?: string
  user?: User
}
export class QueryManageUser extends UserQuery {
  async run(params: ManageUserParams, meta: EndpointMeta): Promise<ManageUserResponse> {
    let user: User | undefined
    let isNew = false
    let message = ''
    let token: string | undefined

    switch (params._action) {
      case 'getPublic':
      case 'getPrivate':
        user = await this.getUser(params)
        break
      case 'update':
        user = await this.updateUser(params, meta)
        message = 'user updated'
        break
      case 'create': {
        const createUserResult = await this.createUser(params, meta)
        user = createUserResult.user
        isNew = createUserResult.isNew
        token = createUserResult.token
        message = 'user created'
        break
      }
      default:
        return { status: 'error', message: 'Invalid action', isNew }
    }

    return await this.prepareResponse({ user, isNew, token, message, params }, meta)
  }

  private async prepareResponse(args: { user?: User, isNew: boolean, token?: string, message?: string, params: ManageUserParams }, meta: EndpointMeta): Promise<ManageUserResponse> {
    const { isNew, token, params, message } = args
    let user = prepareFields({ type: 'returnInfo', fields: args.user, table: standardTable.user, meta, fictionDb: this.fictionDb })

    if (user && user.userId) {
      let orgs: Organization[] = []
      const orgsResponse
        = await this.fictionUser.queries.OrganizationsByUserId.serve(
          { userId: user.userId, lastOrgId: user.lastOrgId },
          { ...meta, caller: 'processUserGetOrgs' },
        )

      orgs = orgsResponse.data ?? []

      if (orgs.some(o => o.relation?.memberStatus === 'pending')) {
        const r = await this.fictionUser.queries.UpdateOrganizationMemberStatus.serve({ userId: user.userId, orgs }, meta)

        orgs = r.data ?? []
      }

      user.orgs = orgs
    }

    user = await this.settings.fictionEnv.runHooks('processUser', user, { params, meta })

    const response: ManageUserResponse = { status: 'success', data: user, isNew, token, message }

    // replace the user state if the bearer is user being updated
    if (meta?.bearer && meta?.bearer.userId === user?.userId)
      response.user = user

    return response
  }

  private async getUser(params: ManageUserParams): Promise<User | undefined> {
    if (params._action !== 'getPublic' && params._action !== 'getPrivate')
      throw abort('Invalid action')

    const db = this.db()
    const { userId, username, email, _action } = params
    const where = userId ? { userId } : email ? { email } : { username }

    if (!userId && !email && !username)
      throw abort('get user requires email/username/userId')

    const keys = _action === 'getPublic' ? this.publicUserFieldKeys() : ['*']
    const q = db.select(keys).from(standardTable.user).where(where)

    const user = await q.first<User>()

    return user
  }

  private async updateUser(params: ManageUserParams, meta: EndpointMeta): Promise<User | undefined> {
    if (params._action !== 'update')
      throw abort('Invalid action')

    const db = this.db()

    const { userId, fields, email } = params

    if (!fields || (!email && !userId))
      throw abort('update user requires email, or user, and fields')

    const ipData = await getRequestIpAddress(meta.request)
    fields.ip = ipData.ip
    fields.geo = await getGeoFree(fields.ip)
    const fType = meta?.server ? 'internal' : 'settings'
    const insertFields = prepareFields({ type: fType, fields, meta, fictionDb: this.fictionDb, table: standardTable.user })

    const where = userId ? { userId } : { email }

    this.log.info('updating user', { data: { where, insertFields, fields } })

    const [user] = await db(standardTable.user)
      .update(insertFields)
      .where(where)
      .returning<User[]>('*')

    if (!user)
      throw abort(`user not found (${userId || email})`, { data: where, code: 'TOKEN_ERROR' })

    return user
  }

  private async createUser(params: ManageUserParams, meta: EndpointMeta): Promise<{ user?: User, isNew: boolean, token?: string }> {
    if (params._action !== 'create')
      throw abort('Invalid action')

    const db = this.db()

    const { fields, orgName, noValidate } = params

    if (!fields)
      throw abort('fields required')

    if (!fields.email)
      throw abort('email required')

    fields.email = fields.email.toLowerCase().trim()

    const hashedPassword = await hashPassword(fields.password)

    if (!fields.emailVerified && !noValidate) {
      await validateNewEmail({
        email: fields.email,
        fictionUser: this.fictionUser,
      })
    }

    const ipData = await getRequestIpAddress(meta.request)
    fields.ip = ipData.ip
    fields.geo = await getGeoFree(fields.ip)

    const table = standardTable.user
    const insertFields = prepareFields({
      type: 'internal',
      fields: {
        ...fields,
        hashedPassword,
        verificationCode: getSixDigitRandom(),
        codeExpiresAt: dayjs().add(7, 'day').toISOString(),
      },
      meta: { server: true },
      fictionDb: this.fictionDb,
      table,
    })

    let [user] = await db
      .insert(insertFields)
      .into(table)
      .returning<User[]>('*')

    if (user && user.userId) {
      // special case, on user create set them to the bearer
      // its needed for further actions like adding org and setting last project
      meta.bearer = user
    }
    else {
      throw abort('couldn\'t create user', { data: { insertFields } })
    }

    const response = await this.fictionUser.queries.ManageOrganization.serve(
      {
        _action: 'create',
        userId: user.userId,
        email: user.email,
        org: { orgName: orgName || 'Personal' },
      },
      { server: true, ...meta },
    )

    user.orgs = response.data ? [response.data] : []

    user = await this.settings.fictionEnv.runHooks('createUser', user, { params, meta })

    this.fictionUser.events.emit('newUser', { user, params })

    return {
      user,
      isNew: true,
      token: user ? this.getToken(user) : undefined,
    }
  }
}

export class QueryCurrentUser extends UserQuery {
  async run(params: { token?: string }): Promise<EndpointResponse<User>> {
    const { token } = params

    if (!token)
      throw abort('token required')

    let userId: string | undefined

    try {
      const tokenResult = this.decodeToken(token)
      userId = tokenResult.userId

      const r = await this.fictionUser.queries.ManageUser.serve(
        {
          _action: 'getPrivate',
          userId,
        },
        { server: true },
      )

      return r
    }
    catch (error) {
      const e = error as Error

      return { status: 'error', message: e.message, code: 'TOKEN_ERROR' }
    }
  }
}

export class QuerySendOneTimeCode extends UserQuery {
  async run(params: { email: string }): Promise<EndpointResponse<boolean>> {
    await this.sendOneTimeCode(params)

    return { status: 'success', data: true }
  }
}

/**
 * Updates the current user with new info
 * Detecting if auth fields have changed and verifying account code
 */

type UpdateCurrentUserParams = { fields: Partial<User>, _action: 'updateAccountSettings' }
  | { _action: 'updatePassword', fields: Partial<User> & { password: string, verificationCode: string } }
  | { _action: 'updateEmail', fields: Partial<User> & { email: string, password: string, verificationCode: string } }

export class QueryUpdateCurrentUser extends UserQuery {
  async run(
    params: UpdateCurrentUserParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<User> & { token?: string }> {
    if (!meta.bearer && !meta.server)
      throw abort('must be logged in')

    const { fields, _action } = params

    const { bearer } = meta

    if (!bearer || !bearer.email || !bearer.userId)
      throw abort('authorization required (bearer)')

    const save: Partial<User> & { password?: string }
      = prepareFields({ type: 'settings', fields, meta, fictionDb: this.fictionDb, table: standardTable.user }) || {}

    if (!fields)
      throw abort('no fields to update')

    let message = 'settings updated'

    if (_action === 'updateEmail') {
      if (!fields.verificationCode)
        throw abort('verification code required')

      if (!fields?.password)
        throw abort('password required')

      await verifyCode({
        userId: bearer.userId,
        verificationCode: fields.verificationCode,
        fictionDb: this.fictionDb,
        isProd: this.fictionEnv?.isProd.value,
      })

      const { data: dbUser } = await this.fictionUser.queries.ManageUser.serve(
        {
          _action: 'getPrivate',
          userId: bearer.userId,
        },
        { ...meta, server: true, returnAuthority: ['hashedPassword'] },
      )

      if (!dbUser)
        throw abort('couldn\'t find user')

      const correctPassword = await comparePassword(
        fields.password,
        dbUser.hashedPassword ?? '',
      )

      if (fields.password && !correctPassword)
        throw abort('incorrect password')

      if (fields.email && fields.email !== dbUser.email) {
        await validateNewEmail({
          email: fields.email,
          fictionUser: this.fictionUser,
        })

        save.email = fields.email

        message = 'email updated'
      }
    }
    else if (_action === 'updatePassword') {
      if (!fields.verificationCode)
        throw abort('verification code required')

      if (!fields?.password)
        throw abort('new password required')
      if (fields.password.length < 6)
        throw abort('create a stronger password')

      await verifyCode({
        userId: bearer.userId,
        verificationCode: fields.verificationCode,
        fictionDb: this.fictionDb,
        isProd: this.fictionEnv?.isProd.value,
      })

      const hashedPassword = await hashPassword(fields.password)

      save.hashedPassword = hashedPassword

      message = 'password updated'
    }

    let user, token

    if (Object.keys(save).length > 0) {
      const response = await this.fictionUser.queries.ManageUser.serve(
        {
          _action: 'update',
          userId: bearer.userId,
          fields: save,
        },
        { server: true, ...meta },
      )

      user = response.data

      if (!user)
        throw abort('problem updating user')

      // if email or password were changed, create new token
      token = this.getToken(user)
    }

    return {
      status: 'success',
      data: user,
      message,
      token,
      user,
    }
  }
}

export interface SetPasswordParams {
  password: string
  email: string
  verificationCode: string
  isNewUser?: boolean
}

export class QuerySetPassword extends UserQuery {
  async run(
    params: SetPasswordParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<User> & { token: string }> {
    const { password, email: emailArg, verificationCode } = params

    const email = emailArg ?? meta.bearer?.email

    if (!email)
      throw abort(`email must be verified to set new password`)
    if (!password)
      throw abort(`password required`)

    // code verification is needed because on password reset the user is logged out
    await verifyCode({ email, verificationCode, fictionDb: this.fictionDb, isProd: this.fictionEnv?.isProd.value })
    const hashedPassword = await hashPassword(password)

    let user: User | undefined
    const r = await this.fictionUser.queries.ManageUser.serve(
      {
        _action: 'update',
        email,
        fields: { hashedPassword, emailVerified: true },
      },
      { ...meta, server: true },
    )

    user = r.data

    if (!user)
      throw abort('problem updating user')

    user.hashedPassword = hashedPassword

    user = await this.fictionEnv.runHooks('createPassword', user, { params, meta })

    return {
      status: 'success',
      data: user,
      message: 'new password created',
      token: this.getToken(user),
      user,
    }
  }
}

export class QueryVerifyAccountEmail extends UserQuery {
  async run(params: {
    email: string
    verificationCode: string
  }): Promise<EndpointResponse<User>> {
    const { email, verificationCode } = params

    if (!email)
      throw abort('email is required')
    if (!verificationCode)
      throw abort('confirm code is required')

    const isProd = this.fictionEnv?.isProd.value

    await verifyCode({ email, verificationCode, fictionDb: this.fictionDb, isProd })

    const { data: user } = await this.fictionUser.queries.ManageUser.serve(
      {
        _action: 'update',
        email,
        fields: { emailVerified: true },
      },
      { server: true },
    )

    if (!user)
      throw abort('problem updating user')

    // send it back for convenience
    user.verificationCode = verificationCode

    await this.settings.fictionEnv.runHooks('userOnVerified', user)

    this.log.info(`user verified ${email}`)

    delete user?.verificationCode

    return {
      status: 'success',
      data: user,
      message: 'verification successful',
      token: this.getToken(user),
    }
  }
}

export class QueryResetPassword extends UserQuery {
  async run({
    email,
  }: {
    email: string
  }): Promise<EndpointResponse<User> & { internal: string }> {
    if (!email)
      throw abort('email is required')
    if (!this.fictionEmail)
      throw new Error('no fictionEmail')

    const code = await this.sendOneTimeCode({ email })

    return {
      status: 'success',
      message: 'verification code sent',
      internal: code,
    }
  }
}

// export class QueryStartNewUser extends UserQuery {
//   async run(params: { email: string, fullName?: string }): Promise<
//     EndpointResponse<Partial<User>> & {
//       token: string
//       user: User
//     }
//   > {
//     if (!this.fictionEmail)
//       throw new Error('no fictionEmail')

//     const { email, fullName } = params
//     const { data: user } = await this.fictionUser.queries.ManageUser.serve(
//       {
//         _action: 'create',
//         fields: { email, fullName },
//       },
//       { server: true },
//     )

//     if (!user || !user.userId || !user.email)
//       throw abort('problem starting user', { data: { email, fullName } })

//     await this.sendOneTimeCode({ email: user.email })

//     this.log.info(`user started ${email}:${fullName ?? '(no name)'}`)

//     return {
//       status: 'success',
//       data: { userId: user.userId, fullName: user.fullName, email: user.email },
//       message: 'verification code sent',
//       user,
//       token: this.getToken(user),
//     }
//   }
// }

type LoginResponse = Promise<
  EndpointResponse<User> & {
    token: string
    user: User
    code?: string
    next?: 'verify'
  }
>

export class QueryLogin extends UserQuery {
  public async run(
    params: {
      email: string
      password?: string
      googleId?: string
      emailVerified?: boolean
      returnVerificationCode?: boolean
      createOnEmpty?: boolean
      orgName?: string
    },
    _meta: EndpointMeta,
  ): LoginResponse {
    if (!this.fictionEmail)
      throw new Error('no fictionEmail')
    const {
      email,
      password,
      googleId,
      emailVerified,
      returnVerificationCode = false,
      createOnEmpty = false,
      orgName,
    } = params

    // get user with needed auth data
    const m = {
      ..._meta,
      returnAuthority: ['hashedPassword', 'verificationCode'],
    }

    let { data: user } = await this.fictionUser.queries.ManageUser.serve(
      {
        _action: 'getPrivate',
        email,
      },
      m,
    )

    let message = ''

    if (!user && createOnEmpty) {
      if (!password)
        throw abort('password required')

      const { data: createdUser }
        = await this.fictionUser.queries.ManageUser.serve(
          {
            _action: 'create',
            fields: { email, password },
            orgName,
            noValidate: true,
          },
          m,
        )

      user = createdUser

      this.log.info(`user created ${email}`)
    }
    else if (!user) {
      throw abort('User does not exist. Register instead?')
    }

    // logging in within google
    if (googleId && _meta.server && user) {
      if (!user.googleId && emailVerified) {
        await this.fictionUser.queries.ManageUser.serve(
          {
            _action: 'update',
            email,
            fields: { googleId, emailVerified },
          },
          _meta,
        )
        message = 'linked google account'
      }
      else if (user.googleId !== googleId) {
        throw abort('user linked to another google account')
      }
    }
    else if (password && user) {
      if (!user.hashedPassword)
        throw abort('no password exists, login another way?')

      const correctPassword = await comparePassword(
        password,
        user.hashedPassword ?? '',
      )

      if (!correctPassword)
        throw abort('password is incorrect')

      delete user.hashedPassword
    }
    else {
      throw abort('no auth provided')
    }

    const token = this.getToken(user)

    if (!message)
      message = 'successfully logged in'

    let code: string | undefined
    if (returnVerificationCode && user.verificationCode && _meta.server)
      code = user.verificationCode
    else if (returnVerificationCode)
      this.log.warn('returnVerificationCode is true but server is false')

    delete user.verificationCode
    delete user.hashedPassword

    this.log.info(`user logged in ${email}`)

    return {
      status: 'success',
      data: user,
      message,
      token,
      user,
      code,
    }
  }
}

export class QueryNewVerificationCode extends UserQuery {
  async run(
    params: {
      email: string
      fullName?: string
      orgName?: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<{ exists: boolean }>> {
    if (!this.fictionEmail)
      throw new Error('no fictionEmail')
    const { email, orgName, fullName } = params

    let { data: existingUser } = await this.fictionUser.queries.ManageUser.serve(
      {
        _action: 'getPrivate',
        email,
      },
      meta,
    )

    const exists = !!existingUser

    if (!existingUser) {
      const { data: createdUser }
        = await this.fictionUser.queries.ManageUser.serve(
          {
            _action: 'create',
            fields: { email, fullName },
            orgName,
          },
          meta,
        )

      existingUser = createdUser

      this.log.info(`user created ${email}`)
    }

    if (!existingUser || !existingUser.email)
      throw abort('no user')

    await this.sendOneTimeCode({ email: existingUser.email })

    return {
      status: 'success',
      data: { exists },
      message: 'verification code sent',
    }
  }
}

export abstract class QueryOrganization extends UserQuery {
  memberObject(): string {
    const memberObject = [
      ['user_id', standardTable.user],
      ['email', standardTable.user],
      ['full_name', standardTable.user],
      ['last_seen_at', standardTable.user],
      ['member_access', standardTable.member],
      ['member_status', standardTable.member],
    ]
      .map(([key, table]) => `'${key}', ${table}.${key}`)
      .join(', ')

    return memberObject
  }

  orgBaseQuery(db: Knex): Knex.QueryBuilder {
    // const subQueryProject = db
    //   .select(
    //     db.raw(`json_agg(row_to_json(${standardTable.project}.*)) as projects`),
    //     `${standardTable.project}.org_id`,
    //   )
    //   .from(standardTable.org)
    //   .join(
    //     standardTable.project,
    //     `${standardTable.project}.org_id`,
    //     `=`,
    //     `${standardTable.org}.org_id`,
    //   )
    //   .groupBy(`${standardTable.project}.org_id`)
    //   .as(`org_projects`)

    // lateral join is key to get a limit on number of aggregated members
    // it allows you to reference unevaluated fields
    // https://stackoverflow.com/a/61369692/1858322
    // memberCount: https://stackoverflow.com/a/28888696/1858322

    const subQueryMembers = db
      .select(
        db.raw(
          `json_agg(json_build_object(${this.memberObject()})) as members, max(member_count) as member_count`,
        ),
        `${standardTable.org}.org_id`,
      )
      .from(standardTable.org)
      .joinRaw(
        `left join lateral (
        select *, count(*) OVER() AS member_count
        from "fiction_org_user"
        where "fiction_org_user".org_id = "fiction_org"."org_id"
        limit 5
      ) as "fiction_org_user" on true`,
      )
      .join(
        standardTable.user,
        `${standardTable.user}.user_id`,
        `=`,
        `${standardTable.member}.user_id`,
      )
      .groupBy(`${standardTable.org}.org_id`)
      .as('org_member')

    const q = db
      .select([`${standardTable.org}.*`, `org_member.*`])
      .from(standardTable.org)
      .leftJoin(
        subQueryMembers,
        `org_member.org_id`,
        `=`,
        `${standardTable.org}.org_id`,
      )

    return q
  }
}

export class QueryOrganizationsByUserId extends QueryOrganization {
  async run(
    params: {
      userId: string
      lastOrgId?: string
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Organization[]>> {
    const { userId, lastOrgId } = params

    const db = this.fictionDb.client()
    const q = this.orgBaseQuery(db)
      .select(
        db.raw(`json_build_object(${this.memberObject()}) as relation`),
        `${standardTable.org}.org_id`,
      )
      .join(
        standardTable.member,
        `${standardTable.member}.org_id`,
        '=',
        `${standardTable.org}.org_id`,
      )
      .join(
        standardTable.user,
        `${standardTable.user}.user_id`,
        '=',
        `${standardTable.member}.user_id`,
      )
      .where<Organization[]>(`${standardTable.member}.user_id`, userId)
      .orderBy(`${standardTable.org}.updated_at`, 'desc')

    const r = await q

    const data = r
      .map((org: Organization) =>
        this.refineRawOrganization(
          { org, lastOrgId, userId },
          _meta,
        ),
      )
      .filter(Boolean) as Organization[]

    return { status: 'success', data }
  }
}

export class QueryUpdateOrganizationMemberStatus extends QueryOrganization {
  async run(
    params: {
      userId: string
      orgs: Organization[]
    },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<Organization[]>> {
    const db = this.fictionDb.client()
    const { userId } = params
    let { orgs } = params

    orgs = await Promise.all(
      orgs.map(async (org) => {
        let ind = -1
        // is the current userId pending in this org?
        const pendingMember = org.members.find((_, i) => {
          if (_.userId === userId && _.memberStatus === 'pending') {
            ind = i
            return true
          }
          else { return false }
        })

        // if so, update to active
        if (pendingMember && ind >= 0) {
          await db
            .table(standardTable.member)
            .update({ memberStatus: 'active' })
            .where({ orgId: org.orgId, userId })

          org.members[ind].memberStatus = 'active'
        }

        return org
      }),
    )

    return { status: 'success', data: orgs }
  }
}

export class QueryGenerateApiSecret extends UserQuery {
  async run(
    params: { orgId: string },
    meta: EndpointMeta,
  ): Promise<
    EndpointResponse<Organization> & {
      user?: User
    }
  > {
    if (!this.fictionUser)
      throw new Error('no user service')
    if (!params.orgId)
      throw abort('orgId required')

    const { orgId } = params

    if (!meta.bearer?.userId && !meta.server)
      throw abort('auth required for API secret generation')

    let org: Organization | undefined = undefined
    let message: string | undefined = undefined
    const db = this.fictionDb.client()

    const { default: uuidAPIKey } = await import('uuid-apikey')

    const update: Record<string, any> = {
      apiSecret: uuidAPIKey.create().apiKey,
    }

    ;[org] = await db
      .table(standardTable.org)
      .update(update)
      .where({ orgId })
      .limit(1)
      .returning<Organization[]>('*')

    message = 'private API key created'

    // refresh user
    let user: User | undefined

    if (meta.bearer?.userId) {
      const { data: privateUser } = await this.fictionUser.queries.ManageUser.serve(
        { _action: 'getPrivate', userId: meta.bearer.userId },
        meta,
      )
      user = privateUser
    }

    return {
      status: 'success',
      data: org,
      user,
      message,
      orgId: org?.orgId,
    }
  }
}

export class QueryManageMemberRelation extends UserQuery {
  async run(
    params: {
      _action: EndpointManageAction
      memberId: string
      orgId: string
      memberAccess?: MemberAccess
      memberStatus?: MemberStatus
      memberRole?: string
      invitedById?: string
    },
    meta: EndpointMeta,
  ): Promise<EndpointResponse<OrganizationMembership>> {
    if (!this.fictionUser)
      throw abort('no user service')
    if (!meta.bearer && !meta.server)
      throw abort('auth required')
    const {
      memberId,
      orgId,
      _action,
      memberAccess,
      memberStatus,
      memberRole,
      invitedById,
    } = params

    const db = this.fictionDb.client()

    let relation: OrganizationMembership | undefined
    let message = ''
    if (_action === 'delete') {
      ;[relation] = await db
        .delete()
        .from(standardTable.member)
        .where({ userId: memberId, orgId })
        .limit(1)
        .returning<OrganizationMembership[]>('*')

      message = 'member removed'
    }
    else if (_action === 'create' || _action === 'update') {
      // Add relation
      ;[relation] = await db
        .insert({
          userId: memberId,
          orgId,
          memberAccess,
          memberStatus,
          memberRole,
          invitedById,
        })
        .onConflict(['user_id', 'org_id'])
        .merge()
        .into(standardTable.member)
        .returning<OrganizationMembership[]>('*')

      message = 'member updated'
    }

    let user: User | undefined
    if (meta.bearer?.userId) {
      // replace user state to ensure teams update
      const r = await this.fictionUser.queries.ManageUser.serve(
        {
          _action: 'getPrivate',
          userId: meta.bearer?.userId,
        },
        meta,
      )

      user = r.data
    }

    return { status: 'success', data: relation, user, message }
  }
}

export type ManageOrganizationParams =
  | {
    _action: 'create'
    email?: string
    userId: string
    org: Partial<Organization>
  }
  | {
    _action: 'update'
    orgId: string
    org: Partial<Organization>
  }
  | { _action: 'delete', orgId: string }
  | { _action: 'retrieve', orgId: string }

export class QueryManageOrganization extends UserQuery {
  async run(
    params: ManageOrganizationParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<Organization> & { user?: User }> {
    if (!this.fictionUser)
      throw new Error('no user service')
    const { _action } = params
    const { bearer, server } = meta
    if (!bearer && !server)
      throw abort('bearer required')

    const db = this.fictionDb.client()

    let responseOrg: Organization | undefined
    let message: string | undefined

    if (_action === 'delete' || _action === 'update') {
      const { orgId } = params
      if (!orgId)
        throw abort('orgId required')
      if (
        !server
        && !bearer?.orgs?.find(o => o.orgId === orgId)
      ) {
        throw abort('bearer privilege', {
          data: {
            bearerOrgs: bearer?.orgs?.map(o => o.orgId),
            orgId,
          },
        })
      }
    }

    if (_action === 'create') {
      const { userId, email, org } = params

      const { orgName, orgEmail = email } = org

      if (!userId || (!server && bearer?.userId !== userId))
        throw abort('bearer mismatch', { data: { meta, params } })

      const defaultName = `${orgEmail?.split('@')[0]}`

      ;[responseOrg] = await db
        .insert({
          orgName: orgName || defaultName,
          ownerId: userId,
          orgEmail: orgEmail || email,
        })
        .into(standardTable.org)
        .returning<Organization[]>('*')

      await this.fictionUser.queries.ManageMemberRelation.serve(
        {
          memberId: userId,
          orgId: responseOrg.orgId,
          memberAccess: 'owner',
          memberStatus: 'active',
          _action: 'create',
        },
        meta,
      )

      // await this.fictionUser.queries.ManageMemberRelation.serve(
      //   {
      //     memberId: userId,
      //     orgId: "example",
      //     memberAccess: "observer",
      //     memberStatus: "active",
      //     _action: "create",
      //   },
      //   meta,
      // )

      if (!responseOrg.orgId)
        throw new Error('orgId missing')

      message = `organization saved`
    }
    else if (_action === 'update') {
      const { org, orgId } = params

      const type = meta?.server ? 'internal' : 'settings'
      const insertFields = prepareFields({
        type,
        fields: org,
        meta,
        table: standardTable.org,
        fictionDb: this.fictionDb,
      })

      ;[responseOrg] = await db
        .update(insertFields)
        .into(standardTable.org)
        .where({ orgId })
        .limit(1)
        .returning<Organization[]>('*')

      responseOrg = await this.settings.fictionEnv.runHooks('updateOrganization', responseOrg, { params, meta })

      message = `updated organization`
    }
    else if (_action === 'delete') {
      const { orgId } = params

      this.log.warn(`deleting org:${orgId}`, {
        data: { params, meta },
      })
      ;[responseOrg] = await db
        .delete()
        .from(standardTable.org)
        .where({ orgId })
        .limit(1)
        .returning<Organization[]>('*')

      // track deleted org
      await db
        .insert({ orgId, deletedType: 'org' })
        .table(standardTable.deleted)

      message = `deleted "${responseOrg.orgName}" organization`
    }
    else if (_action === 'retrieve') {
      const { orgId } = params

      ;[responseOrg] = await db.select('*').from(standardTable.org).where({ orgId })
    }

    const user = await this.returnUser(meta)

    return { status: 'success', message, user, data: responseOrg }
  }
}
