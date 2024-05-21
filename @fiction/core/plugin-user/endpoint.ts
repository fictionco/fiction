import type { OAuth2Client } from 'google-auth-library'
import type { EndpointMeta } from '../utils/endpoint'
import type { FictionDb } from '../plugin-db'
import type { FictionEnv } from '../plugin-env'
import { Query } from '../query'
import type { FictionEmail } from '../plugin-email'
import { abort, dayjs, getRequestIpAddress, prepareFields } from '../utils'
import { standardTable as t } from '../tbl'
import type { EndpointResponse } from '../types'
import { getGeoFree } from '../utils-analytics'
import type { User } from './types'
import { comparePassword, getCode, hashPassword, validateNewEmail, verifyCode } from './utils'
import type { FictionUser } from '.'

interface UserQuerySettings {
  fictionUser: FictionUser
  fictionDb: FictionDb
  fictionEmail?: FictionEmail
  fictionEnv: FictionEnv
}
export abstract class UserBaseQuery extends Query<UserQuerySettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: UserQuerySettings) {
    super(settings)
  }
}

export type WhereUser = { email: string } | { userId: string } | { username: string } | { googleId: string }

export type ManageUserParams =
  | {
    _action: 'create'
    fields: Partial<User> & {
      email: string
      password?: string
      orgName?: string
    }
    isVerifyEmail?: boolean
  }
  | {
    _action: 'update'
    fields: Partial<User> & { password?: string }
    where: WhereUser
  }
  | {
    _action: 'updateCurrentUser'
    fields: Partial<User> & { password?: string }
    where: WhereUser
  }
  | {
    _action: 'retrieve'
    select?: (keyof User)[] | ['*']
    where: WhereUser
  }
  | {
      _action: 'verifyEmail'
      email: string
      code: string
      password?: string
    }
    | {
      _action: 'getUserWithToken'
      token: string
    }
    | {
      _action: 'login'
      where: WhereUser
      password?: string
    }
    | {
      _action: 'loginGoogle'
      credential: string
    }

  type ManageUserResponse = EndpointResponse<User> & {
    isNew: boolean
    token?: string
    user?: User
  }

export class QueryManageUser extends UserBaseQuery {
  async run(params: ManageUserParams, meta: EndpointMeta): Promise<ManageUserResponse> {
    let user: User | undefined
    let isNew = false
    let message = ''
    let token: string | undefined
    const { fictionUser } = this.settings

    switch (params._action) {
      case 'retrieve':
        user = await this.getUser(params)
        break
      case 'getUserWithToken':
        user = await this.getUserWithToken(params, meta)
        break
      case 'update':
        user = await this.updateUser(params, meta)
        message = 'updated'
        break
      case 'updateCurrentUser':
        user = await this.updateCurrentUser(params, meta)
        message = 'updated'
        break
      case 'create': {
        user = await this.createUser(params, meta)
        isNew = true
        break
      }
      case 'verifyEmail':
        user = await this.verifyEmail(params, meta)
        message = 'email verified'
        break
      case 'login':
        user = await this.loginUser(params)
        break
      case 'loginGoogle': {
        const r = await this.loginGoogle(params, meta)
        user = r.user
        isNew = r.isNew
        message = 'login successful'
        break
      }
      default:
        return { status: 'error', message: 'Invalid action', isNew }
    }

    if (isNew)
      message = 'user created'

    if (['create', 'login', 'loginGoogle'].includes(params._action))
      token = user ? fictionUser.getToken(user) : undefined

    return await this.prepareResponse({ user, isNew, token, message, params }, meta)
  }

  private async getUser(params: ManageUserParams & { _action: 'retrieve' }): Promise<User | undefined> {
    const db = this.db()
    const { where, _action } = params

    const q = db.select('*').from(t.user).where(where)

    const user = await q.first<User>()

    return user
  }

  private async getUserWithToken(params: ManageUserParams & { _action: 'getUserWithToken' }, meta: EndpointMeta): Promise<User | undefined> {
    const tokenResult = this.settings.fictionUser.decodeToken(params.token)

    const { userId } = tokenResult

    const { data: user } = await this.settings.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId } }, { server: true, ...meta })

    return user
  }

  private async verifyEmail(params: ManageUserParams & { _action: 'verifyEmail' }, meta: EndpointMeta): Promise<User | undefined> {
    const { email, code, password } = params

    if (!email)
      throw abort('email required')

    const { fictionDb, fictionEnv, fictionUser } = this.settings

    await verifyCode({ email, verificationCode: code, fictionDb, isProd: fictionEnv?.isProd.value })

    const fields: Partial<User> = { emailVerified: true }

    if (password)
      fields.hashedPassword = await hashPassword(password)

    const { data: user } = await fictionUser.queries.ManageUser.serve(
      { _action: 'update', where: { email }, fields },
      { ...meta, server: true },
    )

    return user
  }

  validateBearer(where: WhereUser, meta: EndpointMeta) {
    if (meta.server)
      return

    if (!meta?.bearer)
      throw abort('bearer required')

    // Check if the bearer's userId, email, or username matches the respective fields in 'where', if they exist
    const isValid = (
      ('userId' in where && where.userId === meta.bearer.userId)
      || ('email' in where && meta.bearer.email && where.email.toLowerCase() === meta.bearer.email.toLowerCase())
      || ('username' in where && where.username === meta.bearer.username)
    )

    // Throw an error if no valid fields match
    if (!isValid)
      throw abort('Bearer does not have the required permissions or invalid token')
  }

  private async updateUser(params: ManageUserParams & { _action: 'update' }, meta: EndpointMeta): Promise<User | undefined> {
    const db = this.db()

    this.validateBearer(params.where, meta)

    const { where, fields } = params

    const existingUser = await this.getUser({ _action: 'retrieve', where })

    const ipData = await getRequestIpAddress(meta.request)
    fields.ip = ipData.ip
    fields.geo = await getGeoFree(fields.ip)

    const updateType = meta?.server ? 'internal' : 'settings'
    const insertFields = prepareFields({ type: updateType, fields, meta, fictionDb: this.settings.fictionDb, table: t.user })

    let passwordChanged = false
    // Handle password updates with hashing
    if (fields.password) {
      insertFields.hashedPassword = await hashPassword(fields.password)
      delete fields.password // Remove plaintext password from fields
      passwordChanged = true
    }

    let newEmail = undefined
    const updateEmail = fields.email?.toLowerCase().trim()
    // Check if email needs to be updated and if it's different from the current one
    if (updateEmail && updateEmail !== existingUser?.email) {
      insertFields.email = updateEmail
      insertFields.emailVerified = false

      await validateNewEmail({ email: insertFields.email, fictionUser: this.settings.fictionUser })

      newEmail = insertFields.email
    }

    this.log.info('updating user', { data: { where, insertFields, fields } })

    const [user] = await db(t.user).update(insertFields).where(where).returning<User[]>('*')

    if (!user)
      throw abort(`user not found`, { data: where })

    this.settings.fictionUser.events.emit('updateUser', { user: existingUser!, newEmail, passwordChanged })

    return user
  }

  private async updateCurrentUser(params: ManageUserParams & { _action: 'updateCurrentUser' }, meta: EndpointMeta): Promise<User | undefined> {
    const { fields } = params

    if (!fields)
      throw abort('fields required')

    if (!meta.bearer?.userId)
      throw abort('bearer required (current user)')

    const { userId } = meta.bearer

    return this.updateUser({ _action: 'update', where: { userId }, fields }, meta)
  }

  private async createUser(params: ManageUserParams & { _action: 'create' }, meta: EndpointMeta): Promise<User> {
    const db = this.db()

    const { fields } = params

    if (!fields)
      throw abort('fields required')

    if (!fields.email)
      throw abort('email required')

    const { fictionUser, fictionDb } = this.settings

    fields.email = fields.email.toLowerCase().trim()

    const hashedPassword = await hashPassword(fields.password)

    await validateNewEmail({ email: fields.email, fictionUser })

    const ipData = await getRequestIpAddress(meta.request)
    fields.ip = ipData.ip
    fields.geo = await getGeoFree(fields.ip)

    const table = t.user
    const verify = { code: getCode(), expiresAt: dayjs().add(1, 'day').toISOString(), context: 'create' }
    const insertFields = prepareFields({ type: 'internal', fields: { ...fields, hashedPassword, verify }, meta: { server: true }, fictionDb, table })

    const [user] = await db.insert(insertFields).into(table).returning<User[]>('*')

    if (user && user.userId) {
      // special case, on user create set them to the bearer
      // its needed for further actions like adding org and setting last project
      meta.bearer = user
    }
    else {
      throw abort('couldn\'t create user', { data: { insertFields } })
    }

    const { orgName = 'Personal' } = fields
    const response = await fictionUser.queries.ManageOrganization.serve(
      { _action: 'create', userId: user.userId, email: user.email, org: { orgName } },
      { server: true, ...meta },
    )

    user.orgs = response.data ? [response.data] : []

    fictionUser.events.emit('newUser', { user, params })

    return user
  }

  private async loginUser(params: ManageUserParams & { _action: 'login' }): Promise<User | undefined> {
    const { where, password } = params

    if (!password)
      throw abort('password required')

    const user = await this.getUser({ _action: 'retrieve', where })

    if (!user)
      throw abort('user not found', { data: where })

    if (!user.hashedPassword)
      throw abort('no password set')

    const isMatch = await comparePassword(password, user.hashedPassword)

    if (!isMatch)
      throw abort('password incorrect')

    return user
  }

  private googleClient?: OAuth2Client
  async getGoogleClient(): Promise<OAuth2Client> {
    const clientId = this.settings.fictionUser.googleClientId
    const clientSecret = this.settings.fictionUser.googleClientSecret
    if (!clientId)
      throw abort('missing google auth clientId')
    if (!clientSecret)
      throw abort('missing clientSecret')

    const { OAuth2Client } = await import('google-auth-library')
    if (!this.googleClient)
      this.googleClient = new OAuth2Client({ clientId, clientSecret })

    return this.googleClient
  }

  private async loginGoogle(params: ManageUserParams & { _action: 'loginGoogle' }, meta: EndpointMeta): Promise<{ user?: User, isNew: boolean }> {
    const { credential } = params

    const { fictionDb } = this.settings

    const googleClient = await this.getGoogleClient()

    const googleClientId = this.settings.fictionUser.googleClientId

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: googleClientId })
    const payload = ticket.getPayload()

    const email = payload?.email

    if (!email)
      throw abort('no email from google')

    const { sub: googleId, name: fullName, email_verified: emailVerified, picture } = payload

    let user = await this.getUser({ _action: 'retrieve', where: { email } })
    let isNew = false
    if (!user) {
      isNew = true

      const fields: Partial<User> = { fullName, email, emailVerified, googleId, avatar: { url: picture } }

      const ipData = await getRequestIpAddress()
      fields.ip = ipData.ip
      fields.geo = await getGeoFree(fields.ip)

      const insertFields = prepareFields({ type: 'internal', fields, meta: { server: true }, fictionDb, table: t.user })

      const [newUser] = await this.db().table(t.user).insert(insertFields).onConflict(['email']).merge().returning<User[]>('*')

      if (!newUser)
        throw abort('couldn\'t create user', { data: { insertFields } })

      user = newUser
    }
    else if (user && !user.googleId) {
      await this.db().table(t.user).update({ googleId }).where({ userId: user.userId })
    }

    return { user, isNew }
  }

  private async prepareResponse(args: { user?: User, isNew: boolean, token?: string, message?: string, params: ManageUserParams }, meta: EndpointMeta): Promise<ManageUserResponse> {
    const { isNew, token, message } = args
    const user = prepareFields({ type: 'returnInfo', fields: args.user, table: t.user, meta, fictionDb: this.settings.fictionDb })

    const fictionUser = this.settings.fictionUser
    if (user?.userId) {
      const orgsResponse = await fictionUser.queries.OrganizationsByUserId.serve(
        { userId: user.userId, lastOrgId: user.lastOrgId },
        { ...meta, caller: 'processUserGetOrgs' },
      )

      user.orgs = orgsResponse.data ?? []
    }

    const response: ManageUserResponse = { status: 'success', data: user, isNew, token, message, user }

    // replace the user state if the bearer is user being updated
    if (meta?.bearer && meta?.bearer.userId === user?.userId)
      response.user = user

    return response
  }
}
