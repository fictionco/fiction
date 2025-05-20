import type { FictionApp } from '../plugin-app/index.js'
import type { FictionDb } from '../plugin-db/index.js'
import type { FictionEmail } from '../plugin-email/index.js'
import type { FictionRouter } from '../plugin-router/index.js'
import type { FictionServer } from '../plugin-server/index.js'
// importing this endpoint module is here to fix a bug in DTS generation
import type { FictionPluginSettings } from '../plugin.js'
import type { ManageUserParams } from './endpoint.js'
import type { Organization, OrganizationMember, User } from './types.js'
import { HooksUtil } from '@fiction/core/utils/hook.js'
import { EnvVar, vars } from '../plugin-env/index.js'
// likely fixed in TS 4.8
import { FictionPlugin } from '../plugin.js'
import { TypedEventTarget } from '../utils/eventTarget.js'
import { isActualBrowser, safeDirname, vue } from '../utils/index.js'
import { createUserToken, decodeUserToken, manageClientUserToken } from '../utils/jwt.js'
import { getAccessLevel, userCan, userCapabilities } from '../utils/priv.js'
import * as priv from '../utils/priv.js'
import { QueryManageUser } from './endpoint.js'
import { QueryManageMemberRelation, QueryManageOrganization, QueryOrganizationsByUserId } from './endpointOrg.js'
import { GetTopValues } from './endpointTopValues.js'
import { FictionUserEnrich } from './enrich/pluginEnrich.js'
import { getAdminTables } from './schema.js'
import { setupSystemOrg } from './utils/systemOrg.js'
// https://github.com/microsoft/TypeScript/issues/48212
import '../utils/endpoint'

export * from './types.js'

vars.register(() => [
  new EnvVar({ name: 'GOOGLE_CLIENT_ID', isPublic: true, isOptional: true }),
  new EnvVar({ name: 'GOOGLE_CLIENT_SECRET', isOptional: true }),
  new EnvVar({ name: 'TOKEN_SECRET' }),
  new EnvVar({ name: 'APOLLO_API_KEY' }),
])

export type UserPluginSettings = {
  fictionServer?: FictionServer
  fictionDb: FictionDb
  fictionEmail?: FictionEmail
  fictionRouter?: FictionRouter
  fictionApp?: FictionApp
  googleClientId?: string
  googleClientSecret?: string
  tokenSecret?: string
  apolloApiKey?: string
} & FictionPluginSettings

export type UserEventMap = {
  newUser: CustomEvent<{ user: User, params: ManageUserParams & { _action: 'create' } }>
  newUserVerified: CustomEvent<{ user: User }>
  updateUser: CustomEvent<{ user: User, newEmail?: string }>
  logout: CustomEvent<{ user?: User }>
  currentUser: CustomEvent<{ user?: User }>
  resetPassword: CustomEvent<{ user: User }>
}

export type UserHookEvents = {
  newUser: (args: { user: User, params: ManageUserParams & { _action: 'create' } }) => Promise<void>
  updateUser: (args: { user: User, newEmail?: string }) => Promise<void>
  newOrg: (args: { org: Organization, userId?: string, withDefaults?: boolean }) => Promise<void>
  updateOrg: (args: { org: Organization, userId: string }) => Promise<void>

}

export class FictionUser extends FictionPlugin<UserPluginSettings> {
  priv = priv
  hooks = new HooksUtil<UserHookEvents>()
  userTokenKey = 'fictionAuthToken'
  activeUser = vue.ref<User>()
  initialized?: Promise<boolean>
  fictionUserEnrich?: FictionUserEnrich
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
    GetTopValues: new GetTopValues({ ...this.settings, fictionUser: this }),
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

    const { fictionEnv, fictionDb, fictionRouter } = settings

    fictionDb.addTables(getAdminTables())

    this.serverHandling()

    fictionRouter?.addReplacers({ orgId: this.activeOrgId })

    if (!fictionEnv.isApp.value)
      this.fictionUserEnrich = new FictionUserEnrich({ ...settings, fictionUser: this })

    this.initBrowser()

    this.settings.fictionEnv.hooks.on('generate', 'setup:systemOrg', async () => {
      await setupSystemOrg({ fictionUser: this })
    })
  }

  serverHandling() {
    if (this.settings.fictionServer) {
      // add fictionUser to server as it can't be added in constructur
      // this plugin already requires the server module
      this.settings.fictionServer.fictionUser = this
    }
  }

  initBrowser() {
    // redirect based on auth
    // only check if is browser not during prerender
    // anywhere else we don't know logged in status
    if (isActualBrowser()) {
      this.userInitialized({ caller: 'init' }).catch(console.error)

      // this.watchRouteUserChanges().catch(console.error)
    }
  }

  manageUserToken = (args: { _action?: 'set' | 'get' | 'destroy', token?: string } = {}) => manageClientUserToken({ key: this.userTokenKey, ...args })

  activeOrganizations = vue.computed<Organization[]>({
    get: () => {
      return [...this.activeUser.value?.orgs ?? []]
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

  fallbackOrgId = vue.computed((): string | undefined => this.activeOrganizations.value.find(o => o.loadOrgId)?.orgId || this.activeOrganizations.value[0]?.orgId)
  loadOrgId = vue.computed((): string | undefined => this.activeOrganizations.value.find(o => o.loadOrgId)?.orgId)
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

      // get new org list, making sure to retain loadOrgId if it exists
      const newOrgs = orgs.map((org) => {
        return org.orgId === value.orgId ? { loadOrgId: org.loadOrgId, ...value } : org
      })

      this.activeOrganizations.value = newOrgs
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

  setNewActiveOrgId = async (args: { orgId?: string, caller?: string }): Promise<void> => {
    const { orgId } = args
    const user = this?.activeUser.value
    const org = this.getOrgById(orgId)

    if (user?.userId && org && org.orgId !== this.loadOrgId.value) {
      /**
       * Update loadOrgId
       * Make sure to update user or it wont remember the active org
       */
      const r = await this?.requests.ManageUser.request(
        { _action: 'update', where: { userId: user.userId }, fields: { loadOrgId: org.orgId } },
        { disableNotify: true, disableUserUpdate: true },
      )

      // this should update the client side active org
      if (r?.data) {
        await this?.updateUser(() => r.data, { reason: 'watchRouteUserChanges' })
      }
    }
  }

  deleteCurrentUser(): void {
    this.log.info(`deleted current user`)
    this.manageUserToken({ _action: 'destroy' })
    this.activeUser.value = undefined
    this.initialized = undefined
  }

  async setCurrentUser(args: { user?: User, token?: string, reason?: string }): Promise<User | undefined> {
    let { user, token = '' } = args

    if (token) {
      this.manageUserToken({ _action: 'set', token })

      // new token but no user, so get user
      if (!user) {
        user = await this.requestCurrentUser()
      }
    }

    this.activeUser.value = user

    return user
  }

  async logout(args: { callback?: () => void, redirect?: string, caller?: string } = {}) {
    const { caller = 'unknown', redirect, callback } = args
    const user = this.activeUser.value

    this.deleteCurrentUser()

    this.events.emit('logout', { user })
    this.fictionEnv.events.emit('resetUi', { scope: 'all', cause: 'logout', trigger: 'manualReset' })
    this.fictionEnv.events.emit('notify', { type: 'success', message: 'You have been logged out.' })

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
      // remove 'token' due to recursion that occurs if token error, triggers logout, trigger another login attempt
      if (url.searchParams.has('_logout')) {
        this.log.warn(`redirecting due to _logout (${caller})`)
        url.searchParams.delete('_logout')
        window.location.href = url.toString()
      }
    }
  }

  async requestCurrentUser(): Promise<User | undefined> {
    const token = this.manageUserToken({ _action: 'get' })

    let user: User | undefined

    if (token && this.requests) {
      const { status, data, code } = await this.requests.ManageUser.request({ _action: 'getUserWithToken', token })

      // If there is a token error, then delete it and force login
      if (status === 'error' && code === 'TOKEN_ERROR')
        await this.logout({ caller: 'requestCurrentUser-TOKEN_ERROR' })

      user = data

      if (user)
        await this.setCurrentUser({ user, reason: 'currentUser' })
    }

    this.events.emit('currentUser', { user })

    return user
  }

  setUserInitialized = (): void => {
    if (this.resolveUser)
      this.resolveUser(true)
  }

  userInitialized = async (args: { caller: string }): Promise<User | undefined> => {
    const { caller = 'unknown' } = args || {}

    if (typeof window === 'undefined') {
      this.log.warn(`user initialization called on server from (${caller})`)
      return
    }

    if (!this.initialized) {
      this.log.info('initializing user', { data: { caller } })
      this.initialized = new Promise(async (resolve, reject) => {
        this.resolveUser = resolve
        try {
          await this.requestCurrentUser()
          resolve(true)
        }
        catch (err) {
          reject(err)
        }
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
      await this.setCurrentUser({ user: newUser, reason })
  }

  userImages() {
    return {
      user: new URL('img/user-avatar.png', import.meta.url).href,
      org: new URL('img/org-avatar.png', import.meta.url).href,
    }
  }
}
