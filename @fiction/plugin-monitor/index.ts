import type { IncomingWebhookSendArguments } from '@slack/webhook'
import { IncomingWebhook } from '@slack/webhook'
import type {
  FactorApp,
  FactorAppEntry,
  FactorEmail,
  FactorEnv,
  FactorUser,
  User,
} from '@fiction/core'
import {
  EnvVar,
  FactorPlugin,
  vars,
} from '@fiction/core'
import mailchimp from '@mailchimp/mailchimp_marketing'

declare global {
  interface Window {
    __ls: any
    gtag?: (...args: any[]) => void
  }
}

vars.register(() => [
  new EnvVar({
    name: 'SLACK_WEBHOOK_URL',
    isPublic: false,
  }),
  new EnvVar({
    name: 'MAILCHIMP_API_KEY',
    isPublic: false,
  }),
  new EnvVar({
    name: 'SENTRY_PUBLIC_DSN',
    isPublic: true,
  }),
])

interface FactorMonitorSettings {
  factorEnv: FactorEnv
  factorUser: FactorUser
  factorApp: FactorApp
  factorEmail: FactorEmail
  monitorEmail?: string
  slackWebhookUrl?: string
  sentryPublicDsn?: string
  mailchimpApiKey?: string
  mailchimpServer?: string
  mailchimpListId?: string
}

export class FactorMonitor extends FactorPlugin<FactorMonitorSettings> {
  factorEnv = this.settings.factorEnv
  factorUser = this.settings.factorUser
  factorApp = this.settings.factorApp
  factorEmail = this.settings.factorEmail
  monitorEmail = this.settings.monitorEmail || this.settings.factorApp.appEmail
  isTest = this.utils.isTest()
  slackWebhookUrl = this.settings.slackWebhookUrl
  sentryPublicDsn = this.settings.sentryPublicDsn
  mailchimpApiKey = this.settings.mailchimpApiKey
  mailchimpServer = this.settings.mailchimpServer
  mailchimpListId = this.settings.mailchimpListId
  constructor(settings: FactorMonitorSettings) {
    super('FactorMonitor', settings)

    this.factorUser.addHook({
      hook: 'requestCurrentUser',
      callback: async (user) => {
        await this.identifyUser(user)
      },
    })

    this.factorUser.addHook({
      hook: 'createPassword',
      callback: async (user, { params }) => {
        const { isNewUser } = params
        if (!this.factorEnv?.isApp.value) {
          const { cityName, regionName, countryCode } = user.geo || {}
          await this.slackNotify({
            message: `(PageLines) password set: ${user.email}`,
            data: {
              name: user.fullName || 'No Name',
              emailVerified: user.emailVerified ? 'Yes' : 'No',
              isNewUser: isNewUser ? 'Yes' : 'No',
              location:
                `${cityName}, ${regionName}, ${countryCode}` || 'No Location',
            },
          })
        }
      },
    })
  }

  slackNotify = async (args: {
    message: string
    footer?: string
    data?: Record<string, unknown>
    notifyEmail?: string
  }): Promise<void> => {
    if (this.utils.isActualBrowser())
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

          attachments = [
            {
              fields,
              footer,
              ts: String(Math.floor(Date.now() / 1000)),
            },
          ]
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
          await this.factorEmail.sendEmail({
            to: this.monitorEmail,
            subject: `Notify: ${message}`,
            text: markdownText,
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

  async installBrowserMonitoring(entry: FactorAppEntry): Promise<void> {
    const { app, router, service } = entry
    const dsn = this.sentryPublicDsn
    if (
      dsn
      && service.factorEnv?.isProd.value
      && typeof window !== 'undefined'
    ) {
      const Sentry = await import('@sentry/vue')
      const { BrowserTracing } = await import('@sentry/tracing')
      Sentry.init({
        app,
        dsn,
        integrations: [
          new BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracePropagationTargets: [
              'localhost',
              'fiction.com',
              'supereon.ai',
              'kaption.co',
              'pagelines.com',
              /^\//,
            ],
          }),
          new Sentry.Replay(),
        ],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1,
        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,
        // If the entire session is not sampled, use the below sample rate to sample
        // sessions when an error occurs.
        replaysOnErrorSampleRate: 1,
      })
    }
  }

  async addToMailchimp(args: {
    email: string
    tags?: string[]
  }): Promise<void> {
    const { email, tags = [] } = args
    try {
      const apiKey = this.mailchimpApiKey
      const listId = this.mailchimpListId
      const server = this.mailchimpServer

      if (!apiKey || !listId || !server)
        return

      if (apiKey) {
        mailchimp.setConfig({ apiKey, server })

        // https://us10.admin.mailchimp.com/lists/settings/defaults?id=904612

        const response = await mailchimp.lists.addListMember(listId, {
          email_address: email,
          tags,
          status: 'subscribed',
        })

        this.log.info(`Mailchimp: added contact as an audience member. `, {
          data: response,
        })
      }
      else {
        this.log.warn(`MAILCHIMP_API_KEY: no API key`)
      }
    }
    catch (error) {
      console.error('MAILCHIMP ERROR', error)
    }
  }

  async identifyUser(user?: User) {
    if (user && typeof window !== 'undefined' && '__ls' in window) {
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
