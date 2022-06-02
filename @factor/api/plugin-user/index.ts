import jwt from "jsonwebtoken"
import { FactorPlugin } from "../plugin"
import { HookType } from "../utils/hook"
import { vars, EnvVar } from "../plugin-env"
import { QueryUserGoogleAuth } from "./userGoogle"
import {
  QueryCurrentUser,
  QueryLogin,
  QueryManageUser,
  QueryNewVerificationCode,
  QueryResetPassword,
  QuerySendOneTimeCode,
  QuerySetPassword,
  QueryStartNewUser,
  QueryUpdateCurrentUser,
  QueryVerifyAccountEmail,
} from "./endpoints"
import * as types from "./types"
export * from "./types"

vars.register(() => [
  new EnvVar({
    name: "googleClientSecret",
    val: process.env.GOOGLE_CLIENT_SECRET,
  }),
  new EnvVar({ name: "tokenSecret", val: process.env.FACTOR_TOKEN_SECRET }),
])

export class FactorUser extends FactorPlugin<types.UserPluginSettings> {
  readonly types = types
  private factorServer = this.settings.factorServer
  private factorDb = this.settings.factorDb
  private factorEmail = this.settings.factorEmail

  public activeUser = this.utils.vue.ref<types.FullUser>()
  private initialized?: Promise<boolean>
  private resolveUser?: (value: boolean | PromiseLike<boolean>) => void
  public queries = this.createQueries()
  public requests = this.createRequests({
    queries: this.queries,
    basePath: "/user",
    factorServer: this.factorServer,
    factorUser: this,
  })
  public hooks = this.settings.hooks || []
  public tokenSecret = this.settings.tokenSecret || "secret"
  public activePath = this.utils.vue.ref(
    this.utils.safeDirname(import.meta.url),
  )
  public clientTokenKey = "ffUser"
  constructor(settings: types.UserPluginSettings) {
    super(settings)

    if (this.utils.isActualBrowser()) {
      this.userInitialized().catch(console.error)
    }
  }

  setup() {}

  createQueries() {
    const deps = {
      factorUser: this as FactorUser,
      factorDb: this.factorDb,
      factorEmail: this.factorEmail,
    }
    return {
      UserGoogleAuth: new QueryUserGoogleAuth({
        clientId: this.settings.googleClientId,
        clientSecret: this.settings.googleClientSecret,
        ...deps,
      }),
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
    } as const
  }

  public addHook(hook: HookType<types.FactorUserHookDictionary>): void {
    this.hooks.push(hook)
  }

  deleteCurrentUser = (): void => {
    this.log.info(`deleted current user`)
    this.clientToken({ action: "destroy" })
    this.activeUser.value = undefined
  }

  cacheUser = ({ user }: { user: Partial<types.FullUser> }): void => {
    if (user && user.userId) this.utils.storeItem(user.userId, user)
  }

  setCurrentUser = (args: {
    user: types.FullUser | undefined
    token?: string
  }): void => {
    const { user, token = "" } = args

    if (!user) return this.deleteCurrentUser()

    this.log.debug(`set current user: ${user.email}`, { data: user, token })

    if (token) {
      this.clientToken({ action: "set", token })
    }
    this.activeUser.value = user

    this.cacheUser({ user })
  }

  logout = async (): Promise<void> => {
    this.deleteCurrentUser()
    this.utils.emitEvent("logout")
    this.utils.emitEvent("notify", "Successfully logged out.")
    this.utils.emitEvent("resetUi")

    await this.utils.runHooks({
      list: this.hooks,
      hook: "onLogout",
      args: [],
    })
  }

  requestCurrentUser = async (): Promise<types.FullUser | undefined> => {
    const token = this.clientToken({ action: "get" })

    let user: types.FullUser | undefined = undefined

    if (token && this.requests) {
      const { status, data, code } = await this.requests.CurrentUser.request({
        token,
      })

      // If there is a token error, then delete it and force login
      if (status == "error" && code == "TOKEN_ERROR") {
        await this.logout()
      }

      user = data

      if (user) {
        this.setCurrentUser({ user })
      }
    }

    await this.utils.runHooks({
      list: this.hooks,
      hook: "requestCurrentUser",
      args: [user],
    })

    this.log.debug("user loaded", { data: { user } })

    return user
  }

  setUserInitialized = (): void => {
    if (this.resolveUser) this.resolveUser(true)
  }

  userInitialized = async (
    callback?: (u: types.PrivateUser | undefined) => void,
  ): Promise<types.PrivateUser | undefined> => {
    if (!this.initialized) {
      this.initialized = new Promise(async (resolve) => {
        this.resolveUser = resolve
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await this.requestCurrentUser()
        resolve(true)
      })
    }

    await this.initialized

    if (callback) callback(this.activeUser.value)

    return this.activeUser.value
  }

  updateUser = async (
    cb: (
      user: types.FullUser | undefined,
    ) => types.FullUser | undefined | Promise<types.FullUser | undefined>,
  ): Promise<void> => {
    const newUser = await cb(this.activeUser.value)
    if (newUser) {
      this.setCurrentUser({ user: newUser })
    }
  }

  clientToken = (
    args: {
      action?: "set" | "get" | "destroy"
      token?: string
    } = {},
  ): string | undefined => {
    if (typeof window == "undefined") {
      this.log.warn("browser functions not available, set client token")
      return
    }

    const domain =
      this.utils.mode() == "production" ? this.utils.getTopDomain() : undefined

    const { action = "get", token } = args

    if (action === "destroy") {
      this.utils.removeCookie(this.clientTokenKey, { domain })
    } else if (action == "set" && token) {
      this.utils.setCookie(this.clientTokenKey, token, { expires: 14, domain })
    } else {
      const cookieValue = this.utils.getCookie(this.clientTokenKey)

      return cookieValue ? cookieValue : ""
    }
  }

  /**
   * Sets the auth token secret or falls back to a basic one (insecure)
   */
  getTokenSecret = (): string => {
    const secret = process.env.TOKEN_SECRET || process.env.FACTOR_TOKEN_SECRET
    if (!secret) {
      this.log.warn("JWT token secret is missing (TOKEN_SECRET)")
    }

    return secret ?? "INSECURE"
  }
  /**
   * Returns a user authentication credential including token for storage in client
   */
  createClientToken = (user: Partial<types.FullUser>): string => {
    const { role = "", userId, email } = user
    return jwt.sign({ role, userId, email }, this.tokenSecret)
  }
  /**
   * Take a JWT token and decode into the associated user _id
   */
  decodeClientToken = (token: string): types.TokenFields => {
    const r = jwt.verify(token, this.tokenSecret) as types.TokenFields

    if (!r.userId || !r.email) {
      throw this.utils._stop({
        message: "token missing userId or email",
        code: "TOKEN_ERROR",
      })
    }

    return r
  }
}
