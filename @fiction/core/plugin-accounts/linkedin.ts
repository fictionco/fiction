import type { FictionApp, FictionDb, FictionEnv, FictionPluginSettings, FictionRouter, FictionServer, FictionUser } from '@fiction/core'
import { Endpoint, FictionPlugin } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'

// Register environment variables
vars.register(() => [
  new EnvVar({ name: 'LINKEDIN_CLIENT_ID', isPublic: true }),
  new EnvVar({ name: 'LINKEDIN_CLIENT_SECRET', isPublic: false }),
])

export type LinkedInPluginSettings = {
  fictionEnv: FictionEnv
  fictionApp: FictionApp
  fictionServer: FictionServer
  fictionUser: FictionUser
  fictionRouter: FictionRouter
  fictionDb: FictionDb
} & FictionPluginSettings

export class FictionLinkedIn extends FictionPlugin<LinkedInPluginSettings> {
  endpointKey = 'linkedin-auth'
  endpointRegisterKey = `/accounts/${this.endpointKey}`
  endpointBase = `${this.settings.fictionApp.appUrl.value}/api${this.endpointRegisterKey}`

  constructor(settings: LinkedInPluginSettings) {
    super('FictionLinkedIn', settings)
    this.setupEndpoint()
  }

  private setupEndpoint() {
    const linkedInEndpoint = new Endpoint({
      key: 'linkedInEndpoint',
      basePath: `${this.endpointRegisterKey}/:action`,
      serverUrl: this.settings.fictionServer.serverUrl.value,
      fictionUser: this.settings.fictionUser,
      fictionEnv: this.settings.fictionEnv,
      useNaked: true,
      requestHandler: async (req, res) => {
        const { action } = req.params
        const query = req.query

        const clientId = this.settings.fictionEnv.var('LINKEDIN_CLIENT_ID')
        const clientSecret = this.settings.fictionEnv.var('LINKEDIN_CLIENT_SECRET')
        try {
          if (action === 'auth') {
            // Step 1: Redirect to LinkedIn auth page

            const redirectUri = `${this.endpointBase}/callback`
            const state = query.redirect?.toString() || '/'
            const scope = 'r_liteprofile'

            const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&scope=${scope}`

            res.redirect(303, authUrl)
          }
          else if (action === 'callback') {
            // Step 2: Handle callback from LinkedIn
            const { code, state } = query
            const redirectUrl = decodeURIComponent(state as string)

            if (!code) {
              res.redirect(303, `${redirectUrl}?li=error&error=missing_code`)
              return
            }

            const redirectUri = `${this.endpointBase}/callback`

            const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code as string,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
              }),
            })

            const tokenData = await tokenResponse.json()

            if (!tokenData.access_token) {
              res.redirect(303, `${redirectUrl}?li=error&error=token_exchange`)
              return
            }

            // Get user profile with access token
            const profileResponse = await fetch('https://api.linkedin.com/v2/me?projection=(id,vanityName)', {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Content-Type': 'application/json',
              },
            })

            const profile = await profileResponse.json()
            const linkedInUsername = profile.vanityName || profile.id

            // Redirect back to original URL with username as query param
            res.redirect(303, `${redirectUrl}?li=${encodeURIComponent(linkedInUsername)}`)
          }
          else {
            res.status(400).send('Invalid action')
          }
        }
        catch (error) {
          this.log.error('LinkedIn OAuth error', { error })
          res.status(500).send('Authentication failed')
        }
      },

    })

    this.settings.fictionServer.addEndpoints([linkedInEndpoint])
  }

  getAuthUrl(redirectUrl: string): string {
    return `${this.endpointBase}/auth?redirect=${encodeURIComponent(redirectUrl)}`
  }
}
