import type { User } from '..'
import type { ApolloApiResponse, NullablePartial } from './types'
import { removeUndefined } from '../../utils/obj'

export async function apolloResponseToUser({ data }: { data: ApolloApiResponse }): Promise<User> {
  const { person = {} } = data
  const o = person.organization || {}

  const user: NullablePartial<User> = {
    avatar: { url: person.photo_url || undefined },
    phone: person.phone_numbers?.[0]?.sanitized_number,
    title: person.title,
    headline: person.headline,
    websiteUrl: o?.website_url,
    accounts: {
      github: person.github_url || undefined,
      x: person.twitter_url || undefined,
      linkedin: person.linkedin_url || undefined,
      facebook: person.facebook_url || undefined,
    },
    company: {
      name: o?.name || undefined,
      role: person.title || undefined,
      seniority: person.seniority || undefined,
      websiteUrl: o?.website_url || undefined,
      employeeCount: o?.estimated_num_employees || undefined,
      industry: o?.industry || undefined,
      location: `${o?.city}, ${o?.state}, ${o?.country}`,
      description: o?.short_description || undefined,
      keywords: o?.keywords?.filter(Boolean) as string[] || [],
      founded: o?.founded_year?.toString(),
      accounts: {
        x: o.twitter_url || undefined,
        linkedin: o.linkedin_url || undefined,
        facebook: o.facebook_url || undefined,
      },
      address: {
        street: o?.street_address || undefined,
        city: o?.city || undefined,
        state: o?.state || undefined,
        postalCode: o?.postal_code || undefined,
        country: o?.country || undefined,
      },
    },

  }

  const final = removeUndefined(user) as User

  return final
}
