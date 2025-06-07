import type { Organization, User } from '@fiction/core/plugin-user'
import { MediaSchema, OnboardSchema } from '@fiction/core'
import { ArchetypeKeySchema, getArchetypesStyles, getImageStyles, ImageStyleKeySchema } from '@fiction/core/schemas/motifs'
import { BrandingSchema, GeoLocationSchema, ProfileSchema, SocialAccountsSchema } from '@fiction/core/schemas/org'
import { z } from 'zod/v4'

export const ProfileDataSchema = z.object({
  name: z.string().optional(),
  handle: z.string().optional(),
  avatar: MediaSchema.optional(),
  accounts: SocialAccountsSchema.optional(),
  location: GeoLocationSchema.optional(),
  profile: ProfileSchema.optional(),
  branding: BrandingSchema.optional(),
  promptImageKey: ImageStyleKeySchema.optional(),
  promptContentKey: ArchetypeKeySchema.optional(),
  onboard: OnboardSchema.optional(),
})

export type ProfileData = z.infer<typeof ProfileDataSchema>

export type LinkedInEnrichmentProfile = {
  public_identifier?: string
  profile_pic_url?: string
  full_name?: string
  headline?: string
  summary?: string
  industry?: string
  country?: string
  city?: string
  state?: string
  follower_count?: number
  connections?: number
  experiences?: {
    company?: string
    title?: string
    description?: string
    starts_at?: { year?: number, month?: number, day?: number }
    ends_at?: { year?: number, month?: number, day?: number } | null
  }[]
  education?: {
    school?: string
    degree_name?: string
    field_of_study?: string
  }[]
  skills?: { name: string }[]
  interests?: string[]
}

/**
 * Creates a profile object from user and organization data
 */
export function profileFromAccount(args: { user?: User, org?: Organization }): ProfileData {
  const { user, org } = args

  return {
    name: org?.name || user?.fullName,
    handle: org?.handle || user?.handle,
    profile: org?.profile,
    accounts: org?.accounts,
    branding: org?.branding,
    onboard: org?.onboard,
  }
}

/**
 * Creates user and org update objects from profile data
 */
export function accountFromProfile(profile: ProfileData): {
  userFields: Partial<User>
  orgFields: Partial<Organization>
} {
  const userFields: Partial<User> = {
    fullName: profile.name,
    avatar: profile.avatar,
  }

  const orgFields: Partial<Organization> = {
    name: profile.name,
    handle: profile.handle,
    profile: profile.profile,
    avatar: profile.avatar,
    onboard: profile.onboard,
    prompt: {
      image: getImageStyles().find(a => a.value === profile.promptImageKey)?.info || '',
      content: getArchetypesStyles().find(a => a.value === profile.promptContentKey)?.info || '',
    },
    branding: profile.branding,
    location: profile.location,
    accounts: profile.accounts,
  }

  return { userFields, orgFields }
}

export function getMockLinkedInData(url: string): LinkedInEnrichmentProfile {
  const handle = url.split('/in/')[1]?.replace(/\/$/, '') || 'johndoe'
  const fullName = handle.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')

  return {
    public_identifier: handle,
    full_name: fullName,
    headline: 'Product Designer & Technology Leader',
    summary: 'Experienced professional passionate about creating innovative solutions.',
    profile_pic_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    skills: [{ name: 'UX Design' }, { name: 'Product Strategy' }, { name: 'Leadership' }],
  }
}

export function createHandle(name?: string): string {
  if (!name)
    return `user-${Date.now().toString(36)}`
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)
}
