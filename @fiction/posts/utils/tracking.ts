import type { TrackEventTypes } from '@fiction/analytics'
import type { EmailUserVars } from '@fiction/core/plugin-email/endpoint'
import type express from 'express'
import type { FictionSend } from '../send'
import { convertKeyCase } from '@fiction/core'
import { z } from 'zod'

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
  fictionSend: FictionSend
  request: express.Request
  response: express.Response
}): Promise<void> {
  const { fictionSend, request, response } = args
  const query = request.query as Record<string, string>
  const params = request.params as { action?: 'init' }
  const body = convertKeyCase(request.body, { mode: 'camel' }) as MailgunWebhookRequestBody

  const fictionAnalytics = fictionSend.settings.fictionAnalytics
  const isProd = fictionSend.settings.fictionEnv.isProd.value

  try {
    const userVariables = body.eventData.userVariables || {}
    const geolocation = body.eventData.geolocation || {}

    if ((isProd && userVariables.env !== 'prod') || (!isProd && userVariables.env === 'prod')) {
      fictionSend.log.error('ignoring email event', {
        data: {
          isProd,
          env: userVariables.env,
          event: body.eventData.event,
          recipient: body.eventData.recipient,
        },
      })
      return
    }

    fictionSend.log.info('email tracking webhook', { data: { query, params, body } })

    let mapValue = body.eventData.event as keyof typeof AnalyticsEventMap

    if (body.eventData.event === 'failed' && body.eventData.severity === 'temporary') {
      mapValue = 'bounced'
    }

    const event = AnalyticsEventMap[mapValue]

    if (!userVariables.fromOrgId) {
      fictionSend.log.warn(`not tracking email (no fromOrgId)`, { data: { userVariables } })
      return
    }

    fictionAnalytics.track({
      orgId: userVariables.fromOrgId,
      event,
      value: 1,
      postId: userVariables?.postId,
      contactId: userVariables?.contactId,
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
    fictionSend.log.error('tracking endpoint threw an error', { error })
    response.status(400).send({ status: 'error', message: e.message }).end()
  }
}
