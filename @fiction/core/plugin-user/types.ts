import type stripe from 'stripe'
import type { MediaObject } from '../schemas/index.js'
import type { ColType } from '../tbl.js'
import type { UserCapability } from '../utils/priv.js'
import type { membersColumns, orgColumns, userColumns } from './schema.js'
import { z } from 'zod/v4'
import { MediaSchema, ProgressStatusSchema } from '../schemas/index.js'

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

export const EmailSenderSchema = z.object({
  senderName: z.string().optional(),
  senderEmail: z.string().optional(),
  avatar: MediaSchema.optional(),
  companyName: z.string().optional(),
  websiteUrl: z.string().optional(),
  streetAddress: z.string().optional(),
})

export type EmailSender = z.infer<typeof EmailSenderSchema>

export type Organization = Partial<ColType<typeof orgColumns>> & {
  loadOrgId?: boolean
  members?: OrganizationMember[]
  memberCount?: number
  createdAt?: string
  updatedAt?: string
  relation?: OrganizationMember
}

export const OnboardingItemSchema = z.object({
  key: z.string().meta({ description: 'Unique task identifier' }),
  status: ProgressStatusSchema.meta({ description: 'Task completion state' }),
  completedAt: z.string().optional().meta({ description: 'When completed' }),
  data: z.record(z.string(), z.unknown()).optional().meta({ description: 'Task-specific metadata' }),
})

export const OnboardSchema = z.object({
  phase: z.enum(['initial', 'tasks', 'dismissed']).optional().meta({ description: 'Current onboarding phase' }),
  items: z.record(z.string(), OnboardingItemSchema).optional().meta({ description: 'Onboarding tasks by key' }),
  dismissedAt: z.string().optional().meta({ description: 'When user dismissed onboarding' }),
})

export type OnboardSettings = z.infer<typeof OnboardSchema>

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

export type OrganizationMember = Partial<
  ColType<typeof membersColumns> & {
    fullName: string
    email: string
    userId: string
    lastSeenAt: string
    access: MemberAccess
    accessLevel: number
    avatar?: MediaObject
  } & UserCapabilities
>

export interface OrganizationCustomerData {
  customerId?: string
  priceId?: string
  productId?: string
  contactId?: string
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
  access: MemberAccess
  status: MemberStatus
  tags?: string[]
  inviterId?: string
}

export const orgFields = ['orgId', 'name']

export type TokenFields = Partial<User> & { userId: string, iat: number }
