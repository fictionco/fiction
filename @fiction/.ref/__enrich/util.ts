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
    accounts: {
      github: person.github_url || undefined,
      x: person.twitter_url || undefined,
      linkedin: person.linkedin_url || undefined,
      facebook: person.facebook_url || undefined,
    },

  }

  const final = removeUndefined(user) as User

  return final
}
