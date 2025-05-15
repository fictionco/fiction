import { FictionPosts } from '@fiction/posts'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { FictionOnboard } from '..'

describe('queryManageOnboard endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const fictionUser = testUtils.fictionUser
  const fictionMedia = testUtils.fictionMedia
  const fictionAi = testUtils.fictionAi

  const fictionPosts = new FictionPosts(testUtils)

  const fictionOnboard = new FictionOnboard({ ...testUtils, fictionPosts })

  const queryOnboard = fictionOnboard.queries.ManageOnboard

  // Mock the fetch function for LinkedIn API calls
  globalThis.fetch = vi.fn()

  const userId = initialized.user.userId
  const orgId = initialized.org.orgId
  const testLinkedInHandle = 'johndoe'

  if (!userId || !orgId)
    throw new Error('userId or orgId is not defined')

  // Mock LinkedIn API response
  const mockLinkedInData = {
    public_identifier: 'johndoe',
    full_name: 'John Doe',
    headline: 'Product Designer & Technology Leader',
    summary: 'Experienced professional passionate about creating innovative solutions.',
    profile_pic_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    skills: [{ name: 'UX Design' }, { name: 'Product Strategy' }, { name: 'Leadership' }],
  }

  // Mock AI completion response
  const mockAiCompletion = {
    headline: 'Creative Product Strategist',
    about: 'I transform complex challenges into elegant solutions. With over a decade of experience in product design, I focus on user-centered approaches that drive business growth.',
    interests: ['Product Design', 'UX Research', 'Design Systems', 'Innovation Strategy'],
    influences: ['Dieter Rams', 'Don Norman'],
  }

  beforeEach(() => {
    vi.resetAllMocks()

    // Mock successful LinkedIn API response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockLinkedInData,
    } as Response)

    // Mock AI completion response
    vi.spyOn(fictionAi.queries.QueryAi, 'serve').mockResolvedValue({
      status: 'success',
      data: { completion: mockAiCompletion },
    })

    // Mock media processing
    vi.spyOn(fictionMedia.queries.ManageMedia, 'serve').mockResolvedValue({
      status: 'success',
      data: [{ url: 'https://processed-image-url.jpg' }],
    })

    // Mock organization and user updates
    vi.spyOn(fictionUser.queries.ManageOrganization, 'serve').mockResolvedValue({
      status: 'success',
      data: {
        orgId,
        orgName: 'John Doe',
        handle: 'johndoe',
        headline: 'Creative Product Strategist',
        about: 'I transform complex challenges into elegant solutions.',
        interests: ['Product Design', 'UX Research', 'Design Systems', 'Innovation Strategy'],
        influences: ['Dieter Rams', 'Don Norman'],
        avatar: { url: 'https://processed-image-url.jpg' },
      },
    })

    vi.spyOn(fictionUser.queries.ManageUser, 'serve').mockResolvedValue({
      status: 'success',
    })
  })

  afterAll(async () => {
    await testUtils.close()
  })

  it('should enrich profile from LinkedIn URL', async () => {
    // Execute the query
    const result = await queryOnboard.serve(
      { _action: 'enrichFromLinkedIn', profile: { linkedinHandle: testLinkedInHandle }, userId, orgId },
      { server: true },
    )

    // Verify API call
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://nubela.co/proxycurl/api/v2/linkedin'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Bearer .+$/),
        }),
      }),
    )

    // Verify AI enhancement was called
    expect(fictionAi.queries.QueryAi.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'completion',
        runPrompt: expect.stringContaining('Enhance this LinkedIn profile'),
        format: 'websiteCopy',
      }),
      expect.anything(),
    )

    // Verify the profile was processed
    expect(fictionMedia.queries.ManageMedia.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'createFromUrl',
        fields: { sourceImageUrl: mockLinkedInData.profile_pic_url },
      }),
      expect.anything(),
    )

    // Verify organization was updated
    expect(fictionUser.queries.ManageOrganization.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'update',
        where: { orgId },
        fields: expect.objectContaining({
          orgName: 'John Doe',
          headline: mockAiCompletion.headline,
          interests: mockAiCompletion.interests.join(', '),
        }),
      }),
      expect.anything(),
    )

    // Verify response
    expect(result.status).toBe('success')
    expect(result.data).toEqual(expect.objectContaining({
      name: 'John Doe',
      handle: 'johndoe',
      headline: mockAiCompletion.headline,
      interests: mockAiCompletion.interests,
    }))
  })

  it('should handle LinkedIn API failures gracefully', async () => {
    // Mock API failure
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 403,
    } as Response)

    const result = await queryOnboard.run(
      { _action: 'enrichFromLinkedIn', profile: { linkedinHandle: testLinkedInHandle }, userId, orgId },
      { server: true },
    )

    // Should fall back to mock data
    expect(result.status).toBe('success')
    expect(result.data).toBeTruthy()

    // Verify organization still gets updated with fallback data
    expect(fictionUser.queries.ManageOrganization.serve).toHaveBeenCalled()
  })

  it('should validate LinkedIn URL format', async () => {
    const r = await queryOnboard.run(
      { _action: 'enrichFromLinkedIn', profile: { linkedinHandle: 'https://invalid-url.com' }, userId, orgId },
      { server: true },
    )

    await expect(r.status).toBe('error')
  })

  it('should update profile with provided fields', async () => {
    const profileUpdate = {
      name: 'Jane Smith',
      headline: 'Design Systems Architect',
      about: 'Building scalable design systems for modern applications',
      interests: ['Design Systems', 'Component Libraries', 'UX Patterns'],
      influences: ['Steve Jobs', 'Alan Cooper'],
    }

    const result = await queryOnboard.run(
      { _action: 'updateProfile', userId, orgId, profile: profileUpdate },
      { server: true },
    )

    // Verify organization was updated
    expect(fictionUser.queries.ManageOrganization.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'update',
        fields: expect.objectContaining({
          orgName: 'Jane Smith',
          headline: 'Design Systems Architect',
          interests: 'Design Systems, Component Libraries, UX Patterns',
          influences: 'Steve Jobs, Alan Cooper',
        }),
      }),
      expect.anything(),
    )

    expect(result.status).toBe('success')
    expect(result.data).toEqual(expect.objectContaining({
      name: 'John Doe', // From the mocked organization response
      headline: 'Creative Product Strategist', // From the mocked organization response
    }))
  })

  it('should process avatar when updating profile', async () => {
    const result = await queryOnboard.run(
      {
        _action: 'updateProfile',
        userId,
        orgId,
        profile: {
          avatar: { url: 'https://example.com/avatar.jpg' },
        },
      },
      { server: true },
    )

    // Verify avatar was processed
    expect(fictionMedia.queries.ManageMedia.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'createFromUrl',
        fields: { sourceImageUrl: 'https://example.com/avatar.jpg' },
      }),
      expect.anything(),
    )

    expect(result.status).toBe('success')
  })

  it('should handle AI enhancement failures', async () => {
    // Mock AI failure
    vi.spyOn(fictionAi.queries.QueryAi, 'serve').mockResolvedValue({
      status: 'error',
      message: 'AI service unavailable',
    })

    const result = await queryOnboard.run(
      { _action: 'enrichFromLinkedIn', profile: { linkedinHandle: testLinkedInHandle }, userId, orgId },
      { server: true },
    )

    // Should use fallback values
    expect(result.status).toBe('success')
    expect(result.data).toEqual(expect.objectContaining({
      headline: expect.any(String),
      about: expect.any(String),
      interests: expect.any(Array),
    }))
  })
})
