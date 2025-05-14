import type { EndpointMeta, EndpointResponse, MediaObject } from '@fiction/core'
import type { FictionOnboardSettings } from '.'
import type { LinkedInEnrichmentProfile, ProfileData } from './util'
import { abort, Query } from '@fiction/core'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { accountFromProfile, createHandle, getMockLinkedInData, profileFromAccount } from './util'

const AiEnhancementSchema = z.object({
  headline: z.string().min(5).max(160).describe('Concise 3-5 word tagline suitable for hero headline, social media bio, and email signature'),
  about: z.string().min(10).max(400).describe('Short bio suitable for personal brand, blog about section, and professional profiles'),
  interests: z.array(z.string()).min(1).max(10).describe('Areas of interest (e.g., history, ai, ux-design, pottery, ecommerce)'),
  influences: z.array(z.string()).min(0).max(5).describe('Specific people, characters influencing voice and style (e.g, steve-jobs, johnny-depp, cicero)'),
  pillars: z.array(z.string()).min(0).max(5).describe('Niche topics for content creation (e.g., ai, mobile ux-design, ai-ecommerce)'),
  postTitles: z.array(z.string()).min(0).max(5).describe('1-3 suggested 5 to 10 word post titles on topics related but not specific to profile, strong hook, make people curious. Open loops.'),
  clout: z.number().min(0).max(100).describe('Estimated score based on positions at known companies, education quality, location (US and wealthy countries higher), influence (followers, etc): 0(spam), 10(average), to 100(extremely influential)'),
})

type AiEnhancement = z.infer<typeof AiEnhancementSchema>

export type OnboardRequest =
  | { _action: 'enrichFromLinkedIn', userId: string, orgId: string, profile: Partial<ProfileData> }
  | { _action: 'updateProfile', userId: string, orgId: string, profile: Partial<ProfileData> }
  | { _action: 'createDefaultContent', userId: string, orgId: string, profile: Partial<ProfileData> }

export class QueryManageOnboard extends Query<FictionOnboardSettings> {
  enrichCount = 0
  ManageUser = this.settings.fictionUser.queries.ManageUser
  ManageOrganization = this.settings.fictionUser.queries.ManageOrganization

  async run(params: OnboardRequest, meta: EndpointMeta): Promise<EndpointResponse<ProfileData>> {
    try {
      switch (params._action) {
        case 'enrichFromLinkedIn':
          return await this.handleEnrichFromLinkedIn(params, meta)
        case 'updateProfile':
          return await this.handleUpdateProfile(params, meta)
        case 'createDefaultContent':
          return await this.handleCreateDefaultContent(params, meta)
        default:
          throw abort('Invalid action')
      }
    }
    catch (error) {
      this.log.error(`Error in ${params._action}`, { error })
      return { status: 'error', message: (error as Error).message }
    }
  }

  private async handleCreateDefaultContent(
    params: Extract<OnboardRequest, { _action: 'createDefaultContent' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<ProfileData>> {
    const { userId, orgId, profile } = params

    if (!userId || !orgId) {
      throw abort('userId and orgId are required')
    }

    const { fictionPosts, fictionSites } = this.settings

    // Get selected post titles from profile
    const { postTitles = [] } = profile

    if (postTitles.length === 0) {
      return { status: 'success', message: 'No post titles to create' }
    }

    try {
      const _promises: Promise<any>[] = postTitles.map((title) => {
        return fictionPosts.queries.ManagePost.serve({
          _action: 'create',
          fields: {
            title,
            status: 'draft',
            content: `<p>This is a draft post about "${title}".</p>`,
            media: {},
          },
          orgId,
          userId,
        }, { server: true, ...meta })
      })

      _promises.push(
        fictionSites.queries.ManageSite.serve({
          _action: 'create',
          orgId,
          userId,
          fields: {
            title: 'My Fiction Site',
            isPrimary: true,
          },
          caller: 'createDefaultContent',
        }, { server: true, ...meta }),
      )

      const results = await Promise.all(_promises)

      return { status: 'success', data: profile as ProfileData, results }
    }
    catch (error) {
      this.log.error('Failed to create default content', { error })
      throw error
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
    await this.updateProfileData({ profile, userId, orgId }, meta)

    this.log.info('Profile enriched', { data: returnProfile })

    return { status: 'success', message: 'Profile enriched', data: returnProfile }
  }

  private async handleUpdateProfile(
    params: Extract<OnboardRequest, { _action: 'updateProfile' }>,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<ProfileData>> {
    const { userId, orgId, profile } = params

    const { org, user } = await this.updateProfileData({ profile, userId, orgId }, meta)

    return {
      status: 'success',
      message: 'Profile updated',
      data: profileFromAccount({ user, org }),
      user,
    }
  }

  private async fetchLinkedInProfile(linkedinHandle?: string): Promise<LinkedInEnrichmentProfile> {
    if (!linkedinHandle) {
      throw new Error('linkedin username is missing')
    }

    const url = linkedinHandle.includes('linkedin.com') ? linkedinHandle : `https://www.linkedin.com/in/${linkedinHandle}`

    this.enrichCount++
    this.log.info('Fetching LinkedIn profile', { url, enrichCount: this.enrichCount })
    if (!this.settings.proxycurlApiKey) {
      this.log.warn('ProxyCurl API key is missing, using mock data')
      return getMockLinkedInData(url)
    }

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
      industry: linkedinData.industry,
      city: linkedinData?.city,
      state: linkedinData?.state,
      country: linkedinData?.country,
      avatar,
      linkedinFollowers: linkedinData.follower_count,
      linkedinHandle: linkedinData.public_identifier,
      ...aiEnhancement,
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
            - If discernable: 1-3 content pillars: niche topics for content creation (ai, mobile ux-design, ai-ecommerce).
            - 0-100 clout score based on positions at known companies, education quality, location (US and wealthy countries higher), influence (followers, etc): 0(spam), 10(average global), 30(average US), 50(influential) to 100(extremely influential).
            - 2-3 suggested post titles based on profile, influences, interests and pillars. Hook target audience in. Create open loops. SEO.
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
        pillars: [],
        postTitles: [],
        clout: 0,
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
      const { width, height, url } = m || {}

      return { format: 'image', url, width, height }
    }
    catch (error) {
      this.log.error('Avatar processing failed', { error })
      return undefined
    }
  }

  private async updateProfileData(args: { userId: string, orgId: string, profile: Partial<ProfileData> }, meta: EndpointMeta) {
    const { userId, orgId, profile } = args
    const { orgFields = {}, userFields = {} } = accountFromProfile(profile)

    const [orgResult, userResult] = await Promise.all([
      this.ManageOrganization.serve({ _action: 'update', where: { orgId }, fields: orgFields }, { ...meta, server: true }),
      this.ManageUser.serve({ _action: 'update', where: { userId }, fields: userFields }, { ...meta, server: true }),
    ])

    return {
      org: orgResult?.data,
      user: userResult?.data,
    }
  }
}
