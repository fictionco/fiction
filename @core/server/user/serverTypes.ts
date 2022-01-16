import {
  EndpointResponse,
  FullUser,
  PublicUser,
  PrivateUser,
} from "@factor/types"

export const bearerRequired: (keyof UserEndpoint)[] = [
  "currentUser",
  "updateCurrentUser",
  "sendOneTimeCode",
]

export type UserEndpoint = {
  sendOneTimeCode: {
    request: { email: string; userId?: string }
    response: EndpointResponse<boolean>
  }
  updateCurrentUser: {
    request: Partial<FullUser> & { password?: string }
    response: EndpointResponse<FullUser> & { token?: string }
  }
  startNewUser: {
    request: { email: string; fullName?: string }
    response: EndpointResponse<Partial<FullUser>> & {
      token: string
      user: PublicUser
    }
  }
  newVerificationCode: {
    request: { email: string; newAccount?: boolean }
    response: EndpointResponse<{ exists: boolean }>
  }
  verifyAccountEmail: {
    request: { email: string; verificationCode: string }
    response: EndpointResponse<FullUser>
  }
  setPassword: {
    request: { password: string; email: string; verificationCode: string }
    response: EndpointResponse<FullUser> & { token: string }
  }
  resetPassword: {
    request: { email: string }
    response: EndpointResponse<FullUser>
  }
  login: {
    request: { email: string; password: string }
    response: EndpointResponse<FullUser> & {
      token: string
      user: FullUser
      next?: "verify"
    }
  }
  currentUser: {
    request: { token: string }
    response: EndpointResponse<FullUser>
  }
  getPublicUser: {
    request: { email: string } | { userId: string }
    response: EndpointResponse<PublicUser | false>
  }
}

export type UserFetch<U extends keyof UserEndpoint> = {
  request: UserEndpoint[U]["request"]
  response: UserEndpoint[U]["response"]
  endpoint: `/user/${U}`
  method: U
}

export type UserEndpointMethod<U extends keyof UserEndpoint> = (
  args: UserEndpoint[U]["request"],
) => Promise<UserEndpoint[U]["response"]>

export type UserEndpointMethodWithBearer<U extends keyof UserEndpoint> = (
  args: UserEndpoint[U]["request"] & {
    bearer: PrivateUser
    userId: string
  },
) => Promise<UserEndpoint[U]["response"]>

export type EndpointMethods = {
  [K in keyof UserEndpoint]:
    | UserEndpointMethod<K>
    | UserEndpointMethodWithBearer<K>
}
