import { UserConfig } from "../config"
import { FactorPlugin } from "../config/plugin"
import { EndpointMap, Endpoint, EndpointMeta } from "../engine/endpoint"
import { FactorDb } from "../plugin-db"
import { clientToken } from "../utils/jwt"
import { FactorEmail } from "../plugin-email"
import { DataProcessor } from "../processor"
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

type UserProcessor = DataProcessor<
  FullUser,
  { meta?: EndpointMeta; params?: ManageUserParams }
>

type UserPluginSettings = {
  factorDb: FactorDb
  factorEmail: FactorEmail
  googleClientId?: string
  googleClientSecret?: string
  serverUrl: string
  processors?: UserProcessor[]
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
  public requests: EndpointMap<typeof this.queries>

  private initialized?: Promise<boolean>
  private resolveUser?: (value: boolean | PromiseLike<boolean>) => void
  serverUrl: string
  public processors: UserProcessor[]
  public hooks: HookType<HookDictionary>[]
  constructor(settings: UserPluginSettings) {
    super(settings)
    this.serverUrl = settings.serverUrl
    this.factorDb = settings.factorDb
    this.factorEmail = settings.factorEmail
    this.queries = this.createQueries()
    this.requests = this.createRequests(settings.serverUrl)
    this.processors = this.settings.processors || []
    this.hooks = this.settings.hooks || []
  }

  async setup(): Promise<UserConfig> {
    if (this.utils.isBrowser()) {
      this.userInitialized().catch(console.error)
    }
    return {
      name: this.constructor.name,
      endpoints: Object.values(this.requests),
      serverOnlyImports: [{ id: "html-to-text" }],
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private createQueries() {
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

  private createRequests(serverUrl: string): EndpointMap<typeof this.queries> {
    const requests = Object.fromEntries(
      Object.entries(this.queries).map(([key, query]) => {
        return [
          key,
          new Endpoint({
            key,
            queryHandler: query,
            serverUrl,
            basePath: "/user",
          }),
        ]
      }),
    ) as EndpointMap<typeof this.queries>

    return requests
  }

  public addProcessor(processor: UserProcessor): void {
    this.processors.push(processor)
  }

  public addHook(hook: HookType<HookDictionary>): void {
    this.hooks.push(hook)
  }

  requestCurrentUser = async (): Promise<FullUser | undefined> => {
    const token = clientToken({ action: "get" })

    let user: FullUser | undefined = undefined

    if (token) {
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
