import type { EndpointMeta, EndpointResponse, MediaObject, TableMediaConfig } from '@fiction/core'
import type { FictionAdmin, FictionAdminSettings } from '..'
import { abort, Query } from '@fiction/core'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

type OnboardSettings = FictionAdminSettings & {
  fictionAdmin: FictionAdmin
}

// Types
type LinkedInExperience = {
  company?: string
  title?: string
  description?: string
  starts_at?: { year?: number, month?: number, day?: number }
  ends_at?: { year?: number, month?: number, day?: number } | null
}

type LinkedInEducation = {
  school?: string
  degree_name?: string
  field_of_study?: string
}

type LinkedInProfile = {
  public_identifier?: string
  profile_pic_url?: string
  full_name?: string
  headline?: string
  summary?: string
  industry?: string
  location_name?: string
  experiences?: LinkedInExperience[]
  education?: LinkedInEducation[]
  skills?: { name: string }[]
  interests?: string[]
}

type AiEnhancement = {
  headline: string
  about: string
  interests: string[]
  influences: string[]
}

export type ProfileData = {
  name?: string
  handle?: string
  avatar?: { url?: string }
  headline?: string
  about?: string
  interests?: string[]
  influences?: string[]
  linkedinUrl?: string
  needsOnboarding?: boolean
}

export type OnboardRequest =
  | { _action: 'enrichFromLinkedIn', userId: string, orgId: string, profile: Partial<ProfileData> }
  | { _action: 'updateProfile', userId: string, orgId: string, profile: Partial<ProfileData> }

// Schemas
const AiEnhancementSchema = z.object({
  headline: z.string().min(5).max(160).describe('Concise 3-5 word tagline capturing unique value'),
  about: z.string().min(10).max(300).describe('Short bio showcasing story, expertise, and personality'),
  interests: z.array(z.string()).min(1).max(10).describe('Key professional topics and passions'),
  influences: z.array(z.string()).min(0).max(5).describe('Role models, styles, motifs, shaping professional voice and style'),
})

const LinkedInUrlSchema = z.string().url().refine(url => url.includes('linkedin.com/in/'), {
  message: 'Invalid LinkedIn profile URL',
})

// Utility Functions
function createHandle(name?: string): string {
  if (!name)
    return `user-${Date.now().toString(36)}`
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)
}

function parseLinkedInHandle(url: string): string {
  const handle = url.split('/in/')[1]?.replace(/\/$/, '') || 'johndoe'
  return handle
}

// Main Query Class
export class QueryManageOnboard extends Query<OnboardSettings> {
  async run(params: OnboardRequest, meta: EndpointMeta): Promise<EndpointResponse<ProfileData>> {
    try {
      switch (params._action) {
        case 'enrichFromLinkedIn':
          return await this.handleEnrichFromLinkedIn(params, meta)
        case 'updateProfile':
          return await this.handleUpdateProfile(params, meta)
        default:
          throw abort('Invalid action')
      }
    }
    catch (error) {
      this.log.error(`Error in ${params._action}`, { error })
      return { status: 'error', message: (error as Error).message }
    }
  }

  private async handleEnrichFromLinkedIn(
    params: Extract<OnboardRequest, { _action: 'enrichFromLinkedIn' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<ProfileData>> {
    const { userId, orgId } = params

    const linkedinUrl = params.profile.linkedinUrl

    if (!linkedinUrl)
      return { status: 'error', message: 'LinkedIn URL is required' }

    LinkedInUrlSchema.parse(linkedinUrl)
    const linkedinData = await this.fetchLinkedInProfile(linkedinUrl)
    if (!linkedinData)
      return { status: 'error', message: 'Failed to fetch LinkedIn profile' }

    const profile = await this.buildProfile(linkedinData, userId, orgId)
    await this.updateProfileData(profile, userId, orgId, meta)

    return { status: 'success', message: 'Profile enriched', data: profile }
  }

  private async handleUpdateProfile(
    params: Extract<OnboardRequest, { _action: 'updateProfile' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<ProfileData>> {
    const { userId, orgId, profile } = params

    if (profile.avatar) {
      profile.avatar = await this.processAvatar(profile.avatar, orgId, userId)
      delete profile.avatar
    }

    await this.updateProfileData(profile, userId, orgId, meta)
    const updatedOrg = await this.settings.fictionUser.queries.ManageOrganization.serve(
      { _action: 'read', where: { orgId } },
      { ...meta, server: true },
    ).then(res => res.data)

    if (!updatedOrg)
      return { status: 'error', message: 'Organization not found' }

    return {
      status: 'success',
      message: 'Profile updated',
      data: {
        name: updatedOrg.orgName || '',
        handle: updatedOrg.handle,
        headline: updatedOrg.headline,
        about: updatedOrg.about,
        interests: updatedOrg.interests?.split(', ') || [],
        influences: updatedOrg.influences?.split(', ') || [],
        avatar: updatedOrg.avatar,
      },
    }
  }

  private async fetchLinkedInProfile(url: string): Promise<LinkedInProfile> {
    if (!this.settings.proxycurlApiKey)
      return this.getMockLinkedInData(url)

    try {
      const response = await fetch(
        `https://nubela.co/proxycurl/api/v2/linkedin?linkedin_profile_url=${encodeURIComponent(url)}&extra=include&skills=include`,
        { headers: { Authorization: `Bearer ${this.settings.proxycurlApiKey}` } },
      )

      if (!response.ok)
        throw new Error(`API error: ${response.status}`)
      return await response.json() as LinkedInProfile
    }
    catch (error) {
      this.log.error('LinkedIn API error', { error })
      return this.getMockLinkedInData(url)
    }
  }

  private async buildProfile(linkedinData: LinkedInProfile, userId: string, orgId: string): Promise<ProfileData> {
    const name = linkedinData.full_name || ''
    const handle = linkedinData.public_identifier || createHandle(name)
    const avatarUrl = linkedinData.profile_pic_url || ''

    const aiEnhancement = await this.enhanceProfileWithAi(linkedinData)
    const avatar = avatarUrl ? await this.processAvatar({ url: avatarUrl }, orgId, userId) : undefined

    return {
      name,
      handle,
      headline: aiEnhancement.headline,
      about: aiEnhancement.about,
      interests: aiEnhancement.interests,
      influences: aiEnhancement.influences,
      avatar,
    }
  }

  private async enhanceProfileWithAi(linkedinData: LinkedInProfile): Promise<AiEnhancement> {
    const schemaJson = zodToJsonSchema(AiEnhancementSchema)

    try {
      const aiResponse = await this.settings.fictionAi.queries.AiCompletion.serve({
        _action: 'completion',
        runPrompt: `Enhance this LinkedIn profile: ${JSON.stringify(linkedinData)}`,
        orgId: 'system',
        userId: 'system',
        format: 'websiteCopy',
        outputFormat: schemaJson,
        objectives: {
          goal: 'Craft authentic professional profile content',
          tone: 'Clear, engaging, and genuine',
          instructions: `
            - Create a 3-5 word headline that uniquely captures their professional value, avoiding generic terms like "expert" or "leader".
            - Write a short 10 to 30 word bio in HTML that highlights specific achievements and personality, steering clear of buzzwords like "passionate" or "innovative".
            - Identify 1-10 specific professional interests based on skills and experience, ensuring relevance to their field.
            - Suggest 0-5 role models (public figures or industry leaders) whose style or approach aligns with the user's profile, to shape their brand voice.
          `,
        },
      }, { server: true })

      if (aiResponse.status !== 'success' || !aiResponse.data?.completion) {
        throw new Error('AI enhancement failed')
      }

      return AiEnhancementSchema.parse(aiResponse.data.completion)
    }
    catch (error) {
      this.log.error('AI enhancement failed', { error })
      return {
        headline: linkedinData.headline || 'Professional Expertise',
        about: linkedinData.summary || 'Experienced professional ready to connect.',
        interests: linkedinData.skills?.slice(0, 5).map(s => s.name) || ['Innovation', 'Technology'],
        influences: [],
      }
    }
  }

  private async processAvatar(avatar: MediaObject, orgId: string, userId: string): Promise<TableMediaConfig | undefined> {
    if (!avatar?.url)
      return undefined

    try {
      const response = await this.settings.fictionMedia.queries.ManageMedia.serve({
        _action: 'createFromUrl',
        orgId,
        userId,
        fields: { sourceImageUrl: avatar.url },
      }, { server: true })

      return response.data?.[0]
    }
    catch (error) {
      this.log.error('Avatar processing failed', { error })
      return undefined
    }
  }

  private async updateProfileData(profile: Partial<ProfileData>, userId: string, orgId: string, meta: EndpointMeta): Promise<void> {
    const interestsString = profile.interests?.join(', ')
    const influencesString = profile.influences?.join(', ')

    const orgFields: Record<string, any> = {
      orgName: profile.name,
      handle: profile.handle,
      headline: profile.headline,
      about: profile.about,
      interests: interestsString,
      influences: influencesString,
      avatar: profile.avatar,
    }

    const userFields: Record<string, any> = {
      fullName: profile.name,
      handle: profile.handle,
      about: profile.about,
      avatar: profile.avatar,
    }

    await Promise.all([
      Object.keys(orgFields).length && this.settings.fictionUser.queries.ManageOrganization.serve(
        { _action: 'update', where: { orgId }, fields: orgFields },
        { ...meta, server: true },
      ),
      Object.keys(userFields).length && this.settings.fictionUser.queries.ManageUser.serve(
        { _action: 'update', where: { userId }, fields: userFields },
        { ...meta, server: true },
      ),
    ])
  }

  private getMockLinkedInData(url: string): LinkedInProfile {
    const handle = parseLinkedInHandle(url)
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
}
