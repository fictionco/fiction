import type { TrackEventTypes } from '@fiction/analytics/index.js'
import type { EmailSendConfig, Organization, RequestOptions } from '@fiction/core'
import type { EmailUserVars } from '@fiction/core/plugin-email/endpoint.js'
import type express from 'express'
import type { ManageCampaignRequestParams } from './endpoint.js'
import type { FictionNewsletter } from './index.js'
import type { EmailCampaignConfig } from './schema.js'
import { convertKeyCase, log, toMarkdown, vue } from '@fiction/core'
import { z } from 'zod'
import { EmailCampaign } from './campaign.js'
import {url} from 'inspector'

export async function manageEmailCampaign(args: { fictionNewsletter: FictionNewsletter, params: ManageCampaignRequestParams, options?: RequestOptions }) {
  const { fictionNewsletter, params, options = {} } = args

  const r = await fictionNewsletter.requests.ManageCampaign.projectRequest(params, options)

  return r.data?.map(emailConfig => new EmailCampaign({ ...emailConfig, fictionNewsletter })) || []
}

export async function loadEmail(args: { fictionNewsletter: FictionNewsletter, campaignId: string }) {
  const { fictionNewsletter, campaignId } = args

  if (!campaignId)
    throw new Error('No campaignId')

  const [_campaign] = await manageEmailCampaign({ fictionNewsletter, params: { _action: 'get', where: { campaignId } } })

  const campaign = _campaign

  return campaign
}

export async function getEmailForCampaign(args: {
  org: Organization
  campaignConfig: EmailCampaignConfig
  fictionNewsletter: FictionNewsletter
  withDefaults: boolean
  previewMode?: 'dark' | 'light' | ''
}): Promise<EmailSendConfig> {
  const { campaignConfig, fictionNewsletter, withDefaults = false, org, previewMode } = args
  const { fictionEmail, fictionEnv, fictionMedia } = fictionNewsletter.settings
  const isApp = fictionEnv?.isApp.value
  const isTest = fictionEnv?.isTest.value
  const env = fictionEnv.isProd.value ? 'prod' : isTest ? 'test' : 'dev'

  const img = await fictionEmail?.emailImages({ fictionMedia })

  const { orgName, orgEmail, websiteUrl, streetAddress, avatar } = org

  let emailConfig: EmailSendConfig = {
    fromName: orgName || (withDefaults ? 'No Name' : ''),
    fromEmail: orgEmail || (withDefaults ? 'No Email' : ''),
    avatarUrl: avatar?.url,
    emailType: 'campaign',
    fromOrgId: campaignConfig.orgId,
    campaignId: campaignConfig.campaignId,
    subject: campaignConfig.subject || (withDefaults ? 'No Subject' : ''),
    title: campaignConfig.post?.title || (withDefaults ? 'No Title' : ''),
    subTitle: campaignConfig.post?.subTitle || (withDefaults ? 'No Subtitle' : ''),
    bodyMarkdown: await toMarkdown(campaignConfig.post?.content || (withDefaults ? 'No content' : '')),
    actions: campaignConfig.userConfig?.actions || [],
    mediaSuper: { media: { url: avatar?.url }, label: orgName, href: url },
    mediaFooter: { media: { url: img.footer.url }, label: 'Powered by Fiction', href: 'https://www.fiction.com' },
    legal: { label: orgName, href: websiteUrl, description: streetAddress || '' },
    unsubscribeUrl: '#',
    previewMode,
    env,
  }

  if (isApp) {
    const EmailStandard = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailStandard.vue'))
    const { render } = await import('@vue-email/render')
    emailConfig.bodyHtml = await render(EmailStandard, emailConfig)
  }
  else {
    emailConfig = await fictionEmail?.renderEmailTemplate(emailConfig)
  }

  return emailConfig
}

export const EmailTrackingActionsEnum = z.enum(['delivered', 'failed', 'opened', 'clicked', 'unsubscribed', 'complained', 'bounced'])
export type EmailTrackingActions = z.infer<typeof EmailTrackingActionsEnum>

// Main webhook event type
type MailgunEvent = {
  id: string
  timestamp: number
  event: EmailTrackingActions
  recipient: string
  recipientDomain: string
  tags?: string[]
  userVariables?: EmailUserVars
  logLevel: 'info' | 'error' | 'warning'
  severity?: 'permanent' | 'temporary'
  deliveryStatus: {
    code?: number
    message?: string
    attemptNo: number
    sessionSeconds?: number
    description?: string
  }
  envelope: {
    sender: string
    transport: string
    targets: string[]
    sendingIp: string
  }
  message: {
    headers: {
      to: string
      from: string
      subject: string
      messageId: string
    }
    size: number
  }
  storage?: {
    url: string
    key: string
  }
  reason?: string
  flags?: {
    isRouted: boolean
    isAuthenticated: boolean
    isSystemTest: boolean
    isTestMode: boolean
  }
  geolocation?: {
    country?: string
    region?: string
    city?: string
    timezone?: string
  }
  url?: string
}

// Webhook request structure
type MailgunWebhookRequestBody = {
  signature: {
    token: string
    timestamp: number
    signature: string
  }
  eventData: MailgunEvent
}

const AnalyticsEventMap: Record<EmailTrackingActions, keyof TrackEventTypes> = {
  delivered: 'emailDelivered',
  failed: 'emailFailed',
  bounced: 'emailBounced',
  opened: 'emailOpened',
  clicked: 'emailClicked',
  unsubscribed: 'subscriptionUnsubscribed',
  complained: 'emailComplained',
}

export async function trackingEndpointHandler(args: {
  fictionNewsletter: FictionNewsletter
  request: express.Request
  response: express.Response
}): Promise<void> {
  const { fictionNewsletter, request, response } = args
  const query = request.query as Record<string, string>
  const params = request.params as { action?: 'init' }
  const body = convertKeyCase(request.body, { mode: 'camel' }) as MailgunWebhookRequestBody

  const fictionAnalytics = fictionNewsletter.settings.fictionAnalytics
  const isProd = fictionNewsletter.settings.fictionEnv.isProd.value

  try {
    const userVariables = body.eventData.userVariables || {}
    const geolocation = body.eventData.geolocation || {}

    if ((isProd && userVariables.env !== 'prod') || (!isProd && userVariables.env === 'prod')) {
      fictionNewsletter.log.error('ignoring email event', {
        data: {
          isProd,
          env: userVariables.env,
          event: body.eventData.event,
          recipient: body.eventData.recipient,
        },
      })
      return
    }

    fictionNewsletter.log.info('email tracking webhook', { data: { query, params, body } })

    let mapValue = body.eventData.event as keyof typeof AnalyticsEventMap

    if (body.eventData.event === 'failed' && body.eventData.severity === 'temporary') {
      mapValue = 'bounced'
    }

    const event = AnalyticsEventMap[mapValue]

    if (!userVariables.fromOrgId) {
      fictionNewsletter.log.warn(`not tracking email (no fromOrgId)`, { data: { userVariables } })
      return
    }

    fictionAnalytics.track({
      orgId: userVariables.fromOrgId,
      event,
      value: 1,
      postId: userVariables?.postId,
      email: body.eventData.recipient,
      url: body.eventData.url,
      cityName: geolocation.city,
      regionName: geolocation.region,
      countryCode: geolocation.country,
      channel: userVariables.caller,
    })

    response.send(body).end()
  }
  catch (error) {
    const e = error as Error
    fictionNewsletter.log.error('tracking endpoint threw an error', { error })
    response.status(400).send({ status: 'error', message: e.message }).end()
  }
}
