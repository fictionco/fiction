import { describe, expect, it } from 'vitest'

import { apolloResponseToUser } from '../util'
import exampleResponse from './exampleResponse.json'
import type { User } from '../..'
import type { ApolloApiResponse } from '../types'

describe('apolloResponseToUser', () => {
  it('should correctly convert Apollo response to User', async () => {
    const data: ApolloApiResponse = exampleResponse
    const user: User = await apolloResponseToUser({ data })

    expect(user.avatar?.url).toBe(exampleResponse.person.photo_url || undefined)
    expect(user.phone).toBe(exampleResponse.person.phone_numbers[0].sanitized_number || undefined)
    expect(user.title).toBe(exampleResponse.person.title || undefined)
    expect(user.headline).toBe(exampleResponse.person.headline || undefined)
    expect(user.websiteUrl).toBe(exampleResponse.person.organization.website_url || undefined)
    expect(user.accounts?.githubUrl).toBe(exampleResponse.person.github_url || undefined)

    expect(user.accounts?.xUrl).toMatchInlineSnapshot(`"https://www.x.com/arpowers"`)
    expect(user.accounts?.xUrl).toBe(exampleResponse.person.twitter_url || undefined)
    expect(user.accounts?.linkedinUrl).toBe(exampleResponse.person.linkedin_url || undefined)
    expect(user.accounts?.facebookUrl).toBe(exampleResponse.person.facebook_url || undefined)

    expect(user.company?.name).toBe(exampleResponse.person.organization.name || undefined)
    expect(user.company?.role).toBe(exampleResponse.person.title || undefined)
    expect(user.company?.seniority).toBe(exampleResponse.person.seniority || undefined)
    expect(user.company?.websiteUrl).toBe(exampleResponse.person.organization.website_url || undefined)
    expect(user.company?.employeeCount).toBe(exampleResponse.person.organization.estimated_num_employees || undefined)
    expect(user.company?.industry).toBe(exampleResponse.person.organization.industry || undefined)
    expect(user.company?.location).toBe(`${exampleResponse.person.organization.city}, ${exampleResponse.person.organization.state}, ${exampleResponse.person.organization.country}` || undefined)
    expect(user.company?.description).toBe(exampleResponse.person.organization.short_description || undefined)
    expect(user.company?.keywords).toEqual(exampleResponse.person.organization.keywords || undefined)
    expect(user.company?.founded).toBe(exampleResponse.person.organization.founded_year.toString() || undefined)

    expect(user.company?.accounts?.githubUrl).toBe(exampleResponse.person.github_url || undefined)
    expect(user.company?.accounts?.xUrl).toBe(exampleResponse.person.organization.twitter_url || undefined)
    expect(user.company?.accounts?.linkedinUrl).toBe(exampleResponse.person.organization.linkedin_url || undefined)
    expect(user.company?.accounts?.facebookUrl).toBe(exampleResponse.person.organization.facebook_url || undefined)

    expect(user.company?.address?.street).toBe(exampleResponse.person.organization.street_address || undefined)
    expect(user.company?.address?.city).toBe(exampleResponse.person.organization.city || undefined)
    expect(user.company?.address?.state).toBe(exampleResponse.person.organization.state || undefined)
    expect(user.company?.address?.postalCode).toBe(exampleResponse.person.organization.postal_code || undefined)
    expect(user.company?.address?.country).toBe(exampleResponse.person.organization.country || undefined)
  })
})
