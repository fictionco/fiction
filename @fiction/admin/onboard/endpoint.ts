import type { EndpointMeta, EndpointResponse, MediaObject } from '@fiction/core'
import type { FictionAdmin, FictionAdminSettings } from '..'
import type { LinkedInEnrichmentProfile, ProfileData } from './util'
import { abort, Query } from '@fiction/core'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { accountFromProfile, createHandle, getMockLinkedInData } from './util'

type OnboardSettings = FictionAdminSettings & {
  fictionAdmin: FictionAdmin
}

const AiEnhancementSchema = z.object({
  headline: z.string().min(5).max(160).describe('Concise 3-5 word tagline suitable for hero headline, social media bio, and email signature'),
  about: z.string().min(10).max(400).describe('Short bio suitable for personal brand, blog about section, and professional profiles'),
  interests: z.array(z.string()).min(1).max(10).describe('Areas of interest (e.g., history, ai, ux-design, pottery, ecommerce)'),
  influences: z.array(z.string()).min(0).max(5).describe('Specific people, characters influencing voice and style (e.g, steve-jobs, johnny-depp, cicero)'),
})

type AiEnhancement = z.infer<typeof AiEnhancementSchema>

export type OnboardRequest =
  | { _action: 'enrichFromLinkedIn', userId: string, orgId: string, profile: Partial<ProfileData> }
  | { _action: 'updateProfile', userId: string, orgId: string, profile: Partial<ProfileData> }

export class QueryManageOnboard extends Query<OnboardSettings> {
  enrichCount = 0
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
    const { userId, orgId, profile } = params

    const { linkedinHandle } = params.profile

    const linkedinData = await this.fetchLinkedInProfile(linkedinHandle)
    if (!linkedinData)
      return { status: 'error', message: 'Failed to fetch LinkedIn profile' }

    const returnProfile = await this.buildProfileFromLinkedinData(linkedinData, userId, orgId)
    await this.updateProfileData(profile, userId, orgId, meta)

    return { status: 'success', message: 'Profile enriched', data: returnProfile }
  }

  private async handleUpdateProfile(
    params: Extract<OnboardRequest, { _action: 'updateProfile' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<ProfileData>> {
    const { userId, orgId, profile } = params

    await this.updateProfileData(profile, userId, orgId, meta)
    const o = await this.settings.fictionUser.queries.ManageOrganization.serve(
      { _action: 'read', where: { orgId } },
      { ...meta, server: true },
    ).then(res => res.data)

    if (!o)
      return { status: 'error', message: 'Organization not found' }

    const { orgName: name, handle, headline, about, interests, influences, avatar } = o

    return {
      status: 'success',
      message: 'Profile updated',
      data: { name, handle, headline, about, interests, influences, avatar },
    }
  }

  private async fetchLinkedInProfile(linkedinHandle?: string): Promise<LinkedInEnrichmentProfile> {
    if (!linkedinHandle) {
      throw new Error('linkedin username is missing')
    }

    const url = linkedinHandle.includes('linkedin.com') ? linkedinHandle : `https://www.linkedin.com/in/${linkedinHandle}`

    this.enrichCount++
    this.log.info('Fetching LinkedIn profile', { url, enrichCount: this.enrichCount })
    if (!this.settings.proxycurlApiKey)
      return getMockLinkedInData(url)

    try {
      const response = await fetch(
        `https://nubela.co/proxycurl/api/v2/linkedin?linkedin_profile_url=${encodeURIComponent(url)}&extra=include&skills=include`,
        { headers: { Authorization: `Bearer ${this.settings.proxycurlApiKey}` } },
      )

      if (!response.ok)
        throw new Error(`API error: ${response.status}`)
      return await response.json() as LinkedInEnrichmentProfile
    }
    catch (error) {
      this.log.error('LinkedIn API error', { error })
      return getMockLinkedInData(url)
    }
  }

  private async buildProfileFromLinkedinData(linkedinData: LinkedInEnrichmentProfile, userId: string, orgId: string): Promise<ProfileData> {
    const name = linkedinData.full_name || ''
    const handle = linkedinData.public_identifier || createHandle(name)
    const avatarUrl = linkedinData.profile_pic_url || ''

    const aiEnhancement = await this.enhanceProfileWithAi(linkedinData)
    const avatar = avatarUrl ? await this.processAvatarToMedia({ url: avatarUrl }, orgId, userId) : undefined

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

  private async enhanceProfileWithAi(linkedinData: LinkedInEnrichmentProfile): Promise<AiEnhancement> {
    const schemaJson = zodToJsonSchema(AiEnhancementSchema)

    try {
      const aiResponse = await this.settings.fictionAi.queries.QueryAi.serve({
        _action: 'completion',
        prompt: `Create account profile based on this data: ${JSON.stringify(linkedinData)}`,
        format: 'accountSetup',
        schemaJson,
        objectives: {
          goal: 'Craft authentic professional profile content. Minimize jargon, cliches, and buzzwords. Focus on simplicity, clarity and engagement.',
          tone: 'Clear, engaging, and genuine',
          instructions: `
            - Create a simple 3-5 word headline that uniquely captures their professional value, avoiding jargon and generic terms like "expert" or "leader".
            - Write a short 10 to 30 word bio in HTML that highlights specific achievements and personality, steering clear of buzzwords like "passionate" or "innovative".
            - If discernable: 1-3 standard content interests based on hobbies, experience and background.
            - If discernable: 1-3 specific influences (specific people, characters) impacting tone and style (steve-jobs, johnny-depp, art-deco, minimalism, stoicism).
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
        headline: linkedinData.headline || 'Innovative Tech Enthusiast',
        about: linkedinData.summary || 'Subscribe to stay updated on my latest projects and insights.',
        interests: linkedinData.skills?.slice(0, 5).map(s => s.name) || ['Innovation', 'Technology'],
        influences: [],
      }
    }
  }

  private async processAvatarToMedia(avatar: MediaObject, orgId: string, userId: string): Promise<MediaObject | undefined> {
    if (!avatar?.url)
      return undefined

    try {
      const response = await this.settings.fictionMedia.queries.ManageMedia.serve({
        _action: 'createFromUrl',
        orgId,
        userId,
        fields: { sourceImageUrl: avatar.url },
      }, { server: true })

      const m = response.data?.[0]

      return {
        format: 'image',
        url: m?.url,
        width: m?.width,
        height: m?.height,
      }
    }
    catch (error) {
      this.log.error('Avatar processing failed', { error })
      return undefined
    }
  }

  private async updateProfileData(profile: Partial<ProfileData>, userId: string, orgId: string, meta: EndpointMeta): Promise<void> {
    const { orgFields, userFields } = accountFromProfile(profile)

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
}
