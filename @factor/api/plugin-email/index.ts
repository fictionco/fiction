import nodeMailer, { Transporter } from "nodemailer"
import nodeMailerHtmlToText from "nodemailer-html-to-text"
import { FactorEnv, vars, EnvVar } from "../plugin-env"
import { FactorPlugin } from "../plugin"
import { renderMarkdown } from "../utils/markdown"
import * as types from "./types"

const verify: EnvVar<string>["verify"] = ({ factorEnv, value }) => {
  return !value && factorEnv.isProd() ? false : true
}

vars.register(() => [
  new EnvVar({
    name: "SMTP_HOST",
    val: process.env.SMTP_HOST,
    verify,
  }),
  new EnvVar({
    name: "SMTP_USER",
    val: process.env.SMTP_USER,
    verify,
  }),
  new EnvVar({
    name: "SMTP_PASSWORD",
    val: process.env.SMTP_PASSWORD,
    verify,
  }),
])

type FactorEmailSettings = {
  smtpPort?: number
  factorEnv: FactorEnv
  smtpHost?: string
  smtpUser?: string
  smtpPassword?: string
  appUrl: string
}

export class FactorEmail extends FactorPlugin<FactorEmailSettings> {
  readonly types = types
  readonly client?: Transporter
  smtpHost = this.settings.smtpHost
  smtpUser = this.settings.smtpUser
  smtpPassword = this.settings.smtpPassword
  smtpPort = this.settings.smtpPort || 587

  appUrl = this.settings.appUrl
  factorEnv = this.settings.factorEnv
  appName = this.factorEnv.appName
  appEmail = this.factorEnv.appEmail
  constructor(settings: FactorEmailSettings) {
    super(settings)

    if (this.utils.isActualBrowser()) return

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
      this.log.warn("email is log only (missing creds)", {
        data: { vars: missing.join(", ") },
      })
    }

    if (!this.utils.isTest() && missing.length == 0) {
      const emailServiceClient = nodeMailer.createTransport(options)

      // https://github.com/andris9/nodemailer-html-to-text
      emailServiceClient.use("compile", nodeMailerHtmlToText.htmlToText())

      this.client = emailServiceClient
    }
  }

  public async setup() {}

  getFromAddress = (): string => {
    return `${this.appName ?? ""} <${this.appEmail}>`
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
      lines.push(`<p><a href="${linkUrl}">${linkText}</a></p>`)
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
