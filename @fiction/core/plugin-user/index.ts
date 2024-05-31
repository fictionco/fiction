// importing this endpoint module is here to fix a bug in DTS generation
// likely fixed in TS 4.8
// https://github.com/microsoft/TypeScript/issues/48212
import '../utils/endpoint'
import type { FictionPluginSettings } from '../plugin'
import { FictionPlugin } from '../plugin'
import { getAccessLevel, userCan, userCapabilities } from '../utils/priv'
import { EnvVar, vars } from '../plugin-env'
import type { FictionServer } from '../plugin-server'
import type { FictionDb } from '../plugin-db'
import type { FictionEmail } from '../plugin-email'
import type { FictionRouter } from '../plugin-router'
import { _stop, emitEvent, hasWindow, isActualBrowser, isNode, safeDirname, vue } from '../utils'
import * as priv from '../utils/priv'
import { standardTable } from '../tbl'
import { createUserToken, decodeUserToken, manageClientUserToken } from '../utils/jwt'
import { TypedEventTarget } from '../utils/eventTarget'
import type { Organization, OrganizationMember, User } from './types'
import { QueryManageMemberRelation, QueryManageOrganization, QueryOrganizationsByUserId } from './endpointOrg'
import { type ManageUserParams, QueryManageUser } from './endpoint'
import { getAdminTables } from './schema'

export * from './types'

vars.register(() => [
  new EnvVar({ name: 'GOOGLE_CLIENT_ID', isPublic: true, isOptional: true }),
  new EnvVar({ name: 'GOOGLE_CLIENT_SECRET', isOptional: true }),
  new EnvVar({ name: 'TOKEN_SECRET' }),
])

export type UserPluginSettings = {
  fictionServer?: FictionServer
  fictionDb: FictionDb
  fictionEmail?: FictionEmail
  fictionRouter?: FictionRouter
  googleClientId?: string
  googleClientSecret?: string
  tokenSecret?: string
} & FictionPluginSettings

export type UserEventMap = {
  newUser: CustomEvent<{ user: User, params: ManageUserParams & { _action: 'create' } }>
  updateUser: CustomEvent<{ user: User, newEmail?: string, passwordChanged?: boolean }>
  logout: CustomEvent<{ user?: User }>
  currentUser: CustomEvent<{ user?: User }>
  resetPassword: CustomEvent<{ user: User }>
}

export class FictionUser extends FictionPlugin<UserPluginSettings> {
  priv = priv
  activeUser = vue.ref<User>()
  initialized?: Promise<boolean>
  resolveUser?: (value: boolean | PromiseLike<boolean>) => void
  events = new TypedEventTarget<UserEventMap>({ fictionEnv: this.settings.fictionEnv })
  tokenSecret = this.settings.tokenSecret
  activePath = vue.ref(safeDirname(import.meta.url))
  googleClientId = this.settings.googleClientId
  googleClientSecret = this.settings.googleClientSecret
  queries = {
    ManageUser: new QueryManageUser({ ...this.settings, fictionUser: this }),
    ManageOrganization: new QueryManageOrganization({ ...this.settings, fictionUser: this }),
    ManageMemberRelation: new QueryManageMemberRelation({ ...this.settings, fictionUser: this }),
    OrganizationsByUserId: new QueryOrganizationsByUserId({ ...this.settings, fictionUser: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/user',
    fictionServer: this.settings.fictionServer,
    fictionUser: this,
  })

  getToken = (user: User) => createUserToken({ user, tokenSecret: this.tokenSecret })
  decodeToken = (token: string) => decodeUserToken({ token, tokenSecret: this.tokenSecret })

  constructor(settings: UserPluginSettings) {
    super('user', settings)

    this.settings.fictionDb.addTables(getAdminTables())

    // add fictionUser to server as it can't be added in constructur
    // this plugin already requires the server module
    if (this.settings.fictionServer)
      this.settings.fictionServer.fictionUser = this

    this.settings.fictionRouter?.addReplacers({ orgId: this.activeOrgId })

    this.settings.fictionEnv?.hooks.push({ hook: 'dbOnConnected', callback: () => this.ensureExampleOrganization() })
  }

  /** Typically Invoked from Main File */
  init() {
    // redirect based on auth
    // only check if is browser not during prerender
    // anywhere else we don't know logged in status
    if (isActualBrowser()) {
      this.userInitialized({ caller: 'init' }).catch(console.error)

      this.watchRouteUserChanges().catch(console.error)
    }
  }

  userTokenKey = 'fictionUser'
  manageUserToken = (args: { _action?: 'set' | 'get' | 'destroy', token?: string } = {}) => manageClientUserToken({ key: this.userTokenKey, ...args })

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
      relation[k] = !!(relation && userCan({ capability: k, memberAccess: relation.memberAccess }))
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

  setActiveOrgId = async (orgId?: string): Promise<void> => {
    const user = this?.activeUser.value
    const org = this.getOrgById(orgId)

    if (user?.userId && org && org.orgId !== this.lastOrgId.value) {
      /**
       * Update lastOrgId
       * Make sure to update user or it wont remember the active org
       */
      const r = await this?.requests.ManageUser.request(
        { _action: 'update', where: { userId: user.userId }, fields: { lastOrgId: org.orgId } },
        { disableNotify: true, disableUserUpdate: true },
      )

      if (r?.data)
        await this?.updateUser(() => r.data, { reason: 'watchRouteUserChanges' })
    }
  }

  watchRouteUserChanges = async (): Promise<void> => {
    if (!hasWindow())
      return

    await this?.pageInitialized()

    vue.watch(
      () => this.settings.fictionRouter?.current.value,
      async (route) => {
        if (!route)
          return

        const routeVars = { ...route.params, ...route.query } as Record<string, string | undefined>

        const { logout, orgId } = routeVars

        if (logout) {
          await this?.logout({ caller: 'watchRouteUserChanges-logout-param' })
          return
        }

        if (orgId)
          await this.setActiveOrgId(orgId)
      },
      { immediate: true },
    )
  }

  async ensureExampleOrganization() {
    if (isNode()) {
      const db = this.settings.fictionDb.client()
      await db
        .insert({ orgName: 'Example Inc.', orgEmail: 'admin@fiction.com', orgId: 'example' })
        .into(standardTable.org)
        .onConflict()
        .ignore()

      await db
        .insert({ fullName: 'Admin', userId: 'admin', email: 'admin@fiction.com' })
        .onConflict()
        .ignore()
        .into('fiction_user')
    }
  }

  deleteCurrentUser = (): void => {
    this.log.info(`deleted current user`)
    this.manageUserToken({ _action: 'destroy' })
    this.activeUser.value = undefined
    this.initialized = undefined
  }

  setCurrentUser = (args: { user: User | undefined, token?: string, reason?: string }): void => {
    const { user, token = '' } = args

    if (!user)
      return this.deleteCurrentUser()

    if (token)
      this.manageUserToken({ _action: 'set', token })

    this.activeUser.value = user
  }

  async logout(args: { callback?: () => void, redirect?: string, caller?: string } = {}) {
    const { caller = 'unknown', redirect, callback } = args
    const user = this.activeUser.value

    this.deleteCurrentUser()

    this.events.emit('logout', { user })
    this.fictionEnv.events.emit('resetUi', { scope: 'all', cause: 'logout' })

    if (callback)
      callback()

    // reload the page to clear any state
    if (redirect) {
      this.log.warn(`redirecting due to logout redirect (${caller})`)
      window.location.href = redirect
    }

    else {
      const url = new URL(window.location.href)

      // If no redirect is provided, modify the URL to remove 'logout' query param
      if (url.searchParams.has('logout') || url.searchParams.has('token')) {
        this.log.warn(`redirecting due to logout (${caller})`)
        url.searchParams.delete('logout')
        url.searchParams.delete('token')
        window.location.href = url.toString()
      }
    }
  }

  requestCurrentUser = async (): Promise<User | undefined> => {
    const token = this.manageUserToken({ _action: 'get' })

    let user: User | undefined

    if (token && this.requests) {
      const { status, data, code } = await this.requests.ManageUser.request({ _action: 'getUserWithToken', token })

      // If there is a token error, then delete it and force login
      if (status === 'error' && code === 'TOKEN_ERROR')
        await this.logout({ caller: 'requestCurrentUser-TOKEN_ERROR' })

      user = data

      if (user)
        this.setCurrentUser({ user, reason: 'currentUser' })
    }

    this.events.emit('currentUser', { user })

    this.log.info('user loaded', { data: { user } })

    return user
  }

  setUserInitialized = (): void => {
    if (this.resolveUser)
      this.resolveUser(true)
  }

  userInitialized = async (args?: { caller?: string }): Promise<User | undefined> => {
    const { caller = 'unknown' } = args || {}

    if (!isActualBrowser()) {
      this.log.warn('user initialization called on server', { data: { caller } })
      return
    }

    if (!this.initialized) {
      this.log.info('initializing user', { data: { caller } })
      this.initialized = new Promise(async (resolve) => {
        this.resolveUser = resolve
        await this.requestCurrentUser()
        resolve(true)
      })
    }

    await this.initialized

    return this.activeUser.value
  }

  pageInitialized = async (): Promise<void> => {
    await Promise.all([
      this.userInitialized({ caller: 'pageInitialized' }),
      this.settings.fictionRouter?.router.value?.isReady(),
    ])
  }

  updateUser = async (
    cb: (user: User | undefined,) => User | undefined | Promise<User | undefined>,
    args: { reason?: string } = {},
  ): Promise<void> => {
    const { reason = 'updateUser' } = args
    const newUser = await cb(this.activeUser.value)
    if (newUser)
      this.setCurrentUser({ user: newUser, reason })
  }
}
