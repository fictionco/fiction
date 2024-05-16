import type { Transporter } from 'nodemailer'
import nodeMailer from 'nodemailer'
import nodeMailerHtmlToText from 'nodemailer-html-to-text'
import type { TablePostConfig } from '@fiction/plugins/plugin-posts'
import type { FictionPluginSettings } from '../plugin'
import { Query } from '../query'
import { type EndpointMeta, isActualBrowser, isTest } from '../utils'
import { renderMarkdown } from '../utils/markdown'
import type { EndpointResponse } from '../types'
import type { EmailTransactionalConfig } from './types'
import type { FictionEmail } from '.'

export type EmailQuerySettings = FictionPluginSettings & {
  fictionEmail: FictionEmail
}
export abstract class EmailQuery extends Query<EmailQuerySettings> {
  isInitialized = false
  isTest = isTest()
  client?: Transporter
  smtpHost = this.settings.fictionEmail.settings.smtpHost
  smtpUser = this.settings.fictionEmail.settings.smtpUser
  smtpPassword = this.settings.fictionEmail.settings.smtpPassword
  smtpPort = this.settings.fictionEmail.settings.smtpPort || 587
  constructor(settings: EmailQuerySettings) {
    super(settings)
  }

  getClient() {
    if (isActualBrowser())
      return

    if (this.settings.fictionEnv?.isApp.value)
      return

    if (this.isInitialized) {
      this.log.info('email initialized already')
      return
    }

    this.isInitialized = true

    const options = {
      host: this.smtpHost,
      port: this.smtpPort,
      secure: false, // true for 587, false for other ports
      auth: {
        user: this.smtpUser,
        pass: this.smtpPassword,
      },
    }

    const req = {
      SMTP_HOST: this.smtpHost,
      SMTP_USER: this.smtpUser,
      SMTP_PASSWORD: this.smtpPassword,
    }

    const missing = Object.entries(req)
      .map(([v, value]) => (value ? undefined : v))
      .filter(Boolean)

    if (missing.length > 0) {
      this.log.warn('no email service', {
        data: { vars: `missing: ${missing.join(', ')}` },
      })
    }

    if (!this.isTest && !this.settings.fictionEnv?.isApp.value && missing.length === 0) {
      const emailServiceClient = nodeMailer.createTransport(options)

      // https://github.com/andris9/nodemailer-html-to-text
      emailServiceClient.use('compile', nodeMailerHtmlToText.htmlToText())

      this.client = emailServiceClient
    }
  }

  getFromAddress = (args: { name?: string, email?: string } = {}): string => {
    const app = this.settings.fictionEnv?.meta.app || {}
    const { name = app.name, email = app.email } = args

    return `${name ?? ''} <${email}>`
  }

  async sendEmail(params: EmailTransactionalConfig): Promise<EmailTransactionalConfig> {
    const {
      emailId = 'none',
      subject,
      to,
      text,
      linkText,
      linkUrl,
      textFooter,
    } = params

    let { from } = params

    if (!from)
      from = this.getFromAddress()

    const lines = []

    if (text) {
      const md = await renderMarkdown(text)
      lines.push(`${md}\n`)
    }

    if (linkText && linkUrl)
      lines.push(`<p><a href="${linkUrl}">${linkText}</a></p>`)

    if (textFooter)
      lines.push(`<p>—\n${textFooter}</p>`)

    const contentHtml = lines.join('')
    const html = `<div style="width: 500px;font-size: 1.1em;">${contentHtml}</div>`

    const { convert } = await import('html-to-text')

    const plainText = convert(html)

    const theEmail = {
      ...params,
      emailId,
      from,
      to,
      subject,
      html,
      text: plainText,
    }

    this.log.info('send transactional email', { data: theEmail })

    const emailServiceClient = this.client

    if (emailServiceClient)
      await emailServiceClient.sendMail(theEmail)
    else
      this.log.warn('smtp email is not configured', { data: theEmail })

    return theEmail
  }
}

export type TransactionalEmailParams =
  | {
    _action: 'send'
    template: string
    fields: { to: string }
  }
  | {
    _action: 'unsubscribe'
    fields: { email: string }
  }

export class QueryTransactionalEmail extends EmailQuery {
  async run(params: TransactionalEmailParams, _meta: EndpointMeta): Promise<EndpointResponse> {
    let email: boolean
    const message = ''

    switch (params._action) {
      case 'send':
        email = true
        break
      default:
        return { status: 'error', message: 'Invalid action' }
    }

    return { status: 'success', data: email, message }
  }
}
