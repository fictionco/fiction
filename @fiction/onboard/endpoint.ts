import type { EndpointMeta, EndpointResponse, MediaObject, Organization, User } from '@fiction/core'
import type { FictionOnboardSettings } from '.'
import type { AiEnhancement } from './generation'
import type { LinkedInEnrichmentProfile, ProfileData } from './util'
import { abort, deepMerge, isTest, Query } from '@fiction/core'
import { AiEnhancementSchema, getGenerationParams } from './generation'
import { accountFromProfile, createHandle, getMockLinkedInData, profileFromAccount } from './util'

export type OnboardRequest =
  | { _action: 'enrichFromLinkedIn', userId: string, orgId: string, profile: Partial<ProfileData> }
  | { _action: 'updateProfile', userId: string, orgId: string, profile: Partial<ProfileData> }
  | { _action: 'createDefaultContent', userId: string, orgId: string, profile: Partial<ProfileData> }
  | { _action: 'completeOnboarding', userId: string, orgId: string, profile: Partial<ProfileData> }

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
        case 'completeOnboarding':
          return await this.completeOnboarding(params, meta)
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
          fields: { title: profile.name, isPrimary: true },
          caller: 'createDefaultContent',
        }, { server: true, ...meta }),
      )

      await Promise.all(_promises)

      return await this.completeOnboarding({ userId, orgId }, meta)
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

    const linkedinHandle = params.profile.accounts?.linkedin?.handle

    if (!linkedinHandle)
      throw abort('LinkedIn handle is required')

    if (!this.settings.proxycurlApiKey) {
      throw abort('ProxyCurl API key is required')
    }

    // Use mock data for test handles or when ProxyCurl API key is missing
    const isTesting = !!((linkedinHandle?.toLowerCase().includes('test')))

    const linkedinData = await this.fetchLinkedInProfile({ linkedinHandle, isTesting })
    if (!linkedinData)
      return { status: 'error', message: 'Failed to fetch LinkedIn profile' }

    const returnProfile = await this.buildProfileFromLinkedinData({ linkedinData, userId, orgId, isTesting })
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

  async fetchLinkedInProfile(args: { linkedinHandle?: string, isTesting?: boolean }): Promise<LinkedInEnrichmentProfile> {
    const { linkedinHandle } = args
    if (!linkedinHandle) {
      throw new Error('linkedin username is missing')
    }

    const isTesting = args.isTesting || isTest()

    const url = linkedinHandle.includes('linkedin.com') ? linkedinHandle : `https://www.linkedin.com/in/${linkedinHandle}`

    // Use mock data for test handles or when ProxyCurl API key is missing
    if (isTesting) {
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

  private async buildProfileFromLinkedinData(args: { linkedinData: LinkedInEnrichmentProfile, userId: string, orgId: string, isTesting?: boolean }): Promise<ProfileData> {
    const { orgId, userId, linkedinData, isTesting } = args
    const name = linkedinData.full_name || ''
    const handle = linkedinData.public_identifier || createHandle(name)
    const avatarUrl = linkedinData.profile_pic_url || ''

    const aiEnhancement = await this.enhanceProfileWithAi({ linkedinData, orgId, userId, isTesting })
    const avatar = avatarUrl ? await this.processAvatarToMedia({ url: avatarUrl }, orgId, userId) : undefined

    const enrichData = {
      name,
      handle,
      profile: {
        industry: linkedinData.industry || '',
      },
      location: {
        city: linkedinData?.city || '',
        state: linkedinData?.state || '',
        country: linkedinData?.country || '',
      },
      avatar,
      accounts: {
        linkedin: {
          handle,
          followerCount: linkedinData.follower_count || 0,
        },
      },
    }

    return deepMerge([enrichData, aiEnhancement])
  }

  private async enhanceProfileWithAi(args: { linkedinData: LinkedInEnrichmentProfile, orgId: string, userId: string, isTesting?: boolean }): Promise<AiEnhancement> {
    const { orgId, userId, linkedinData, isTesting } = args
    const params = getGenerationParams({ linkedinData })

    const getMockAiFallback = (): AiEnhancement => {
      const { headline, summary = '', skills } = linkedinData
      return {
        profile: {
          hero: 'Grow Your Influence',
          headline: headline || 'Leader',
          summary: summary || 'An experienced professional with a passion for innovation.',
          interests: skills?.slice(0, 5).map(s => s.name) || ['Innovation', 'Technology'],
          influences: [],
          pillars: [],
          clout: 0,
          goal: 'Build a personal brand.',
        },
      }
    }

    if (isTesting) {
      this.log.info('Using mock data for AI enhancement', { handle: linkedinData.public_identifier })
      return getMockAiFallback()
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
      return getMockAiFallback()
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

  private async completeOnboarding(args: { userId: string, orgId: string }, meta: EndpointMeta): Promise<EndpointResponse<ProfileData>> {
    const { userId, orgId } = args

    await this.ManageOrganization.serve({ _action: 'update', where: { orgId }, fields: { onboard: { phase: 'tasks' } } }, { ...meta, server: true })

    await this.ManageUser.serve({ _action: 'retrieve', where: { userId } }, { ...meta, server: true })

    const [org, user] = await Promise.all([
      this.ManageOrganization.serve({ _action: 'read', where: { orgId } }, { ...meta, server: true }).then(r => r.data),
      this.ManageUser.serve({ _action: 'retrieve', where: { userId } }, { ...meta, server: true }).then(r => r.data),
    ])

    if (!org || !user) {
      throw abort('Organization or user not found')
    }

    if (org.onboard?.phase !== 'tasks') {
      throw abort('Onboarding phase is not set to tasks')
    }
    else {
      this.log.info('Onboarding completed', { data: { org, user } })
    }

    const out = { org, user }
    await this.addFictionConnections(out, meta)

    await this.settings.fictionUser.hooks.run('newUserOnboarded', out)

    return {
      status: 'success',
      message: 'Onboarding completed',
      data: profileFromAccount({ user, org }),
      user: out.user,
    }
  }

  private async updateProfileData(args: { userId: string, orgId: string, profile: Partial<ProfileData> }, meta: EndpointMeta) {
    const { userId, orgId, profile } = args
    const { orgFields = {}, userFields = {} } = accountFromProfile(profile)

    const [orgResult, userResult] = await Promise.all([
      this.ManageOrganization.serve({ _action: 'update', where: { orgId }, fields: orgFields }, { ...meta, server: true }),
      this.ManageUser.serve({ _action: 'update', where: { userId }, fields: userFields }, { ...meta, server: true }),
    ])

    const out = { org: orgResult?.data, user: userResult?.data }

    return out
  }

  private async addFictionConnections(args: { user?: User, org?: Organization }, meta: EndpointMeta): Promise<void> {
    const { user, org } = args
    const { fictionContact, fictionEnv } = this.settings

    if (!org?.orgId)
      throw abort('Organization is required')
    if (!user?.email)
      throw abort('User is required')

    if (!fictionContact)
      return

    const systemOrgId = fictionEnv.meta.systemOrgId
    const andrewEmail = 'andrew@fiction.com'

    try {
    // Add andrew@fiction.com to user's contact list
      await fictionContact.queries.ManageContact.serve({ _action: 'create', orgId: org.orgId, contact: { email: andrewEmail, tags: ['fiction'], status: 'active' } }, { server: true, ...meta })

      // Subscribe user to Fiction's system org
      if (systemOrgId) {
        await fictionContact.queries.ManageContact.serve({ _action: 'create', orgId: systemOrgId, contact: { email: user.email, tags: ['fiction'], status: 'active' } }, { server: true, ...meta })
      }
    }
    catch (error) {
      this.log.warn('Failed to add Fiction connections', { error })
    // Don't throw - this shouldn't block onboarding
    }
  }
}
