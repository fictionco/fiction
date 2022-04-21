import { UserConfig } from "../config"
import { FactorPlugin } from "../config/plugin"
import { EndpointMap, Endpoint, EndpointMeta } from "../engine/endpoint"
import { FactorDb } from "../plugin-db"
import { clientToken } from "../utils/jwt"
import { FactorEmail } from "../plugin-email"
import { HookType } from "../utils"
import { QueryUserGoogleAuth } from "./userGoogle"
import {
  ManageUserParams,
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
} from "./userAuth"
import { FullUser, PrivateUser } from "./types"
import { currentUser, logout, setCurrentUser } from "./userClient"
import { routeAuthRedirects } from "./routeAuth"
export * from "./userClient"
export * from "./types"
export type { ManageUserParams }

type UserPluginSettings = {
  factorDb: FactorDb
  factorEmail: FactorEmail
  googleClientId?: string
  googleClientSecret?: string
  serverUrl: string
  hooks?: HookType<HookDictionary>[]
}

export type HookDictionary = {
  onUserVerified: { args: [FullUser] }
  processUser: {
    args: [FullUser, { params: ManageUserParams; meta: EndpointMeta }]
  }
}

export class FactorUser extends FactorPlugin<UserPluginSettings> {
  private factorDb: FactorDb
  private factorEmail: FactorEmail
  public queries: ReturnType<typeof this.createQueries>

  private initialized?: Promise<boolean>
  private resolveUser?: (value: boolean | PromiseLike<boolean>) => void
  public requests: EndpointMap<typeof this.queries>
  public hooks: HookType<HookDictionary>[]

  constructor(settings: UserPluginSettings) {
    super(settings)

    this.factorDb = settings.factorDb
    this.factorEmail = settings.factorEmail
    this.queries = this.createQueries()
    this.requests = this.createRequests({
      queries: this.queries,
      serverUrl: settings.serverUrl,
      basePath: "/user",
    })
    this.hooks = this.settings.hooks || []
  }

  async setup(): Promise<UserConfig> {
    if (this.utils.isBrowser()) {
      this.userInitialized().catch(console.error)
    }
    return {
      name: this.constructor.name,
      endpoints: this.endpoints,
      serverOnlyImports: [{ id: "html-to-text" }],
    }
  }

  get endpoints(): Endpoint[] {
    return Object.values(this.requests)
  }

  createQueries() {
    const deps = {
      factorUser: this,
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

  public addHook(hook: HookType<HookDictionary>): void {
    this.hooks.push(hook)
  }

  requestCurrentUser = async (): Promise<FullUser | undefined> => {
    const token = clientToken({ action: "get" })

    let user: FullUser | undefined = undefined

    if (token && this.requests) {
      const { status, data, code } = await this.requests.CurrentUser.request({
        token,
      })

      // If there is a token error, then delete it and force login
      if (status == "error" && code == "TOKEN_ERROR") {
        await logout()
      }

      user = data

      if (user) {
        setCurrentUser({ user })
      }
    }

    // redirect before resolve
    await routeAuthRedirects(user)

    this.log.debug("user loaded", { data: { user } })

    return user
  }

  setUserInitialized = (): void => {
    if (this.resolveUser) this.resolveUser(true)
  }

  userInitialized = async (
    callback?: (u: PrivateUser | undefined) => void,
  ): Promise<PrivateUser | undefined> => {
    if (!this.initialized) {
      this.initialized = new Promise(async (resolve) => {
        this.resolveUser = resolve
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await this.requestCurrentUser()
        resolve(true)
      })
    }

    await this.initialized

    if (callback) callback(currentUser())

    return currentUser()
  }
}
