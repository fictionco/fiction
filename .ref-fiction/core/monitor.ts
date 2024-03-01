import type { FactorAppEntry, FactorEnv, User } from '@factor/api'
import { IncomingWebhook } from '@slack/webhook'
import mailchimp from '@mailchimp/mailchimp_marketing'
import { EnvVar, vars } from '@factor/api/plugin-env'

vars.register(() => [
  new EnvVar({
    name: 'SLACK_WEBHOOK_URL',
    isPublic: false,
  }),
  new EnvVar({
    name: 'SEND_IN_BLUE_API_KEY',
    isPublic: false,
  }),
  new EnvVar({
    name: 'MAILCHIMP_API_KEY',
    isPublic: false,
  }),
])

export async function trackEvent(_args: {
  eventType: 'conversion' | 'track'
  conversionType?: 'signup' | 'trial' | 'contact'
  trackType?: 'watch' | 'click' | 'submit'
  label: string
  category?: string
}) {
  //
}

export async function installBrowserMonitoring(entry: FactorAppEntry): Promise<void> {
  const { app, router, service } = entry
  if (service.factorEnv?.isProd.value && typeof window !== 'undefined') {
    const Sentry = await import('@sentry/vue')
    const { BrowserTracing } = await import('@sentry/tracing')
    Sentry.init({
      app,
      dsn: 'https://f8dd002065884ca79471c73d00bf7163@o4504680560787456.ingest.sentry.io/4504680704245760',
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracePropagationTargets: [
            'localhost',
            'fiction.com',
            'supereon.ai',
            'kaption.co',
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

export async function slackNotify(args: {
  message: string
  factorEnv: FactorEnv
}): Promise<void> {
  const { message, factorEnv } = args

  try {
    const SLACK_WEBHOOK_URL = args.factorEnv.var('SLACK_WEBHOOK_URL')
    if (SLACK_WEBHOOK_URL) {
      const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL)

      factorEnv.log.info(`slack notify: ${message}`)
      await webhook.send({
        text: message,
      })
    }
  }
  catch (error) {
    console.error('SLACK ERROR', error)
  }
}

export async function onNewUser(args: {
  user: User
  factorEnv: FactorEnv
}): Promise<void> {
  const { user, factorEnv } = args
  const { email } = user

  if (!email)
    return

  if (factorEnv.isProd.value && !factorEnv?.isApp.value) {
    await slackNotify({
      message: `new user: ${email}`,
      factorEnv: args.factorEnv,
    })

    // try {
    //   const SEND_IN_BLUE_API_KEY = args.factorEnv.var("SEND_IN_BLUE_API_KEY")

    //   if (SEND_IN_BLUE_API_KEY) {
    //     const apiInstance = new SibApiV3Sdk.ContactsApi()

    //     apiInstance.setApiKey(
    //       SibApiV3Sdk.ContactsApiApiKeys.apiKey,
    //       SEND_IN_BLUE_API_KEY,
    //     )

    //     const createContact = new SibApiV3Sdk.CreateContact()

    //     createContact.email = email
    //     createContact.listIds = [2]
    //     factorEnv.log.info(`send in blue new contact: ${email}`)
    //     await apiInstance.createContact(createContact)
    //   } else {
    //     factorEnv.log.warn(`SEND_IN_BLUE_API_KEY: no API key`)
    //   }
    // } catch (error) {
    //   console.error("SEND_IN_BLUE ERROR", error)
    // }

    try {
      const MAILCHIMP_API_KEY = args.factorEnv.var('MAILCHIMP_API_KEY')

      if (MAILCHIMP_API_KEY) {
        mailchimp.setConfig({
          apiKey: MAILCHIMP_API_KEY,
          server: 'us10',
        })

        // https://us10.admin.mailchimp.com/lists/settings/defaults?id=904612
        const listId = '91e7ab2299'

        const response = await mailchimp.lists.addListMember(listId, {
          email_address: email,
          status: 'subscribed',
        })

        factorEnv.log.info(`Mailchimp: added contact as an audience member. `, {
          data: response,
        })
      }
      else {
        factorEnv.log.warn(`MAILCHIMP_API_KEY: no API key`)
      }
    }
    catch (error) {
      console.error('MAILCHIMP ERROR', error)
    }
  }
}
