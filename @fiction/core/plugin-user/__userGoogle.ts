import type { OAuth2Client } from 'google-auth-library'

import type { User } from './types'
import type { EndpointResponse } from '../types'
import type { EndpointMeta } from '../utils/endpoint'
import { Query } from '../query'
import type { FictionUser } from '.'

interface GoogleQuerySettings {
  clientId?: string
  clientSecret?: string
  fictionUser: FictionUser
}

export class QueryUserGoogleAuth extends Query<GoogleQuerySettings> {
  private client?: OAuth2Client
  constructor(settings: GoogleQuerySettings) {
    super(settings)
  }

  async getClient(): Promise<OAuth2Client> {
    const clientId = this.settings.fictionUser.googleClientId
    const clientSecret = this.settings.fictionUser.googleClientSecret
    if (!clientId)
      throw new Error('missing google auth clientId')
    if (!clientSecret)
      throw new Error('missing clientSecret')

    const { OAuth2Client } = await import('google-auth-library')
    if (!this.client)
      this.client = new OAuth2Client({ clientId, clientSecret })

    return this.client
  }

  async run(
    params: { _action: 'loginWithCredential', credential: string },
    _meta: EndpointMeta,
  ): Promise<
    EndpointResponse<User> & {
      isNew?: boolean
      token?: string
      user?: User
      code?: string
    }
  > {
    const client = await this.getClient()

    const clientId = this.settings.fictionUser.googleClientId

    let user: User | undefined
    let isNew = false
    let message = ''
    let token = ''
    let code: string | undefined

    if (params._action === 'loginWithCredential') {
      this.log.warn('google login start', {
        data: { audience: clientId, ...params },
      })
      const { credential } = params
      const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId })
      const payload = ticket.getPayload()

      if (!payload || !payload.email)
        throw new Error('no payload email')

      this.log.info('google login payload', { data: payload })

      const { data: existingUser }
        = await this.settings.fictionUser.queries.ManageUser.serve(
          { _action: 'retrieve', where: { email: payload?.email } },
          _meta,
        )

      // no user, create one
      if (!existingUser) {
        await this.settings.fictionUser.queries.ManageUser.serve(
          {
            _action: 'create',
            fields: {
              email: payload?.email,
              emailVerified: payload?.email_verified,
              googleId: payload.sub,
              fullName: payload?.name,
              firstName: payload?.given_name,
              lastName: payload?.family_name,
              avatar: { format: 'url', url: payload?.picture },
            },
          },
          _meta,
        )

        isNew = true
      }

      const loginResponse = await this.settings.fictionUser.queries.ManageUser.serve(
        {
          email: payload.email,
          googleId: payload.sub,
          emailVerified: payload?.email_verified,
        },
        { server: true, returnAuthority: ['verificationCode'] },
      )

      user = loginResponse.data
      token = loginResponse.token
      code = loginResponse.code

      message = isNew ? 'new user created' : 'login successful'
    }

    return { status: 'success', data: user, isNew, message, token, user, code }
  }
}
