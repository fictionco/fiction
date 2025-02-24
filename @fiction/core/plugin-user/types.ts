import type stripe from 'stripe'
import { MediaBasicSchema, type MediaObject, type ProgressStatus } from '../schemas/schemas.js'
import type { ColType } from '../tbl.js'
import type { UserCapability } from '../utils/priv.js'
import type { membersColumns, orgColumns, userColumns } from './schema.js'
import { z } from 'zod'

export const EntityStatusEnum = z.enum(['active', 'inactive', 'suspended', 'pending'])
export const UserRoleEnum = z.enum([
  'subscriber', // 0 - No access
  'profile', // 100 - Profile access only
  'observer', // 200 - View-only access to content
  'contributor', // 300 - Create and edit content
  'author', // 400 - Full content publishing control
  'editor', // 500 - Manage all content/authors
  'manager', // 600 - Manage settings, users, and billing
  'admin', // 700 - Full system configuration access
  'owner', // 900 - Ultimate control and billing
])

export type MemberAccess = z.infer<typeof UserRoleEnum>

export const GenderEnum = z.enum(['male', 'female', 'other'])

export interface OrganizationConfig {
  serverTimeoutMinutes: number
  disableWatermark: boolean
}

export const EmailSenderSchema = z.object({
  title: z.string().optional(),
  tagline: z.string().optional(),
  fromEmail: z.string().optional(),
  fromName: z.string().optional(),
  fromReplyTo: z.string().optional(),
  avatar: MediaBasicSchema.optional(),
})

export type EmailSender = z.infer<typeof EmailSenderSchema>

export const OrganizationLegalSchema = z.object({
  termsUrl: z.string().optional(),
  privacyUrl: z.string().optional(),
  copyrightText: z.string().optional(),
})

export type OrganizationLegal = z.infer<typeof OrganizationLegalSchema>

export type Organization = Partial<ColType<typeof orgColumns>> & {
  loadOrgId?: boolean
  members?: OrganizationMember[]
  memberCount?: number
  createdAt?: string
  updatedAt?: string
  relation?: OrganizationMember
}

export interface OnboardingItem {
  key: string
  status: ProgressStatus
  completedAt?: string
  responses: { question: string, answer: string }[]
  data?: Record<string, unknown>
}

export type OnboardSettings = {
  // Post-signup survey
  surveys?: Record<string, OnboardingItem>

  // Onboarding tasks
  tasks?: Record<string, OnboardingItem>

  // Welcome content (modals, videos, tours)
  welcomeContent?: Record<string, OnboardingItem>

  lastUpdated?: string

  [key: string]: any
}

export type PushSubscriptionDetail = {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
} & PushSubscription

type UserCapabilities = {
  [K in UserCapability]: boolean
}

export type User = Partial<ColType<typeof userColumns>> & {
  orgs?: Organization[]
  relation?: OrganizationMember
}

export type SocialAccounts = Partial<{
  githubUrl?: string
  xUrl?: string
  linkedinUrl?: string
  facebookUrl?: string
  crunchbaseUrl?: string
  angellistUrl?: string
  instagramUrl?: string
  youtubeUrl?: string
  pinterestUrl?: string
  snapchatUrl?: string
  tiktokUrl?: string
  calendarUrl?: string
}>

export type UserCompany = Partial<{
  name: string
  role: string
  seniority: string
  websiteUrl: string
  employeeCount: number
  industry: string
  location: string
  description: string
  keywords: string[]
  founded: string
  funding: string
  revenue: string
  accounts: SocialAccounts
  address: StreetAddress
}>

export type StreetAddress = Partial<{
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}>

export type OrganizationMember = Partial<
  ColType<typeof membersColumns> & {
    fullName: string
    email: string
    userId: string
    lastSeenAt: string
    memberAccess: MemberAccess
    accessLevel: number
    avatar?: MediaObject
  } & UserCapabilities
>

export interface OrganizationCustomerData {
  customerId?: string
  priceId?: string
  productId?: string
  subscriptionId?: string
  subscriptionStatus: stripe.Subscription.Status
  subscriptionItemId: string
}

export interface Plan {
  name: string
  status?: stripe.Subscription.Status
  trialDays?: number
}

export const MemberAccessList = {
  observer: { can: 'Read Only' },
  editor: { can: 'Manage Data' },
  admin: { can: 'Manage Data and Teams' },
  owner: { can: 'Admin and Payments' },
}

export type MemberStatus = 'pending' | 'active' | 'inactive' | 'disabled'

export interface OrganizationMembership {
  orgId: string
  userId: string
  memberAccess: MemberAccess
  memberStatus: MemberStatus
}

export const orgFields = ['orgId', 'orgName']

export type TokenFields = Partial<User> & { userId: string, iat: number }

/**
 * Publicly accessible user information
 */
// export interface PublicUser {
//   userId: string
//   email: string
//   createdAt?: string
//   updatedAt?: string
//   avatar?: string
//   status?: string
//   username?: string
//   firstName?: string
//   lastName?: string
//   emailVerified?: boolean
//   role?: UserRoles
//   profile?: Record<string, any>
//   settings?: Record<string, any>
//   lastSeenAt?: string | number | Date
// }
/**
 * Information regarding a user profile (e.g. birthday, cover, tags)
 */
// export interface UserMeta {
//   calendarUrl?: string
//   birthday?: Date | string
//   gender?: 'male' | 'female' | 'other'
//   about?: string
//   tag?: string[]
//   category?: string[]
//   site?: string
//   github?: string
//   githubFollowers?: number
//   twitter?: string
//   twitterFollowers?: number
//   linkedin?: string
//   facebook?: string
//   workName?: string
//   workSeniority?: string
//   workRole?: string
//   workRoleSub?: string
//   workTitle?: string
//   workDomain?: string
//   bio?: string
//   location?: string
// }
