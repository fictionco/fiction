import type { TrackEventTypes } from '@fiction/analytics'
import type { EmailUserVars } from '@fiction/core/plugin-email/endpoint'
import type express from 'express'
import type { FictionPublish } from '../publish'
import type { TableEmailConfig } from '../schema'
import { convertKeyCase } from '@fiction/core'

import { z } from 'zod/v4'
import { t } from '../schema'

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
  fictionPublish: FictionPublish
  request: express.Request
  response: express.Response
}): Promise<void> {
  const { fictionPublish, request, response } = args
  const query = request.query as Record<string, string>
  const params = request.params as { action?: 'init' }
  const body = convertKeyCase(request.body, { mode: 'camel' }) as MailgunWebhookRequestBody

  const fictionAnalytics = fictionPublish.settings.fictionAnalytics
  const isProd = fictionPublish.settings.fictionEnv.isProd.value
  const db = fictionPublish.db()

  try {
    const userVariables = body.eventData.userVariables || {}
    const geolocation = body.eventData.geolocation || {}
    const now = new Date().toISOString()

    if ((isProd && userVariables.env !== 'prod') || (!isProd && userVariables.env === 'prod')) {
      fictionPublish.log.error('ignoring email event', {
        data: {
          isProd,
          env: userVariables.env,
          event: body.eventData.event,
          recipient: body.eventData.recipient,
        },
      })
      response.status(200).send({ status: 'success', message: 'Event ignored due to environment mismatch' }).end()
      return
    }

    fictionPublish.log.info('email tracking webhook', { data: { query, params, body } })

    let mapValue = body.eventData.event as keyof typeof AnalyticsEventMap
    const eventType = body.eventData.event

    // Handle temporary failures as bounces
    if (eventType === 'failed' && body.eventData.severity === 'temporary') {
      mapValue = 'bounced'
    }

    const event = AnalyticsEventMap[mapValue]

    if (!userVariables.fromOrgId) {
      fictionPublish.log.warn(`not tracking email (no fromOrgId)`, { data: { userVariables } })
      response.status(200).send({ status: 'success', message: 'Missing organization ID' }).end()
      return
    }

    // Track the event in analytics
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

    // Update email record in database if we have the required IDs
    if (userVariables.postId && userVariables.contactId) {
      // Prepare update data based on event type
      const updateData: Partial<TableEmailConfig> = {
        updatedAt: now,
        status: eventType as any,
        metadata: {
          ...(body.eventData.deliveryStatus || {}),
          timestamp: body.eventData.timestamp,
          messageId: body.eventData.message?.headers?.messageId,
          url: body.eventData.url,
          geolocation: body.eventData.geolocation,
        },
      }

      // Add specific timestamp fields based on event type
      switch (eventType) {
        case 'delivered':
          updateData.deliveredAt = now
          break
        case 'opened':
          updateData.openedAt = now
          break
        case 'clicked':
          updateData.clickedAt = now
          break
      }

      // Update the email record
      await db(t.email)
        .where({ emailId: userVariables.emailId })
        .update(updateData)
        .catch((error) => {
          fictionPublish.log.error('Failed to update email record', {
            error,
            data: {
              postId: userVariables.postId,
              contactId: userVariables.contactId,
              eventType,
            },
          })
        })
    }
    else {
      fictionPublish.log.warn('Cannot update email record - missing postId or contactId', {
        data: {
          postId: userVariables?.postId,
          contactId: userVariables?.contactId,
        },
      })
    }

    // Respond with success
    response.status(200).send({ status: 'success', event: eventType }).end()
  }
  catch (error) {
    const e = error as Error
    fictionPublish.log.error('tracking endpoint threw an error', { error })
    response.status(400).send({ status: 'error', message: e.message }).end()
  }
}
