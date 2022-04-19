import { createRequire } from "module"
import nodeMailer, { Transporter } from "nodemailer"
import nodeMailerHtmlToText from "nodemailer-html-to-text"
import { FactorPlugin } from "../config/plugin"
import type { UserConfig } from "../config"
import { renderMarkdown } from "../markdown"
import { EmailTransactionalConfig } from "./types"

const require = createRequire(import.meta.url)

type FactorEmailSettings = {
  smtpHost: string
  smtpUsername: string
  smtpPassword: string
  smtpPort?: number
  isTest?: boolean
  appName: string
  appEmail: string
}

export class FactorEmail extends FactorPlugin<FactorEmailSettings> {
  isTest: boolean = false
  client?: Transporter
  smtpHost: string
  smtpUsername: string
  smtpPassword: string
  smtpPort: number
  appName: string
  appEmail: string
  constructor(settings: FactorEmailSettings) {
    super(settings)

    this.smtpHost = settings.smtpHost
    this.smtpPassword = settings.smtpPassword
    this.smtpPort = settings.smtpPort || 587
    this.smtpUsername = settings.smtpUsername
    this.appEmail = settings.appEmail
    this.appName = settings.appName

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
    if (
      !this.smtpPassword ||
      !this.smtpUsername ||
      !this.smtpHost ||
      !this.appEmail ||
      !this.appName
    ) {
      this.log.error("email settings are missing", { data: options })
      return
    }

    const emailServiceClient = nodeMailer.createTransport(options)

    // https://github.com/andris9/nodemailer-html-to-text
    emailServiceClient.use("compile", nodeMailerHtmlToText.htmlToText())

    this.client = emailServiceClient
  }

  async init(): Promise<void> {}

  public async setup(): Promise<UserConfig> {
    return { name: this.constructor.name }
  }

  getFromAddress = (): string => {
    return `${this.settings.appName ?? ""} <${this.settings.appEmail}>`
  }

  sendEmail = async (
    _arguments: EmailTransactionalConfig,
  ): Promise<EmailTransactionalConfig> => {
    const {
      emailId = "none",
      subject,
      to,
      text,
      linkText,
      linkUrl,
      textFooter,
    } = _arguments

    let { from } = _arguments

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

    const htmlToText = require("html-to-text") as {
      fromString: (s: string) => string
    }
    const plainText = htmlToText.fromString(html) as string

    const theEmail = {
      ..._arguments,
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
