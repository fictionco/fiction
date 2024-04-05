import jwt from 'jsonwebtoken'

// importing this endpoint module is here to fix a bug in DTS generation
// likely fixed in TS 4.8
// https://github.com/microsoft/TypeScript/issues/48212
import '../utils/endpoint'
import type { EndpointMeta } from '../utils'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import type { HookType } from '../utils/hook'
import { getAccessLevel, userCan, userCapabilities } from '../utils/priv'
import { EnvVar, vars } from '../plugin-env'
import type { FictionServer } from '../plugin-server'
import type { FictionDb } from '../plugin-db'
import type { FictionEmail } from '../plugin-email'
import type { FictionRouter } from '../plugin-router'
import { _stop, emitEvent, getCookie, hasWindow, isActualBrowser, isNode, removeCookieNakedDomain, runHooks, safeDirname, setCookieNakedDomain, storeItem, vue } from '../utils'
import * as priv from '../utils/priv'
import type { Organization, OrganizationMember, TokenFields, User } from './types'
import { QueryUserGoogleAuth } from './userGoogle'
import type { ManageOrganizationParams, ManageUserParams, SetPasswordParams } from './endpoints'
import {
  QueryCurrentUser,
  QueryFindOneOrganization,
  QueryGenerateApiSecret,
  QueryLogin,
  QueryManageMemberRelation,
  QueryManageOnboard,
  QueryManageOrganization,
  QueryManageUser,
  QueryNewVerificationCode,
  QueryOrganizationsByUserId,
  QueryResetPassword,
  QuerySendOneTimeCode,
  QuerySetPassword,
  QueryStartNewUser,
  QueryUpdateCurrentUser,
  QueryUpdateOrganizationMemberStatus,
  QueryVerifyAccountEmail,
} from './endpoints'
import { getAdminTables } from './tables'

export * from './types'

vars.register(() => [
  new EnvVar({ name: 'GOOGLE_CLIENT_ID', isPublic: true, isOptional: true }),
  new EnvVar({ name: 'GOOGLE_CLIENT_SECRET', isOptional: true }),
  new EnvVar({ name: 'TOKEN_SECRET' }),
])

export type FictionUserHookDictionary = {
  onLogout: { args: [] }
  onUserVerified: { args: [User] }
  requestCurrentUser: { args: [User | undefined] }
  processUser: {
    args: [User | undefined, { params: ManageUserParams, meta?: EndpointMeta }]
  }
  createUser: {
    args: [User, { params: ManageUserParams, meta?: EndpointMeta }]
  }
  createPassword: {
    args: [User, { params: SetPasswordParams, meta?: EndpointMeta }]
  }
  updateOrganization: {
    args: [
      Organization,
      { params: ManageOrganizationParams, meta?: EndpointMeta },
    ]
  }
  onSetClientToken: {
    args: [string]
  }
}

export type UserPluginSettings = {
  fictionServer?: FictionServer
  fictionDb: FictionDb
  fictionEmail?: FictionEmail
  fictionRouter?: FictionRouter
  googleClientId?: string
  googleClientSecret?: string
  hooks?: HookType<FictionUserHookDictionary>[]
  tokenSecret?: string
} & FictionPluginSettings

export class FictionUser extends FictionPlugin<UserPluginSettings> {
  priv = priv

  activeUser = vue.ref<User>()
  initialized?: Promise<boolean>
  resolveUser?: (value: boolean | PromiseLike<boolean>) => void
  hooks = this.settings.hooks || []
  tokenSecret = this.settings.tokenSecret || 'secret'
  activePath = vue.ref(safeDirname(import.meta.url))
  clientTokenKey = 'FCurrentUser'
  googleClientId = this.settings.googleClientId
  googleClientSecret = this.settings.googleClientSecret
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    basePath: '/user',
    fictionServer: this.settings.fictionServer,
    fictionUser: this,
  })

  constructor(settings: UserPluginSettings) {
    super('user', settings)

    this.settings.fictionDb.addTables(getAdminTables())

    // add fictionUser to server as it can't be added in constructur
    // this plugin already requires the server module
    if (this.settings.fictionServer)
      this.settings.fictionServer.fictionUser = this

    this.settings.fictionRouter?.addReplacers({ orgId: this.activeOrgId })

    this.settings.fictionDb?.hooks.push({
      hook: 'onStart',
      callback: async () => {
        await this.ensureExampleOrganization()
      },
    })
  }

  init() {
    // redirect based on auth
    // only check if is browser not during prerender
    // anywhere else we don't know logged in status
    if (isActualBrowser()) {
      this.userInitialized({ caller: 'init' }).catch(console.error)

      this.watchRouteForOrgChange().catch(console.error)
    }
  }

  activeOrganizations = vue.computed<Organization[]>({
    get: () => {
      const activeUser = this?.activeUser.value
      const out = activeUser?.orgs ?? []
      return out
    },
    set: async (value) => {
      await this?.updateUser(
        (existingUser?: User) => {
          if (!existingUser)
            return
          existingUser.orgs = value
          return existingUser
        },
        { reason: 'setComputed' },
      )
    },
  })

  fallbackOrgId = vue.computed((): string | undefined => this.activeOrganizations.value.find(o => o.lastOrgId)?.orgId || this.activeOrganizations.value[0]?.orgId)
  lastOrgId = vue.computed((): string | undefined => this.activeOrganizations.value.find(o => o.lastOrgId)?.orgId)
  activeOrgId = vue.computed<string | undefined>(() => this.activeOrganization.value?.orgId)

  activeOrganization = vue.computed<Organization | undefined>({
    get: () => {
      const cur = this.settings.fictionRouter?.current.value
      const rawRouteId = (cur?.params?.orgId || cur?.query?.orgId || '') as string
      const routeOrgId = rawRouteId.replaceAll('-', '')

      const activeOrg = this.getOrgById(routeOrgId) || this.getOrgById(this.fallbackOrgId.value)

      return activeOrg
    },
    set: (value) => {
      if (!value)
        return

      const orgs = this.activeOrganizations.value ?? []

      this.activeOrganizations.value = orgs.map(org => ((org.orgId === value.orgId) ? value : org))
    },
  })

  activeRelation = vue.computed<OrganizationMember | undefined>(() => {
    const relation = this.activeOrganization.value?.relation
    if (!relation)
      return
    Object.entries(userCapabilities).forEach(([key, _value]) => {
      const k = key as keyof typeof userCapabilities
      relation[k]
        = !!(relation
        && userCan({
          capability: k,
          memberAccess: relation.memberAccess,
        }))
    })

    relation.accessLevel = getAccessLevel(relation.memberAccess)
    return this.activeOrganization.value?.relation
  })

  /**
   * Get the organization from a orgId
   */
  getOrgById = (orgId?: string): Organization | undefined => {
    const orgs = this.activeOrganizations.value

    let org: Organization | undefined
    if (orgId)
      org = orgs.find(o => o.orgId === orgId)

    return org
  }

  watchRouteForOrgChange = async (): Promise<void> => {
    if (!hasWindow())
      return

    await this?.pageInitialized()

    const r = this.settings.fictionRouter?.router.value

    if (!r)
      return

    vue.watch(
      () => r.currentRoute.value,
      async (route) => {
        const user = this?.activeUser.value
        if (user && user.email) {
          /**
           * If new orgId, update user with lastOrgId for state
           */
          const orgId = (route.params.orgId || route.query.orgId) as string | undefined
          const org = this.getOrgById(orgId)

          if (org && org.orgId !== this.lastOrgId.value) {
            /**
             * Update lastOrgId
             * Make sure to update user or it wont remember the active org
             */
            const r = await this?.requests.ManageUser.request(
              { _action: 'update', email: user.email, fields: { lastOrgId: org.orgId } },
              { disableNotify: true, disableUserUpdate: true },
            )

            if (r?.data)
              await this?.updateUser(() => r.data, { reason: 'watchRouteForOrgChange' })
          }
        }
      },
      { immediate: true },
    )
  }

  async ensureExampleOrganization() {
    if (isNode()) {
      const db = this.settings.fictionDb.client()
      await db
        .insert({
          orgName: 'Example Inc.',
          orgEmail: 'admin@fiction.com',
          orgId: 'example',
        })
        .into(this.tbl.org)
        .onConflict()
        .ignore()

      await db
        .insert({
          firstName: 'Admin',
          lastName: 'Admin',
          userId: 'admin',
          email: 'admin@fiction.com',
        })
        .onConflict()
        .ignore()
        .into('fiction_user')
    }
  }

  // async verifyRouteAuth(params: {
  //   route: vueRouter.RouteLocationNormalized
  // }): Promise<NavigateRoute> {
  //   const { route } = params
  //   const user = await this.userInitialized({ caller: 'verifyRouteAuth' })

  //   const { matched } = route

  //   const results = await Promise.all(
  //     matched
  //       .filter(_ => _.meta.auth)
  //       .map(async (r) => {
  //         const auth = r.meta.auth as RouteAuthCallback
  //         return await auth({
  //           user,
  //           isSearchBot: isSearchBot(),
  //           fictionRouter: this.settings.fictionRouter,
  //           fictionUser: this,
  //           route,
  //         })
  //       }),
  //   )

  //   const changeNav = results
  //     .reverse()
  //     .find(
  //       params =>
  //         params?.navigate === false || params?.navigate !== undefined,
  //     )

  //   if (changeNav) {
  //     const result = await changeNav?.navigate
  //     this.log.debug(
  //       `route altered by ${changeNav.id} reason: ${changeNav.reason}`,
  //       { data: changeNav },
  //     )
  //     return result
  //   }
  //   else {
  //     return true
  //   }
  // }

  createQueries() {
    const deps = { ...this.settings, fictionUser: this as FictionUser }

    return {
      UserGoogleAuth: new QueryUserGoogleAuth({ clientId: this.googleClientId, clientSecret: this.googleClientSecret, ...deps }),
      Login: new QueryLogin(deps),
      NewVerificationCode: new QueryNewVerificationCode(deps),
      SetPassword: new QuerySetPassword(deps),
      ResetPassword: new QueryResetPassword(deps),
      UpdateCurrentUser: new QueryUpdateCurrentUser(deps),
      SendOneTimeCode: new QuerySendOneTimeCode(deps),
      VerifyAccountEmail: new QueryVerifyAccountEmail(deps),
      StartNewUser: new QueryStartNewUser(deps),
      CurrentUser: new QueryCurrentUser(deps),
      ManageUser: new QueryManageUser(deps),
      ManageOrganization: new QueryManageOrganization(deps),
      ManageMemberRelation: new QueryManageMemberRelation(deps),
      GenerateApiSecret: new QueryGenerateApiSecret(deps),
      FindOneOrganization: new QueryFindOneOrganization(deps),
      OrganizationsByUserId: new QueryOrganizationsByUserId(deps),
      UpdateOrganizationMemberStatus: new QueryUpdateOrganizationMemberStatus(deps),
      ManageOnboard: new QueryManageOnboard(deps),
    } as const
  }

  addHook(hook: HookType<FictionUserHookDictionary>): void {
    this.hooks.push(hook)
  }

  deleteCurrentUser = (): void => {
    this.log.info(`deleted current user`)
    this.clientToken({ action: 'destroy' })
    this.activeUser.value = undefined
  }

  cacheUser = ({ user }: { user: Partial<User> }): void => {
    if (user && user.userId)
      storeItem(user.userId, user)
  }

  setCurrentUser = (args: {
    user: User | undefined
    token?: string
    reason?: string
  }): void => {
    const { user, token = '' } = args

    if (!user)
      return this.deleteCurrentUser()

    if (token)
      this.clientToken({ action: 'set', token })

    this.activeUser.value = user

    this.cacheUser({ user })
  }

  async logout(args: { callback?: () => void, redirect?: string } = {}) {
    this.deleteCurrentUser()
    emitEvent('logout')
    emitEvent('resetUi')

    await runHooks({ list: this.hooks, hook: 'onLogout', args: [] })

    if (args.callback)
      args.callback()

    // reload the page to clear any state
    if (args.redirect)
      window.location.href = args.redirect
  }

  requestCurrentUser = async (): Promise<User | undefined> => {
    const token = this.clientToken({ action: 'get' })

    let user: User | undefined

    if (token && this.requests) {
      const { status, data, code } = await this.requests.CurrentUser.request({ token })

      // If there is a token error, then delete it and force login
      if (status === 'error' && code === 'TOKEN_ERROR')
        await this.logout()

      user = data

      if (user)
        this.setCurrentUser({ user, reason: 'currentUser' })
    }

    await runHooks({
      list: this.hooks,
      hook: 'requestCurrentUser',
      args: [user],
    })

    this.log.debug('user loaded', { data: { user } })

    return user
  }

  setUserInitialized = (): void => {
    if (this.resolveUser)
      this.resolveUser(true)
  }

  userInitialized = async (
    args?: { caller?: string, callback?: (u: User | undefined) => void },
  ): Promise<User | undefined> => {
    const { caller = 'unknown', callback } = args || {}

    if (!this.initialized) {
      this.log.info('initializing user', { data: { caller } })
      this.initialized = new Promise(async (resolve) => {
        this.resolveUser = resolve
        await this.requestCurrentUser()
        resolve(true)
      })
    }

    await this.initialized

    if (callback)
      callback(this.activeUser.value)

    return this.activeUser.value
  }

  pageInitialized = async (): Promise<void> => {
    await Promise.all([
      this.userInitialized({ caller: 'pageInitialized' }),
      this.settings.fictionRouter?.router.value?.isReady(),
    ])
  }

  updateUser = async (
    cb: (
      user: User | undefined,
    ) => User | undefined | Promise<User | undefined>,
    args: { reason?: string } = {},
  ): Promise<void> => {
    const { reason = 'updateUser' } = args
    const newUser = await cb(this.activeUser.value)
    if (newUser)
      this.setCurrentUser({ user: newUser, reason })
  }

  clientToken = (
    args: {
      action?: 'set' | 'get' | 'destroy'
      token?: string
    } = {},
  ): string | undefined => {
    if (typeof window === 'undefined') {
      if (args.action === 'get')
        return
      this.log.warn('browser functions not available, set client token', { data: args })
      return
    }

    const { action = 'get', token } = args

    if (action === 'destroy') {
      removeCookieNakedDomain({ name: this.clientTokenKey })
    }
    else if (action === 'set' && token) {
      runHooks({ list: this.hooks, hook: 'onSetClientToken', args: [token] }).catch(console.error)

      setCookieNakedDomain({ name: this.clientTokenKey, value: token, attributes: { expires: 14, sameSite: 'Lax' } })
    }
    else {
      const cookieValue = getCookie(this.clientTokenKey)

      return cookieValue || ''
    }
  }

  /**
   * Returns a user authentication credential including token for storage in client
   */
  createClientToken = (user: Partial<User>): string => {
    const { role = '', userId, email } = user
    return jwt.sign({ role, userId, email }, this.tokenSecret)
  }

  /**
   * Take a JWT token and decode into the associated user _id
   */
  decodeClientToken = (token: string): TokenFields => {
    const r = jwt.verify(token, this.tokenSecret) as TokenFields

    if (!r.userId || !r.email)
      throw _stop('token missing userId or email', { code: 'TOKEN_ERROR' })

    return r
  }
}
