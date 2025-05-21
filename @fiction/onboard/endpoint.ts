import type { EndpointMeta, EndpointResponse, MediaObject } from '@fiction/core'
import type { FictionOnboardSettings } from '.'
import type { AiEnhancement } from './generation'
import type { LinkedInEnrichmentProfile, ProfileData } from './util'
import { abort, Query } from '@fiction/core'
import { AiEnhancementSchema, getGenerationParams } from './generation'
import { accountFromProfile, createHandle, getMockLinkedInData, profileFromAccount } from './util'

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

    if (!fictionPosts)
      throw abort('fictionPosts is not available')
    if (!fictionSites)
      throw abort('fictionSites is not available')

    try {
      const _promises: Promise<any>[] = Array.from({ length: 3 }).fill({}).map(() => {
        return fictionPosts.queries.ManagePost.serve({ _action: 'generate', mode: 'full', fields: {}, orgId, userId }, { server: true, ...meta })
      })
      _promises.push(
        fictionSites.queries.ManageSite.serve({
          _action: 'create',
          orgId,
          userId,
          fields: {
            title: profile.name,
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

    if (!linkedinHandle)
      throw abort('LinkedIn handle is required')

    // Use mock data for test handles or when ProxyCurl API key is missing
    const isTest = !!((linkedinHandle?.toLowerCase().includes('test') || !this.settings.proxycurlApiKey))

    const linkedinData = await this.fetchLinkedInProfile({ linkedinHandle, isTest })
    if (!linkedinData)
      return { status: 'error', message: 'Failed to fetch LinkedIn profile' }

    const returnProfile = await this.buildProfileFromLinkedinData({ linkedinData, userId, orgId, isTest })
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

  private async fetchLinkedInProfile(args: { linkedinHandle?: string, isTest?: boolean }): Promise<LinkedInEnrichmentProfile> {
    const { linkedinHandle, isTest } = args
    if (!linkedinHandle) {
      throw new Error('linkedin username is missing')
    }

    const url = linkedinHandle.includes('linkedin.com') ? linkedinHandle : `https://www.linkedin.com/in/${linkedinHandle}`

    // Use mock data for test handles or when ProxyCurl API key is missing
    if (isTest) {
      this.log.info('Using mock data for test handle or missing API key', { handle: linkedinHandle })
      return getMockLinkedInData(url)
    }

    this.enrichCount++
    this.log.info('Fetching LinkedIn profile', { url, enrichCount: this.enrichCount })

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

  private async buildProfileFromLinkedinData(args: { linkedinData: LinkedInEnrichmentProfile, userId: string, orgId: string, isTest?: boolean }): Promise<ProfileData> {
    const { orgId, userId, linkedinData, isTest } = args
    const name = linkedinData.full_name || ''
    const handle = linkedinData.public_identifier || createHandle(name)
    const avatarUrl = linkedinData.profile_pic_url || ''

    const aiEnhancement = await this.enhanceProfileWithAi({ linkedinData, orgId, userId, isTest })
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

  private async enhanceProfileWithAi(args: { linkedinData: LinkedInEnrichmentProfile, orgId: string, userId: string, isTest?: boolean }): Promise<AiEnhancement> {
    const { orgId, userId, linkedinData, isTest } = args
    const params = getGenerationParams({ linkedinData })

    const getDefaultData = () => {
      const { headline, summary = '', skills } = linkedinData
      return {
        promise: 'Grow Your Influence',
        headline: headline || 'Leader',
        about: summary || 'An experienced professional with a passion for innovation.',
        interests: skills?.slice(0, 5).map(s => s.name) || ['Innovation', 'Technology'],
        influences: [],
        pillars: [],
        clout: 0,
        goal: 'Build a personal brand.',
      }
    }

    if (isTest) {
      this.log.info('Using mock data for AI enhancement', { handle: linkedinData.public_identifier })
      return getDefaultData()
    }

    try {
      const aiResponse = await this.settings.fictionAi.queries.QueryAi.serve({ _action: 'completion', orgId, userId, ...params }, { server: true })

      if (aiResponse.status !== 'success' || !aiResponse.data?.completion) {
        throw new Error('AI enhancement failed')
      }

      return AiEnhancementSchema.parse(aiResponse.data.completion)
    }
    catch (error) {
      this.log.error('AI enhancement failed', { error })
      return getDefaultData()
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
