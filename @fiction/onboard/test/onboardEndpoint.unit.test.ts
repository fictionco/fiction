import type { MockedFunction } from 'vitest'
import { Obj } from '@fiction/core/obj'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

describe('queryManageOnboard endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const fictionUser = testUtils.fictionUser
  const fictionMedia = testUtils.fictionMedia
  const fictionAi = testUtils.fictionAi

  const queryOnboard = testUtils.fictionOnboard.queries.ManageOnboard

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
        name: 'John Doe',
        handle: 'johndoe',
        profile: {
          headline: 'Creative Product Strategist',
          summary: 'I transform complex challenges into elegant solutions.',
          interests: ['Product Design', 'UX Research', 'Design Systems', 'Innovation Strategy'],
          influences: ['Dieter Rams', 'Don Norman'],
        },
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
      { _action: 'enrichFromLinkedIn', profile: { accounts: { linkedin: { handle: testLinkedInHandle } } }, userId, orgId },
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

    const mockServe = fictionAi.queries.QueryAi.serve as MockedFunction<any>
    const cl = mockServe.mock.calls[0][0] as object
    expect(Object.keys(cl)).toMatchInlineSnapshot(`
      [
        "_action",
        "orgId",
        "userId",
        "prompt",
        "schema",
      ]
    `)

    // Verify AI enhancement was called
    expect(fictionAi.queries.QueryAi.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'completion',
        prompt: expect.any(String),
        schema: expect.any(Object),
        orgId,
        userId,
      }),
      expect.any(Object),
    )

    // Verify the profile was processed
    expect(fictionMedia.queries.ManageMedia.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'createFromUrl',
        fields: expect.any(Object),
      }),
      expect.anything(),
    )

    // Verify organization was updated
    expect(fictionUser.queries.ManageOrganization.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'update',
        where: { orgId },
        fields: expect.any(Object),
      }),
      expect.anything(),
    )

    // Verify response
    expect(result.status).toBe('success')
    expect(result.data).toMatchInlineSnapshot(`
      {
        "accounts": {
          "linkedin": {
            "followerCount": 0,
            "handle": "johndoe",
          },
        },
        "avatar": {
          "format": "image",
          "height": undefined,
          "url": "https://processed-image-url.jpg",
          "width": undefined,
        },
        "handle": "johndoe",
        "location": {
          "city": "",
          "country": "",
          "state": "",
        },
        "name": "John Doe",
        "profile": {
          "industry": "",
        },
      }
    `)
  })

  it('should handle LinkedIn API failures gracefully', async () => {
    // Mock API failure
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 403,
    } as Response)

    const result = await queryOnboard.run(
      { _action: 'enrichFromLinkedIn', profile: { accounts: { linkedin: { handle: testLinkedInHandle } } }, userId, orgId },
      { server: true },
    )

    // Should fall back to mock data
    expect(result.status).toBe('success')
    expect(result.data).toBeTruthy()

    // Verify organization still gets updated with fallback data
    expect(fictionUser.queries.ManageOrganization.serve).toHaveBeenCalled()
  })

  it('should update profile with provided fields', async () => {
    const profileUpdate = {
      name: 'Jane Smith',
      profile: {
        headline: 'Design Systems Architect',
        about: 'Building scalable design systems for modern applications',
        interests: ['Design Systems', 'Component Libraries', 'UX Patterns'],
        influences: ['Steve Jobs', 'Alan Cooper'],
      },
    }

    const result = await queryOnboard.run(
      { _action: 'updateProfile', userId, orgId, profile: profileUpdate },
      { server: true },
    )

    // Verify organization was updated with the correctly mapped fields
    expect(fictionUser.queries.ManageOrganization.serve).toHaveBeenCalledWith(
      expect.objectContaining({
        _action: 'update',
        where: { orgId },
        fields: expect.objectContaining({
          name: 'Jane Smith',
          profile: expect.objectContaining({
            headline: 'Design Systems Architect',
            about: 'Building scalable design systems for modern applications',
            interests: ['Design Systems', 'Component Libraries', 'UX Patterns'],
            influences: ['Steve Jobs', 'Alan Cooper'],
          }),
        }),
      }),
      expect.anything(),
    )

    expect(result.status).toBe('success')
    expect(result.data).toEqual(expect.objectContaining({
      name: 'John Doe', // From the mocked organization response
      handle: 'johndoe', // From the mocked organization response
      profile: expect.any(Object),
    }))
  })

  it('should handle AI enhancement failures', async () => {
    // Mock AI failure
    vi.spyOn(fictionAi.queries.QueryAi, 'serve').mockResolvedValue({
      status: 'error',
      message: 'AI service unavailable',
    })

    const result = await queryOnboard.run(
      { _action: 'enrichFromLinkedIn', profile: { accounts: { linkedin: { handle: testLinkedInHandle } } }, userId, orgId },
      { server: true },
    )

    expect(result.status).toBe('success')
    expect(result.data).toEqual(expect.objectContaining({
      name: expect.any(String),
      handle: expect.any(String),
      avatar: expect.any(Object),
      accounts: {
        linkedin: {
          handle: testLinkedInHandle,
          followerCount: expect.any(Number),
        },
      },
      profile: expect.objectContaining({
        industry: expect.any(String),
        headline: expect.any(String),
        summary: expect.any(String),
        interests: expect.any(Array),
        influences: expect.any(Array),
        pillars: expect.any(Array),
        clout: expect.any(Number),
        goal: expect.any(String),
      }),
      location: {
        city: expect.any(String),
        state: expect.any(String),
        country: expect.any(String),
      },
    }))
  })
})
