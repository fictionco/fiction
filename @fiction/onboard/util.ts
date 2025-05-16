import type { ColorThemeBright } from '@fiction/core'
import type { Organization, User } from '@fiction/core/plugin-user'
import type { ArchetypeKey, ImageStyleKey } from '@fiction/core/schemas/motifs'
import { toSlug } from '@fiction/core'
import { getArchetypesStyles, getImageStyles } from '@fiction/core/schemas/motifs'

export type ProfileData = {
  name?: string
  handle?: string
  avatar?: { url?: string }

  linkedinHandle?: string
  linkedinFollowers?: number

  city?: string
  state?: string
  country?: string

  goal?: string
  headline?: string
  about?: string
  interests?: string[]
  influences?: string[]
  industry?: string
  pillars?: string[]
  postTitles?: string[]

  clout?: number

  promptImageKey?: ImageStyleKey
  promptContentKey?: ArchetypeKey
  primaryColor?: ColorThemeBright | ''

  needsOnboarding?: boolean

}

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
    name: org?.orgName || user?.fullName,
    handle: org?.handle || user?.handle,
    headline: org?.headline,
    about: org?.about || user?.about,
    avatar: org?.avatar || user?.avatar,
    interests: org?.interests || [],
    influences: org?.influences || [],
    linkedinHandle: org?.accounts?.linkedin || user?.accounts?.linkedin,
    needsOnboarding: org?.needsOnboarding || user?.needsOnboarding,
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
    handle: profile.handle,
    about: profile.about,
    avatar: profile.avatar,
    needsOnboarding: profile.needsOnboarding,
  }

  const orgFields: Partial<Organization> = {
    orgName: profile.name,
    handle: profile.handle,
    headline: profile.headline,
    about: profile.about,
    interests: profile.interests?.map(i => toSlug(i)),
    influences: profile.influences?.map(i => toSlug(i)),
    avatar: profile.avatar,
    needsOnboarding: profile.needsOnboarding,
    goal: profile.goal,
    promptContent: getArchetypesStyles().find(a => a.value === profile.promptContentKey)?.info || '',
    promptImage: getImageStyles().find(a => a.value === profile.promptImageKey)?.info || '',
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
