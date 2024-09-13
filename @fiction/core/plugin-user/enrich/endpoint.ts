/* server-only-file */
import type { EndpointResponse } from '@fiction/core/types'
import type { User } from '..'
import type { ApolloApiResponse } from './types'
import { deepMerge, type EndpointMeta } from '@fiction/core/utils'
import { UserBaseQuery } from '../endpoint'
import { apolloResponseToUser } from './util'

export type EnrichUserParams =
  | { _action: 'enrichUser', user: User }

export class EnrichUser extends UserBaseQuery {
  enrichmentUrl = 'https://api.apollo.io/v1/people/match'
  async run(params: EnrichUserParams, _meta: EndpointMeta): Promise<EndpointResponse<User>> {
    const { user } = params

    const fictionUser = this.settings.fictionUser
    const apiKey = fictionUser.settings.apolloApiKey

    if (!apiKey)
      return { status: 'error', message: 'missing API key' }

    try {
      const requestBody = {
        email: user.email,
        name: user.fullName,
      }

      const response = await fetch(this.enrichmentUrl, {
        method: 'POST',
        headers: { 'Accept': '*/*', 'X-Api-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const responseData = await response.json() as ApolloApiResponse

      const { headline, photo_url, organization } = responseData.person || {}

      if (!headline && !photo_url && !organization) {
        this.log.info(`no data available for ${user.email}`, { data: responseData })
        return { status: 'error', message: 'enrichment data unavailable', expose: false }
      }

      const updatedUser = await apolloResponseToUser({ data: responseData })
      const fields = deepMerge([updatedUser, user])

      const userId = user.userId

      if (!userId)
        return { status: 'error', message: 'missing userId' }

      const r = await fictionUser.queries.ManageUser.serve({ _action: 'update', fields, where: { userId } }, { server: true })

      const data = r.data

      this.log.info(`successful enrichment for ${user.email}`, { data })

      return { status: 'success', data: r.data }
    }
    catch (error) {
      this.log.error('error enriching user', { error })
      return { status: 'error', message: (error as Error).message }
    }
  }
}
