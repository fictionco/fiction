/* server-only-file */
import { createRequire } from "module"
import { _stop, renderMarkdown, logger } from "@factor/api"
import { EmailTransactionalConfig } from "@factor/types"
import nodeMailer, { Transporter } from "nodemailer"
import nodeMailerHtmlToText from "nodemailer-html-to-text"

const require = createRequire(import.meta.url)

const getFromAddress = (): string => {
  const name = process.env.FACTOR_APP_NAME ?? ""
  const email = process.env.FACTOR_APP_EMAIL ?? ""

  if (!name || !email) {
    throw _stop({
      message:
        "node email misconfigured: (FACTOR_APP_NAME or FACTOR_APP_EMAIL)",
    })
  }

  return `${name} <${email}>`
}
export const hasEmailService = (): boolean => {
  const { SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD } = process.env

  return !SMTP_HOST || !SMTP_PASSWORD || !SMTP_USERNAME ? false : true
}
/**
 * Gets the email sending service
 */
const getEmailSMTPService = (): Transporter | void => {
  if (!hasEmailService()) {
    return
  }

  const {
    SMTP_USERNAME = "",
    SMTP_PASSWORD = "",
    SMTP_HOST = "",
    SMTP_PORT = 587,
  } = process.env

  const options = {
    host: SMTP_HOST,
    port: SMTP_PORT as number,
    secure: false, // true for 587, false for other ports
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  }

  const emailServiceClient = nodeMailer.createTransport(options)

  // https://github.com/andris9/nodemailer-html-to-text
  emailServiceClient.use("compile", nodeMailerHtmlToText.htmlToText())

  return emailServiceClient
}
/**
 * Send a standard transactional email
 */
export const sendEmail = async (
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
    from = getFromAddress()
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

  logger.log({
    level: "info",
    description: "send transactional email",
    context: "email",
    data: theEmail,
  })

  const emailServiceClient = getEmailSMTPService()

  if (emailServiceClient) {
    await emailServiceClient.sendMail(theEmail)
  } else {
    logger.log({
      level: "warn",
      description: "smtp email is not configured",
      context: "email",
      data: theEmail,
    })
  }

  return theEmail
}
