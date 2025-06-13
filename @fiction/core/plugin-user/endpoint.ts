import type { OAuth2Client } from 'google-auth-library'
import type { FictionDb } from '../plugin-db/index.js'
import type { FictionEmail } from '../plugin-email/index.js'
import type { FictionEnv } from '../plugin-env/index.js'
import type { EndpointResponse } from '../types/index.js'
import type { EndpointMeta } from '../utils/endpoint.js'
import type { FictionUser } from './index.js'
import type { OnboardSettings, User } from './types.js'
import { Query } from '../query.js'
import { standardTable as t } from '../tbl.js'
import { getGeoFree } from '../utils/geo.js'
import { ensureUniqueHandle } from '../utils/handle.js'
import { abort, dayjs, deepMerge, getRequestIpAddress } from '../utils/index.js'
import { checkPasswordIsComplicated, comparePassword, defaultOrgName, emailExists, getCode, hashPassword, validateNewEmail, verifyCode } from './utils/index.js'

export type UserQuerySettings = {
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

export type WhereUser = { email: string } | { userId: string } | { handle: string } | { googleId: string }

export type CreateUserFields = Partial<User> & { email: string, password?: string, name?: string, orgId?: string, onboard?: OnboardSettings }

export type ManageUserParams =
  | { _action: 'create', fields: CreateUserFields, withGeo?: boolean }
  | { _action: 'getCreate', where: WhereUser, createUserFields?: Partial<CreateUserFields>, refreshCode?: boolean }
  | { _action: 'update', fields: Partial<User> & { password?: string }, where: WhereUser, code?: string }
  | { _action: 'updateCurrentUser', fields: Partial<User> & { password?: string } }
  | { _action: 'retrieve', select?: (keyof User)[] | ['*'], where: WhereUser }
  | { _action: 'verifyEmail', email: string, code: string, password?: string }
  | { _action: 'requestCode', where: WhereUser, context?: string }
  | { _action: 'getUserWithToken', token: string, code?: string }
  | { _action: 'login', where: WhereUser, password?: string, createUserFields?: Partial<CreateUserFields>, createOnEmpty?: boolean }
  | { _action: 'loginGoogle', credential?: string, code?: string, createUserFields?: Partial<CreateUserFields>, createOnEmpty?: boolean }
  | { _action: 'loginWithCode', where: WhereUser, code: string, newPassword?: string, keepCode?: boolean }
  | { _action: 'event', eventName: 'resetPassword', where: WhereUser }

export type ManageUserResponse = EndpointResponse<User> & {
  isNew?: boolean
  token?: string
  user?: User
}

export class QueryManageUser extends UserBaseQuery {
  async run(params: ManageUserParams, meta: EndpointMeta): Promise<ManageUserResponse> {
    let user: User | undefined
    let isNew = false
    let message = ''
    let sendToken = false
    let token: string | undefined
    const { fictionUser } = this.settings

    const { _action } = params

    switch (_action) {
      case 'retrieve':{
        user = await this.getUser(params, meta)
        break
      }
      case 'create': {
        user = await this.createUser(params, meta)
        isNew = true
        sendToken = true
        break
      }
      case 'getCreate':{
        const r = await this.getCreateUser(params, meta)
        user = r.user
        isNew = r.isNew
        break
      }
      case 'getUserWithToken':
        user = await this.getUserWithToken(params, meta)
        sendToken = true
        break
      case 'update':
        user = await this.updateUser(params, meta)
        message = 'updated'
        break
      case 'updateCurrentUser':
        user = await this.updateCurrentUser(params, meta)
        message = 'updated'
        break
      case 'verifyEmail':
        user = await this.verifyEmail(params, meta)
        message = 'email verified'
        sendToken = true
        break
      case 'requestCode':
        user = await this.requestCode(params, meta)
        break
      case 'login': {
        const r = await this.loginUser(params, meta)
        user = r.user
        isNew = r.isNew
        sendToken = true
        message = 'login successful'
        break
      }
      case 'loginWithCode':{
        const r = await this.loginWithCode(params, meta)
        user = r.user
        sendToken = true
        break
      }
      case 'loginGoogle': {
        const r = await this.loginGoogle(params, meta)
        user = r.user
        isNew = r.isNew
        sendToken = true
        message = 'login successful'
        break
      }
      case 'event':
        user = await this.handleUserEvent(params, meta)
        break

      default:
        return { status: 'error', message: 'Invalid action', isNew }
    }

    if (isNew)
      message = 'user created'

    if (sendToken)
      token = user ? fictionUser.getToken(user) : undefined

    return this.prepareResponse({ _action, user, isNew, token, message, params }, meta)
  }

  private async handleUserEvent(params: ManageUserParams & { _action: 'event' }, _meta: EndpointMeta): Promise<User> {
    const { eventName, where } = params

    const fictionUser = this.settings.fictionUser

    const user = await this.getUser({ _action: 'retrieve', where }, _meta)

    if (!user)
      throw abort('user not found', { data: where })

    fictionUser.events.emit(eventName, { user })

    return user
  }

  private async getUser(params: ManageUserParams & { _action: 'retrieve' }, _meta: EndpointMeta): Promise<User | undefined> {
    const db = this.db()
    const { where } = params

    const q = db.select('*').from(t.user).where(where)

    const user = await q.first<User>()

    return user
  }

  private async getCreateUser(params: ManageUserParams & { _action: 'getCreate' }, _meta: EndpointMeta): Promise<{ user?: User, isNew: boolean }> {
    const { where, refreshCode, createUserFields } = params

    // First, try to get existing user
    let user = await this.getUser({ _action: 'retrieve', where }, _meta)

    if (user) {
      // User exists - just refresh code if requested
      if (refreshCode) {
        user = await this.requestCode({ _action: 'requestCode', where, context: 'getCreate' }, _meta)
      }
      return { user, isNew: false }
    }

    // User doesn't exist - create if email provided
    const { email } = where as { email?: string }
    if (email) {
    // Ensure onboard is properly merged
      const defaultFields = { email, onboard: { phase: 'initial' } } as const
      const fields = deepMerge([defaultFields, createUserFields || {}]) as CreateUserFields

      user = await this.createUser({ _action: 'create', fields }, { ..._meta, server: true })
      return { user, isNew: true }
    }

    // No user found and no email to create with
    return { user: undefined, isNew: false }
  }

  private async getUserWithToken(params: ManageUserParams & { _action: 'getUserWithToken' }, meta: EndpointMeta): Promise<User | undefined> {
    const { code, token } = params

    const tokenResult = this.settings.fictionUser.decodeToken(token)

    const { userId } = tokenResult

    const { data: user } = await this.settings.fictionUser.queries.ManageUser.serve({ _action: 'retrieve', where: { userId } }, { server: true, ...meta })

    if (!user?.emailVerified && code && user?.email) {
      await this.verifyEmail({ _action: 'verifyEmail', email: user.email, code }, meta)
    }

    return user
  }

  private async verifyEmail(params: ManageUserParams & { _action: 'verifyEmail' }, meta: EndpointMeta): Promise<User | undefined> {
    const { email, code, password } = params

    if (!email)
      throw abort('email required')

    const { fictionDb, fictionEnv, fictionUser } = this.settings

    await verifyCode({ email, verificationCode: code, fictionDb, isProd: fictionEnv?.isProd.value })

    const existingUser = await this.getUser({ _action: 'retrieve', where: { email } }, meta)

    if (!existingUser)
      throw abort('user not found', { data: { email } })

    const isNewVerification = !existingUser?.emailVerified

    const fields: Partial<User> = { emailVerified: true }

    if (password)
      fields.hashedPassword = await hashPassword(password)

    const { data: user } = await fictionUser.queries.ManageUser.serve({ _action: 'update', where: { email }, fields }, { ...meta, server: true })

    if (user && isNewVerification) {
      this.settings.fictionUser.events.emit('newUserVerified', { user })
    }

    return user
  }

  private async requestCode(params: ManageUserParams & { _action: 'requestCode' }, _meta: EndpointMeta): Promise<User | undefined> {
    const { where, context } = params

    const verify = { code: getCode(), expiresAt: dayjs().add(1, 'day').toISOString(), context }

    const [user] = await this.db().update({ verify }).where(where).into(t.user).returning<User[]>('*')

    return user
  }

  validateBearer(where: WhereUser, meta: EndpointMeta) {
    if (meta.server)
      return

    if (!meta?.bearer)
      throw abort('bearer required')

    // Check if the bearer's userId, email, or handle matches the respective fields in 'where', if they exist
    const isValid = (
      ('userId' in where && where.userId === meta.bearer.userId)
      || ('email' in where && meta.bearer.email && where.email.toLowerCase() === meta.bearer.email.toLowerCase())
      || ('handle' in where && where.handle === meta.bearer.handle)
    )

    // Throw an error if no valid fields match
    if (!isValid)
      throw abort('Bearer does not have the required permissions or invalid token')
  }

  async updatePassword(args: { where: WhereUser, password: string, code: string }, meta: EndpointMeta) {
    const { where, password, code } = args

    checkPasswordIsComplicated(password)

    await verifyCode({
      ...where,
      verificationCode: code,
      fictionDb: this.settings.fictionDb,
      isProd: this.settings.fictionEnv?.isProd.value,
    })

    const hashedPassword = await hashPassword(password)

    await this.db().table(t.user).update({ hashedPassword }).where(where).returning<User[]>('*')
  }

  private async updateUser(params: ManageUserParams & { _action: 'update' }, meta: EndpointMeta): Promise<User | undefined> {
    const { where, fields, code } = params
    const db = this.db()

    this.validateBearer(params.where, meta)

    const existingUser = await this.getUser({ _action: 'retrieve', where }, meta)

    const ipData = await getRequestIpAddress(meta.request)
    fields.ip = ipData.ip
    fields.geo = await getGeoFree(fields.ip)

    const updateType = meta?.server ? 'internal' : 'update'
    const insertFields = this.settings.fictionDb.prep({ type: updateType, fields, meta, table: t.user })

    // Handle password updates with hashing
    if (fields.password && code) {
      await this.updatePassword({ where, password: fields.password, code }, meta)
      delete fields.password // Remove plaintext password from fields
    }

    await validateNewEmail({
      newEmail: fields.email,
      code,
      fictionUser: this.settings.fictionUser,
      existingUser,
      onValidNewEmail: (newEmail) => {
        insertFields.email = newEmail
      },
    })

    if (insertFields.handle && 'userId' in where) {
      insertFields.handle = await ensureUniqueHandle({ db: this.db(), table: t.user, handle: insertFields.handle, excludeId: where.userId, idColumn: 'userId' })
    }

    this.log.debug('updating user', { data: { where, insertFields, fields } })

    const [user] = await db(t.user).update(insertFields).where(where).returning<User[]>('*')

    if (!user)
      throw abort(`user not found`, { data: where })

    this.settings.fictionUser.events.emit('updateUser', { user: existingUser! })

    return user
  }

  private async createDefaultOrganization(fields: CreateUserFields, meta: EndpointMeta) {
    const { fictionUser } = this.settings
    const { userId, email, orgId, onboard } = fields
    const db = this.db()
    if (!userId)
      throw abort('userId required to make default org')

    const name = fields.name || fields.fullName || defaultOrgName(email)

    const createFields = {
      name,
      email,
      orgId,
      onboard,
      ownerId: userId,
    }

    const response = await fictionUser.queries.ManageOrganization.serve(
      {
        _action: 'create',
        userId,
        fields: createFields,
        withDefaults: true,
      },
      { server: true, ...meta },
    )

    const org = response.data
    if (!org?.orgId)
      throw abort('problem creating default org')

    const [user] = await db(t.user).update({ loadOrgId: org?.orgId, primaryOrgId: org?.orgId }).where({ userId }).returning<User[]>('*')

    return { user, org }
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

    const password = fields.password

    if (password) {
      checkPasswordIsComplicated(password)

      fields.hashedPassword = await hashPassword(password)
    }

    if (fields.handle) {
      fields.handle = await ensureUniqueHandle({ db: this.db(), table: t.user, handle: fields.handle, idColumn: 'userId' })
    }

    const exists = await emailExists({ email: fields.email, fictionUser })

    if (exists)
      throw abort('email already exists')

    const ipData = await getRequestIpAddress(meta.request)
    fields.ip = ipData.ip
    fields.geo = await getGeoFree(fields.ip)

    const table = t.user
    const verify = { code: getCode(), expiresAt: dayjs().add(1, 'day').toISOString(), context: 'create' }
    const f = deepMerge([fields, { verify }])
    const insertFields = fictionDb.prep({ type: 'internal', fields: f, meta: { server: true }, table })

    const [user] = await db.insert(insertFields).into(table).returning<User[]>('*')

    if (!user.userId) {
      throw abort('couldn\'t create user', { data: { insertFields } })
    }

    fictionUser.events.emit('newUser', { user, params })

    return user
  }

  private async loginUser(params: ManageUserParams & { _action: 'login' }, meta: EndpointMeta): Promise<{ user?: User, isNew: boolean }> {
    const { where, password, createOnEmpty = false, createUserFields = {} } = params

    if (!password)
      throw abort('No password was provided.')

    const user = await this.getUser({ _action: 'retrieve', where }, meta)

    const email = 'email' in where ? where.email : ''

    if (!user && createOnEmpty && email) {
      const u = await this.createUser({ _action: 'create', fields: { ...createUserFields, email, password } }, meta)
      return { user: u, isNew: true }
    }
    else if (!user) {
      throw abort('No account found, create one?', { data: where, ...meta })
    }

    if (!user.hashedPassword)
      throw abort('There was no password.')

    const isMatch = await comparePassword(password, user.hashedPassword)

    if (!isMatch) {
      const msg = createOnEmpty ? 'Account exists, but password is incorrect' : 'Password is incorrect'
      throw abort(msg, meta)
    }

    const finalUser = await this.getUser({ _action: 'retrieve', where }, meta)
    return { user: finalUser, isNew: false }
  }

  private async loginWithCode(params: ManageUserParams & { _action: 'loginWithCode' }, meta: EndpointMeta): Promise<{ user?: User }> {
    const { where, code, newPassword, keepCode = false } = params

    if (!where || !code) {
      throw abort('email and code required')
    }

    const { fictionDb, fictionEnv } = this.settings

    // 1. Get user by email
    const user = await this.getUser({ _action: 'retrieve', where }, meta)
    if (!user) {
      throw abort('user not found', { code: 'RESOURCE_NOT_FOUND', data: where, ...meta })
    }

    // 2. Verify code with same security checks as email verification
    await verifyCode({
      ...where,
      verificationCode: code,
      fictionDb,
      isProd: fictionEnv?.isProd.value,
    })

    if (newPassword && code) {
      await this.updatePassword({ where, password: newPassword, code }, meta)
    }

    const updateFields: {
      [K in keyof User]: User[K] | null;
    } = { emailVerified: true }

    if (!keepCode) {
      updateFields.verify = null
    }

    // 3. After verification, clear the verification code to prevent reuse
    await this.db()
      .table(t.user)
      .update(updateFields)
      .where(where)

    const finalUser = await this.getUser({ _action: 'retrieve', where }, meta)

    return { user: finalUser }
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
      this.googleClient = new OAuth2Client({ clientId, clientSecret, redirectUri: 'postmessage' })

    return this.googleClient
  }

  private async loginGoogle(params: ManageUserParams & { _action: 'loginGoogle' }, meta: EndpointMeta): Promise<{ user?: User, isNew: boolean }> {
    const { credential, code, createUserFields = {}, createOnEmpty } = params

    const googleClient = await this.getGoogleClient()

    const googleClientId = this.settings.fictionUser.googleClientId

    let idToken = credential
    if (code) {
      const { tokens } = await googleClient.getToken(code)

      idToken = tokens.id_token as string
    }

    if (!idToken)
      throw abort('no idToken')

    const ticket = await googleClient.verifyIdToken({ idToken, audience: googleClientId })
    const payload = ticket.getPayload()

    const email = payload?.email

    if (!email)
      throw abort('no email from google')

    const { sub: googleId, name: fullName, email_verified: emailVerified, picture } = payload

    let user = await this.getUser({ _action: 'retrieve', where: { email } }, meta)
    let isNew = false

    if (!user && createOnEmpty) {
      isNew = true

      const f: CreateUserFields = { fullName, googleId, avatar: { url: picture }, ...createUserFields, email, emailVerified }

      user = await this.createUser({ _action: 'create', fields: f }, meta)
    }
    else if (!user) {
      throw abort('user not found', { code: 'RESOURCE_NOT_FOUND', data: { email }, ...meta })
    }

    if (user && !user.googleId && emailVerified) {
      await this.db().table(t.user).update({ googleId }).where({ userId: user.userId })
    }

    const finalUser = await this.getUser({ _action: 'retrieve', where: { email } }, meta)

    return { user: finalUser, isNew }
  }

  private async prepareResponse(args: {
    _action: ManageUserParams['_action']
    user?: User
    isNew: boolean
    token?: string
    message?: string
    params: ManageUserParams
  }, meta: EndpointMeta): Promise<ManageUserResponse> {
    const { isNew, token, message, params, _action } = args

    const user = this.settings.fictionDb.prep({ type: 'return', fields: args.user, table: t.user, meta })

    const fictionUser = this.settings.fictionUser
    if (user?.userId) {
      const orgsResponse = await fictionUser.queries.OrganizationsByUserId.serve(
        { userId: user.userId, loadOrgId: user.loadOrgId },
        { ...meta, caller: 'processUserGetOrgs', server: true },
      )

      user.orgs = orgsResponse.data ?? []

      const hasOrgs = user.orgs?.filter(_ => _.orgId !== 'system').length > 0

      // this ensures that a user has at least one org
      if (orgsResponse.status === 'success' && !hasOrgs) {
        const p = params as ManageUserParams & { _action: 'create', createUserFields?: CreateUserFields }
        const createFields = deepMerge([p.fields || p.createUserFields, { email: user.email, userId: user.userId }]) as CreateUserFields
        const { org } = await this.createDefaultOrganization(createFields, meta)

        if (org) {
          user.orgs = [org, ...(user.orgs || [])]
          user.loadOrgId = org.orgId
        }
      }
    }

    if (isNew && user)
      fictionUser.events.emit('newUser', { user, params: params as ManageUserParams & { _action: 'create' } })

    const response: ManageUserResponse = { status: 'success', data: user, isNew, token, message, user }

    // replace the user state if the bearer is user being updated
    if (meta?.bearer && meta?.bearer.userId === user?.userId)
      response.user = user

    return response
  }
}
