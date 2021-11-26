import { _stop, applyFilters, renderMarkdown } from "@factor/api"
import { logger } from "@factor/server-utils"
import { EmailTransactionalConfig } from "@factor/types"
import nodeMailer, { Transporter } from "nodemailer"
import nodeMailerHtmlToText from "nodemailer-html-to-text"
import path from "path"

import { createRequire } from "module"
const require = createRequire(import.meta.url)

const pkg = require(path.join(process.cwd(), "package.json"))

const getFromAddress = (): string => {
  const {
    factor: { name, email },
  } = pkg

  if (!name || !email) {
    throw _stop({
      message:
        "can't send email. name or email are missing in app package.json",
    })
  }

  return `${name} <${email}>`
}
export const hasEmailService = (): boolean => {
  const { SMTP_HOST } = process.env

  return !SMTP_HOST ? false : true
}
/**
 * Gets the email sending service
 */
const getEmailSMTPService = (): Transporter | void => {
  if (!hasEmailService()) return

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
): Promise<void> => {
  _arguments = applyFilters("transactionalEmailConfig", _arguments)

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

  const plainText = require("html-to-text").fromString(html)

  const theEmail = applyFilters("transactionalEmail", {
    ..._arguments,
    emailId,
    from,
    to,
    subject,
    html,
    text: plainText,
  })

  logger({
    level: "info",
    description: "send transactional email",
    context: "email",
    data: theEmail,
  })

  const emailServiceClient = getEmailSMTPService()

  if (emailServiceClient) {
    const r = await emailServiceClient.sendMail(theEmail)

    return r
  } else {
    logger({
      level: "warn",
      description: "smtp email is not configured",
      context: "email",
      data: theEmail,
    })
  }
}
