import type { Transporter } from 'nodemailer'
import nodeMailer from 'nodemailer'
import nodeMailerHtmlToText from 'nodemailer-html-to-text'
import type { DefineConfigFunctions } from '@vue-email/compiler/index'
import type { FictionPluginSettings } from '../plugin'
import { Query } from '../query'
import { safeDirname } from '../utils'
import { type EndpointMeta, isActualBrowser } from '../utils/index.js'
import { toMarkdown } from '../utils/markdown.js'
import type { EndpointResponse } from '../types'
import { getFromAddress } from '../utils/email'
import type { FictionEmail, TransactionalEmailConfig } from '.'

export type EmailQuerySettings = FictionPluginSettings & {
  fictionEmail: FictionEmail
}
export abstract class EmailQuery extends Query<EmailQuerySettings> {
  client?: Transporter
  smtpHost = this.settings.fictionEmail.settings.smtpHost
  smtpUser = this.settings.fictionEmail.settings.smtpUser
  smtpPassword = this.settings.fictionEmail.settings.smtpPassword
  smtpPort = this.settings.fictionEmail.settings.smtpPort || 587
  constructor(settings: EmailQuerySettings) {
    super(settings)
    this.settings.fictionEnv.serverOnlyImports['@vue-email/compiler'] = true
  }

  getClient() {
    if (isActualBrowser() || this.settings.fictionEnv?.isApp.value)
      return this.log.warn('email client is not available in the browser')

    if (this.settings.fictionEmail.isTest)
      return this.log.info('email client is not available in test mode')

    if (this.client)
      return this.client

    const options = {
      host: this.smtpHost,
      port: this.smtpPort,
      secure: false, // true for 587, false for other ports
      auth: { user: this.smtpUser, pass: this.smtpPassword },
    }

    const req = { SMTP_HOST: this.smtpHost, SMTP_USER: this.smtpUser, SMTP_PASSWORD: this.smtpPassword }

    const missing = Object.entries(req).map(([v, value]) => (value ? undefined : v)).filter(Boolean)

    if (missing.length > 0) {
      this.log.error('EMAIL: missing SMTP credentials', { data: { vars: `missing: ${missing.join(', ')}` } })
    }

    else {
      const emailServiceClient = nodeMailer.createTransport(options)

      // https://github.com/andris9/nodemailer-html-to-text
      emailServiceClient.use('compile', nodeMailerHtmlToText.htmlToText())

      this.client = emailServiceClient
    }

    return this.client
  }
}

export type TransactionalEmailParams =
  | {
    _action: 'send'
    fields: TransactionalEmailConfig
  }
  | {
    _action: 'unsubscribe'
    fields: { email: string }
  }

export type EmailResponse = {
  html: string
  text: string
  isSent: boolean
} & TransactionalEmailConfig

export class QueryTransactionalEmail extends EmailQuery {
  async getRenderer() {
    const { config } = await import('@vue-email/compiler')
    return config(`${safeDirname(import.meta.url)}/templates`, {
      verbose: false,
      options: {
        baseUrl: 'https://www.whatever.com/',
      },
    })
  }

  async run(params: TransactionalEmailParams, _meta: EndpointMeta): Promise<EndpointResponse<EmailResponse>> {
    let emailResponse: EmailResponse | undefined
    const message = ''
    const { fields, _action } = params

    switch (_action) {
      case 'send':
        emailResponse = await this.sendTransactional(fields)
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return { status: 'success', data: emailResponse, message }
  }

  async sendTransactional(fields: TransactionalEmailConfig): Promise<EmailResponse> {
    const emailRenderer = await this.getRenderer()

    if (fields.bodyHtml && !fields.bodyMarkdown) {
      fields.bodyMarkdown = toMarkdown(fields.bodyHtml, { keep: [
        'figure',
        'figcaption',
        'sup',
        'sub',
        'ins',
        'del',
        'mark',
        'abbr',
        'dfn',
        'var',
        'samp',
        'kbd',
        'q',
        'cite',
        'time',
        'address',
        'dl',
        'dt',
        'dd',
      ] })
    }

    const template = await emailRenderer.render('EmailStandard.vue', { props: fields })

    const client = this.getClient()

    const { html, text } = template

    const { from = getFromAddress({ fictionEnv: this.settings.fictionEnv }), to, subject } = fields

    const theEmail: nodeMailer.SendMailOptions = { from, to, subject, html, text }

    let isSent = false
    if (client) {
      isSent = true
      await this.client?.sendMail(theEmail)
    }

    return { ...template, ...fields, isSent }
  }
}
