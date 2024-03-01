// @unocss-include
import { EnvVar, vars } from '@factor/api/plugin-env'
import { InputOption } from '@kaption/core/utils/inputOption'

import type {
  IntegrationClientDetail,
  IntegrationMode,
} from '../connection'
import {
  AuthHandler,
  KaptionConnection,
} from '../connection'
import type { IntegrationRow } from '../plugin-integrations/tables'

const clientIdKey = 'INTEGRATION_SLACK_CLIENT_ID'
const clientSecretKey = 'INTEGRATION_SLACK_CLIENT_SECRET'
const signingSecretKey = 'INTEGRATION_SLACK_SIGNING_SECRET'
vars.register(() => [
  new EnvVar({
    name: clientIdKey,
    val: process.env[clientIdKey],
  }),
  new EnvVar({
    name: clientSecretKey,
    val: process.env[clientSecretKey],
  }),
  new EnvVar({
    name: signingSecretKey,
    val: process.env[signingSecretKey],
  }),
])

interface SlackAuthPayload {
  status: 'active'
  appId: string
  authedUser: { id: string }
  scope: string // the scopes that were granted
  tokenType: 'bot'
  accessToken: string
  botUserId: string
  team: { id: string, name: string }
  incomingWebhook: {
    channel: string
    channelId: string
    configurationUrl: string // where they can configure the app
    url: string
  }
}

export class ConnectSlack extends KaptionConnection {
  clientId = this.settings.factorEnv.var(clientIdKey)
  clientSecret = this.settings.factorEnv.var(clientSecretKey)
  signingSecret = this.settings.factorEnv.var(signingSecretKey)
  projectId = this.settings.projectId
  key = 'slack' as const
  name = 'Slack'
  description = 'Send Slack messages on specific events'
  icon = 'i-logos-slack-icon'
  supports: IntegrationMode[] = ['table']

  auth = new AuthHandler({
    authType: 'oauth2' as const,
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    clientId: this.clientId,
    clientSecret: this.clientSecret,
    scope:
      'incoming-webhook,commands,chat:write,chat:write.public,channels:manage',
  })

  constructor(settings: IntegrationClientDetail) {
    super('ConnectSlack', settings)
  }

  async getSlackApp() {
    const state = this.connectionState.value
    const lib = await import('@slack/bolt')

    const slackApp = new lib.default.App({
      token: state?.oAuthPayload?.accessToken,
      signingSecret: this.signingSecret,
    })

    return slackApp
  }

  async activate(): Promise<Partial<IntegrationRow>> {
    const state = this.connectionState.value || {}

    try {
      const slackApp = await this.getSlackApp()

      // const payload = state.oAuthPayload as Partial<SlackAuthPayload>

      // state.channelGroupId = payload.team?.id
      // state.channelGroupName = payload.team?.name
      // state.channelId = payload.incomingWebhook?.channelId
      // state.channelName = payload.incomingWebhook?.channel
      // state.channelUrl = payload.incomingWebhook?.url
      // state.channelSetupUrl = payload.incomingWebhook?.configurationUrl

      if (!state.channelName)
        throw this.stop('no channelId')

      this.log.info(`sending message to channel `, {
        data: {
          channelName: state.channelName,
          token: state.oAuthPayload?.accessToken,
        },
      })

      // if (state.channelUserId) {
      //   await slackApp.client.conversations.invite({
      //     users: state.channelUserId,
      //     channel: state.channelName,
      //   })
      // }

      await slackApp.client.chat.postMessage({
        channel: state.channelName,
        text: 'Kaption is now connected to Slack!',
        token: state.oAuthPayload?.accessToken,
      })
    }
    catch (error) {
      const e = error as Error
      this.log.error('slack integration error', { error, data: state })

      throw this.stop({ message: `There was an issue: ${e.message}` })
    }

    return {}
  }

  standardFields(_: Partial<IntegrationRow>): Partial<IntegrationRow> {
    const payload = _.oAuthPayload as Partial<SlackAuthPayload>
    _.channelGroupId = payload.team?.id
    _.channelGroupName = payload.team?.name
    _.channelId = payload.incomingWebhook?.channelId
    _.channelName = payload.incomingWebhook?.channel
    _.channelUrl = payload.incomingWebhook?.url
    _.channelSetupUrl = payload.incomingWebhook?.configurationUrl
    _.channelUserId = payload.botUserId
    return _
  }

  hasRequiredDetails = this.utils.vue.computed(() => {
    const pl = this.connectionState.value?.oAuthPayload
    return !!(pl && Object.keys(pl).length > 0)
  })

  opts = this.utils.vue.computed<InputOption<keyof IntegrationRow | string>[]>(
    () => {
      return [
        this.getOAuthOption(),
        new InputOption({
          label: 'Channel',
          description:
            'Make sure the bot was allowed in the channel (Include hashtag for public channels. Example: #dev, #support, notify)',
          optionKey: 'channelName',
          input: 'InputText',
          category: 'handling',
          isVisible: this.utils.vue.computed(
            () => this.hasRequiredDetails.value,
          ),
        }),
      ]
    },
  )
}
