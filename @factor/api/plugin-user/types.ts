import type { EndpointMeta, HookType } from "@factor/api/utils"
import type { FactorDb } from "@factor/api/plugin-db"
import type { FactorEmail } from "@factor/api/plugin-email"
import { UserGeolocation } from "@factor/api/types/geo"
import { FactorPost, PopulatedPosts, PostActions } from "@factor/api/types/post"
import { UserRoles } from "@factor/api/types/roles"
import type { FactorServer } from "../plugin-server"
import type { ManageUserParams } from "./endpoints"

export type CurrentUserState = PrivateUser | undefined

export type { ManageUserParams }

export type TokenFields = Partial<PrivateUser> & { userId: string; iat: number }

export type UserPluginSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorEmail: FactorEmail
  googleClientId?: string
  googleClientSecret?: string
  hooks?: HookType<FactorUserHookDictionary>[]
  tokenSecret?: string
  mode?: "production" | "development"
}

export type FactorUserHookDictionary = {
  onLogout: { args: [] }
  onUserVerified: { args: [FullUser] }
  requestCurrentUser: { args: [FullUser | undefined] }
  processUser: {
    args: [FullUser, { params: ManageUserParams; meta: EndpointMeta }]
  }
}

enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface DetermineUpdatePermissions {
  bearer: CurrentUserState
  post?: FactorPost
  action: PostActions
  postType: string
  manyPosts?: boolean
}

export type AuthenticationParameters = {
  newAccount?: boolean
  email: string
  password: string
  displayName?: string
  ipAddress?: string
}
/**
 * Publicly accessible user information
 */
export interface PublicUser {
  userId: string
  createdAt?: string
  updatedAt?: string
  avatar?: string
  status?: string
  lastSeen?: string | number | Date
  username?: string
  fullName?: string
  firstName?: string
  lastName?: string
  email: string
  emailVerified?: boolean
  role?: UserRoles
  profile?: Record<string, any>
  settings?: Record<string, any>
}
/**
 * Information regarding a user profile (e.g. birthday, cover, tags)
 */
export interface ProfileUser extends PublicUser {
  cover?: PopulatedPosts
  birthday?: Date | string
  gender?: Gender
  about?: string
  tag?: string[]
  category?: string[]
  site?: string
  github?: string
  githubFollowers?: number
  twitter?: string
  twitterFollowers?: number
  linkedin?: string
  facebook?: string
  workName?: string
  workSeniority?: string
  workRole?: string
  workRoleSub?: string
  workTitle?: string
  workDomain?: string
  bio?: string
  location?: string
}
/**
 * Information including information that should only be available to the
 * current user.
 */
export interface PrivateUser extends PublicUser {
  birthday?: string
  phoneNumber?: string
  hashedPassword?: string
  googleId?: string
  token?: string
  setting?: Record<string, any>
  meta?: Record<string, any>
  verificationCode?: string
  codeExpiresAt?: string | number | Date
  geo?: UserGeolocation
  invitedBy?: string
  lastProject?: string
}
/**
 * All user information
 */
export type FullUser = PrivateUser & ProfileUser

export type AuthCallback = (args: {
  user?: FullUser
  searchBot: boolean
}) => string | undefined | Promise<string | undefined>
