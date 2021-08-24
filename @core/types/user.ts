import { UserGeolocation } from "./geo"
import { FactorPost, PopulatedPosts, PostActions } from "./post"
import { UserRoles } from "./roles"

export type CurrentUserState = PrivateUser | undefined

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
  createdAt: string
  updatedAt: string
  avatar: string
  status: string
  lastSeen?: string | number | Date
  username?: string
  fullName?: string
  email: string
  emailVerified?: boolean
  role?: UserRoles
  profile: Record<string, any>
  settings: Record<string, any>
}
/**
 * Information regarding a user profile (e.g. birthday, cover, tags)
 */
export interface ProfileUser extends PublicUser {
  cover?: PopulatedPosts
  birthday?: Date | string
  gender?: Gender
  about?: string
  tag: string[]
  category: string[]
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
  birthday: string
  phoneNumber?: string
  hashedPassword?: string
  token?: string
  setting?: Record<string, any>
  meta?: Record<string, any>
  verificationCode?: string
  codeExpiresAt?: string | number | Date
  geo?: UserGeolocation
  invitedBy?: string
}
/**
 * All user information
 */
export type FullUser = PrivateUser & ProfileUser

export type AuthCallback = (args: {
  user?: FullUser
  searchBot: boolean
}) => string | undefined | Promise<string | undefined>
