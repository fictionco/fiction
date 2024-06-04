import { describe, expect, it, vi } from 'vitest'
import { createTestUtils, getTestEmail } from '../../../test-utils'
import exampleResponse from './exampleResponse.json'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('user enrichment', async () => {
  const testUtils = createTestUtils()
  testUtils.fictionUser.settings.apolloApiKey = 'test'
  const initialized = await testUtils.init()

  it('enriches a user', async () => {
    const user = initialized?.user

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => exampleResponse,
    })

    const r = await testUtils.fictionUser.fictionUserEnrich?.queries.EnrichUser.serve({ _action: 'enrichUser', user }, { server: true })

    if (!r)
      throw new Error('missing response')

    expect(r.status).toBe('success')

    const enrichedUser = r.data

    expect(enrichedUser).toBeDefined()
    expect(enrichedUser?.email).toBe(user.email)
    expect(enrichedUser?.orgs).toBeDefined()
    expect(enrichedUser?.userId).toBe(user.userId)
    expect(enrichedUser?.hashedPassword).toBeFalsy()
    expect(enrichedUser?.verify?.code).toBeFalsy()
    expect(enrichedUser?.headline).toBe(exampleResponse.person.headline)
    expect(enrichedUser?.title).toBe(exampleResponse.person.title)
    expect(enrichedUser?.accounts?.xUrl).toBe(exampleResponse.person.twitter_url)
    expect(enrichedUser?.company?.employeeCount).toBe(exampleResponse.person.organization.estimated_num_employees)
    expect(enrichedUser?.websiteUrl).toBe(exampleResponse.person.organization.website_url)
  })
})
