import type { MediaObject } from '@fiction/platform'
import type { FictionMedia } from '../plugin-media'
import type EmailStandard from './templates/EmailStandard.vue'
import { FictionPlugin, type FictionPluginSettings } from '../plugin.js'
import { EnvVar, vars } from '../plugin-env/index.js'
import { type EndpointMeta, isTest, safeDirname } from '../utils/index.js'
import { toMarkdown } from '../utils/markdown.js'
import { QueryTransactionalEmail } from './endpoint.js'

export type TransactionalEmailConfig = InstanceType<typeof EmailStandard>['$props'] & { bodyHtml?: string, bodyText?: string }

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

  async renderEmailTemplate(fields: TransactionalEmailConfig) {
    const emailRenderer = await this.getRenderer()

    if (fields.bodyHtml && !fields.bodyMarkdown) {
      fields.bodyMarkdown = toMarkdown(fields.bodyHtml, { keep: ['figure', 'figcaption', 'sup', 'sub', 'ins', 'del', 'mark', 'abbr', 'dfn', 'var', 'samp', 'kbd', 'q', 'cite', 'time', 'address', 'dl', 'dt', 'dd'] })
    }

    const template = await emailRenderer.render('EmailStandard.vue', { props: fields })

    const bodyHtml = template.html
    const bodyText = template.text

    return { ...fields, bodyHtml, bodyText }
  }

  async renderAndSendEmail(fields: TransactionalEmailConfig, meta: EndpointMeta) {
    fields = await this.renderEmailTemplate(fields)

    return this.sendEmail(fields, meta)
  }

  async sendEmail(fields: TransactionalEmailConfig, meta: EndpointMeta) {
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
