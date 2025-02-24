import type { FictionMedia } from '../plugin-media'
import type { FictionPluginSettings } from '../plugin.js'
import type { MediaObject } from '../schemas/schemas'
import type { EndpointMeta } from '../utils/index.js'
import type { EmailSendConfig } from './util'
import { EnvVar, vars } from '../plugin-env/index.js'
import { FictionPlugin } from '../plugin.js'
import { isTest, safeDirname, vue } from '../utils/index.js'
import { proseToMarkdown, toMarkdown } from '../utils/markdown.js'
import { QueryTransactionalEmail } from './endpoint.js'

export * from './util'

const verify: EnvVar<string>['verify'] = ({ fictionEnv, value }) => {
  return !(!value && fictionEnv.isProd.value && !fictionEnv.isApp.value)
}

vars.register(() => [
  new EnvVar({ name: 'SMTP_HOST', verify }),
  new EnvVar({ name: 'SMTP_USER', verify }),
  new EnvVar({ name: 'SMTP_PASSWORD', verify }),
])

type FictionEmailSettings = {
  smtpPort?: number
  smtpHost?: string
  smtpUser?: string
  smtpPassword?: string
  sendingDomain?: string
} & FictionPluginSettings

export class FictionEmail extends FictionPlugin<FictionEmailSettings> {
  isTest = isTest()
  queries = {
    TransactionEmail: new QueryTransactionalEmail({ fictionEmail: this, ...this.settings }),
  }

  constructor(settings: FictionEmailSettings) {
    super('FictionEmail', { root: safeDirname(import.meta.url), ...settings })
  }

  // allow initialization of SMTP connection
  async init() {
    if (!this.fictionEnv?.isApp.value)
      this.queries.TransactionEmail.getClient()
  }

  async getRenderer() {
    const { config } = await import('@vue-email/compiler')
    return config(`${safeDirname(import.meta.url)}/templates`, {
      verbose: false,
      options: {
        baseUrl: 'https://www.fiction.com/', // unused
      },
    })
  }

  async compileTemplateToHtml(args: { emailConfig: EmailSendConfig }): Promise<string> {
    const { emailConfig } = args
    const { renderToString } = await import('vue/server-renderer')
    const EmailV2 = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailV2.vue'))

    if (emailConfig.bodyHtml && !emailConfig.bodyMarkdown) {
      emailConfig.bodyMarkdown = await proseToMarkdown(emailConfig.bodyHtml)
    }

    const app = vue.createSSRApp(EmailV2, emailConfig)
    return await renderToString(app)
  }

  async renderAndSendEmail(emailConfig: EmailSendConfig, meta: EndpointMeta) {
    const html = await this.compileTemplateToHtml({ emailConfig })
    emailConfig.bodyHtml = html

    return this.sendEmail(emailConfig, meta)
  }

  async sendEmail(fields: EmailSendConfig, meta: EndpointMeta) {
    return this.queries.TransactionEmail.serve({ _action: 'send', fields }, { server: true, ...meta })
  }

  async emailImages({ fictionMedia }: { fictionMedia: FictionMedia }) {
    const images = {
      icon: 'img/fiction-icon.png',
      footer: 'img/fiction-email-footer.png',
    }
    const results = await Promise.all(
      Object.entries(images).map(async ([key, path]) => [
        key,
        await fictionMedia.relativeMedia({ url: new URL(path, import.meta.url).href }),
      ]),
    )

    return Object.fromEntries(results) as { [K in keyof typeof images]: MediaObject }
  }
}
