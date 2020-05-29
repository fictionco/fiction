import { PopulatedPosts, FactorPost } from "@factor/post/types"
import { EndpointParameters } from "@factor/endpoint"
export type CurrentUserState = FactorUser | undefined

enum Gender {
  Male = "male",
  Female = "female",
}

export enum UserRoles {
  Admin = "admin",
  Moderator = "moderator",
  Editor = "editor",
  Creator = "creator",
  Member = "member",
  Anonymous = "anonymous",
}

export const userRolesMap: { [index in UserRoles]: number } = {
  admin: 500,
  moderator: 300,
  editor: 200,
  creator: 100,
  member: 20,
  anonymous: 0,
}

export type AuthenticationParameters = {
  newAccount?: boolean
  email: string
  password: string
  displayName?: string
  ipAddress?: string
} & EndpointParameters

export interface FactorUserCredential extends FactorUser {
  password: undefined
  token: string
}

export interface FactorUserAuthentication extends FactorUser {
  password?: string
}

export interface UserGeolocation {
  name?: string
  ip?: string
  city?: string
  region?: string
  regionName?: string
  regionCode?: string
  dmaCode?: string
  countryCode?: string
  countryName?: string
  continentCode?: string
  continentName?: string
  inEU?: boolean
  latitude?: string | number
  longitude?: string | number
  timeZone?: string
  currencyCode?: string
  zip?: string
  metroCode?: string | number
}

export interface FactorUser extends FactorPost {
  _id: string
  __t?: "user"
  postType?: "user"
  signedInAt?: string | number | Date
  username?: string
  displayName?: string
  email: string
  emailVerified?: boolean
  geo?: UserGeolocation
  accessLevel?: number
  role?: string
  phoneNumber?: string
  covers?: PopulatedPosts
  birthday?: Date | string
  gender?: Gender
  about?: string
  password?: string
  comparePassword?: (password: string) => boolean
}
