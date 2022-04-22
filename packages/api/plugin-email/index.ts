import nodeMailer, { Transporter } from "nodemailer"
import nodeMailerHtmlToText from "nodemailer-html-to-text"
import { FactorPlugin } from "../config/plugin"
import type { UserConfig } from "../config"
import { renderMarkdown } from "../utils/markdown"
import * as types from "./types"

type FactorEmailSettings = {
  smtpPort?: number
  appName: string
  appEmail: string
  appUrl: string
} & (
  | {
      isTest: true
      smtpHost?: string
      smtpUsername?: string
      smtpPassword?: string
    }
  | {
      isTest?: false
      smtpHost: string
      smtpUsername: string
      smtpPassword: string
    }
)

export class FactorEmail extends FactorPlugin<FactorEmailSettings> {
  readonly types = types
  readonly client?: Transporter
  smtpHost?: string
  smtpUsername?: string
  smtpPassword?: string
  smtpPort: number
  readonly appName: string
  readonly appEmail: string
  readonly appUrl: string

  constructor(settings: FactorEmailSettings) {
    super(settings)

    this.isTest = settings.isTest || false

    this.smtpHost = settings.smtpHost
    this.smtpPassword = settings.smtpPassword
    this.smtpUsername = settings.smtpUsername

    this.smtpPort = settings.smtpPort || 587
    this.appEmail = settings.appEmail
    this.appName = settings.appName
    this.appUrl = settings.appUrl

    if (this.utils.isBrowser()) return

    const options = {
      host: this.smtpHost,
      port: this.smtpPort,
      secure: false, // true for 587, false for other ports
      auth: {
        user: this.smtpUsername,
        pass: this.smtpPassword,
      },
    }

    const valid = this.validateRequiredFields({
      plugin: this,
      fields: ["appEmail", "appName", "appUrl"],
      fieldsLive: ["smtpPassword", "smtpUsername", "smtpHost"],
    })

    if (valid && !this.isTest) {
      const emailServiceClient = nodeMailer.createTransport(options)

      // https://github.com/andris9/nodemailer-html-to-text
      emailServiceClient.use("compile", nodeMailerHtmlToText.htmlToText())

      this.client = emailServiceClient
    }
  }

  async init(): Promise<void> {}

  public async setup(): Promise<UserConfig> {
    return { name: this.constructor.name }
  }

  getFromAddress = (): string => {
    return `${this.settings.appName ?? ""} <${this.settings.appEmail}>`
  }

  sendEmail = async (
    params: types.EmailTransactionalConfig,
  ): Promise<types.EmailTransactionalConfig> => {
    const {
      emailId = "none",
      subject,
      to,
      text,
      linkText,
      linkUrl,
      textFooter,
    } = params

    let { from } = params

    if (!from) {
      from = this.getFromAddress()
    }

    const lines = []

    if (text) {
      const md = renderMarkdown(text)
      lines.push(`${md}\n`)
    }

    if (linkText && linkUrl) {
      lines.push(`<p><a href="${linkUrl}"  >${linkText}</a></p>`)
    }

    if (textFooter) lines.push(`<p>—\n${textFooter}</p>`)

    const contentHtml = lines.join("")
    const html = `<div style="width: 500px;font-size: 1.1em;">${contentHtml}</div>`

    const { default: htmlToText } = (await import("html-to-text")) as {
      default: { fromString: (s: string) => string }
    }
    const plainText = htmlToText.fromString(html) as string

    const theEmail = {
      ...params,
      emailId,
      from,
      to,
      subject,
      html,
      text: plainText,
    }

    this.log.info("send transactional email", { data: theEmail })

    const emailServiceClient = this.client

    if (emailServiceClient) {
      await emailServiceClient.sendMail(theEmail)
    } else {
      this.log.warn("smtp email is not configured", { data: theEmail })
    }

    return theEmail
  }
}
