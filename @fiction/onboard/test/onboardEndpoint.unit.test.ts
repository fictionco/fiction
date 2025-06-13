import { shortId } from '@fiction/core'
import { createSiteTestUtils } from '@fiction/site/test/testUtils'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

describe('queryManageOnboard endpoint', async () => {
  const testUtils = await createSiteTestUtils()
  const initialized = await testUtils.init()
  const fictionUser = testUtils.fictionUser
  const fictionMedia = testUtils.fictionMedia
  const fictionAi = testUtils.fictionAi

  const queryOnboard = testUtils.fictionOnboard.queries.ManageOnboard

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
  })

  afterAll(async () => {
    await testUtils.close()
  })

  it('should update profile with provided fields', async () => {
    const handle = `janeys-${shortId()}`
    const profileUpdate = {
      name: 'Jane Smith',
      handle,
      profile: {
        headline: 'Design Systems Architect',
        about: 'Building scalable design systems for modern applications',
        interests: ['Design Systems', 'Component Libraries', 'UX Patterns'],
        influences: ['Steve Jobs', 'Alan Cooper'],
      },
    }

    const result = await queryOnboard.serve(
      { _action: 'updateProfile', userId, orgId, profile: profileUpdate },
      { server: true },
    )

    expect(result.status).toBe('success')
    expect(result.data?.handle).toBe(handle)
    expect(result.data?.name).toBe('Jane Smith')
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

  it('should complete onboarding successfully', async () => {
    const result = await queryOnboard.serve(
      { _action: 'completeOnboarding', userId, orgId, profile: {} },
      { server: true },
    )

    expect(result.status).toBe('success')
    expect(result.message).toBe('Onboarding completed')
    expect(result.data?.onboard?.phase).toBe('tasks')
  })
})
