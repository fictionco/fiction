import type { IncomingWebhookSendArguments } from '@slack/webhook'
import { IncomingWebhook } from '@slack/webhook'
import type { FictionApp, FictionAppEntry, FictionEmail, FictionEnv, FictionUser, User } from '@fiction/core'
import { EnvVar, FictionPlugin, isActualBrowser, isTest, vars } from '@fiction/core'

declare global {
  interface Window {
    __ls: any
    gtag?: (...args: any[]) => void
  }
}

vars.register(() => [
  new EnvVar({ name: 'SLACK_WEBHOOK_URL', isPublic: false }),
  new EnvVar({ name: 'SENTRY_PUBLIC_DSN', isPublic: true, isOptional: true }),
])

interface FictionMonitorSettings {
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionApp: FictionApp
  fictionEmail: FictionEmail
  monitorEmail?: string
  slackWebhookUrl?: string
  sentryPublicDsn?: string
}

export class FictionMonitor extends FictionPlugin<FictionMonitorSettings> {
  monitorEmail = this.settings.monitorEmail || this.settings.fictionEnv.meta.app?.email
  isTest = isTest()
  slackWebhookUrl = this.settings.slackWebhookUrl
  sentryPublicDsn = this.settings.sentryPublicDsn
  constructor(settings: FictionMonitorSettings) {
    super('FictionMonitor', settings)

    this.settings.fictionUser.events.on('currentUser', async (event) => {
      const { user } = event.detail
      await this.identifyUser(user)
    })

    this.settings.fictionUser.events.on('newUser', async (event) => {
      const { user, params } = event.detail
      if (!this.settings.fictionEnv?.isApp.value) {
        const { cityName, regionName, countryCode } = user.geo || {}
        await this.slackNotify({
          message: `user created: ${user.email}`,
          data: {
            name: user.fullName || 'No Name',
            emailVerified: user.emailVerified ? 'Yes' : 'No',
            location: `${cityName}, ${regionName}, ${countryCode}` || 'No Location',
            ...params,
          },
        })
      }
    })

    this.settings.fictionEnv.hooks.push({
      hook: 'beforeAppMounted',
      callback: async (entry) => {
        await this.installBrowserMonitoring(entry)
      },
    })
  }

  slackNotify = async (args: {
    message: string
    footer?: string
    data?: Record<string, unknown>
    notifyEmail?: string
  }): Promise<void> => {
    if (isActualBrowser())
      throw new Error('slack notify from server')

    const { message, data, notifyEmail = false } = args

    try {
      const SLACK_WEBHOOK_URL = this.slackWebhookUrl
      if (SLACK_WEBHOOK_URL) {
        const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL)

        let attachments: IncomingWebhookSendArguments['attachments'] = []
        if (data) {
          const { footer = 'data' } = args
          const fields = Object.entries(data)
            .filter((key, value) => value)
            .map(([key, value]) => {
              const short = !['message', 'text', 'description'].includes(key)
              return { title: key, value: value as string, short }
            })

          attachments = [{ fields, footer, ts: String(Math.floor(Date.now() / 1000)) }]
        }

        this.log.info(`slack notify: ${message}`)
        await webhook.send({
          text: message,
          attachments,
        })

        if (notifyEmail) {
          let markdownText = ''

          if (attachments && attachments.length > 0) {
            attachments[0].fields?.forEach((field) => {
              markdownText += `* **${field.title}**: ${field.value}\n`
            })
          }
          await this.settings.fictionEmail.sendTransactional({
            to: this.monitorEmail,
            subject: `Notify: ${message}`,
            bodyMarkdown: markdownText,
          })
        }
      }
      else {
        throw new Error('no SLACK_WEBHOOK_URL')
      }
    }
    catch (error) {
      console.error('SLACK ERROR', error)
    }
  }

  async installBrowserMonitoring(entry: FictionAppEntry): Promise<void> {
    const { app, service } = entry

    if (window !== window.top)
      return

    if (service.fictionEnv?.isProd.value && typeof window !== 'undefined') {
      const dsn = this.sentryPublicDsn
      if (!dsn)
        return this.log.error('SENTRY_PUBLIC_DSN not set')
      else
        this.log.info('starting sentry monitoring')

      const Sentry = await import('@sentry/vue')

      Sentry.init({
        app,
        dsn,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ['localhost', /^(https?:\/\/)?(\w+\.)?fiction\.com/],
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      })
    }
  }

  async identifyUser(user?: User) {
    if (user && typeof window !== 'undefined' && '__ls' in window && window === window.top) {
      /**
       * Identify user in LiveSession
       */
      window.__ls('identify', {
        name: user.fullName || 'No Name',
        email: user.email,
      })
    }
  }
}
