import { log, applyFilters, setting } from "@factor/api"
import nodeMailer, { Transporter } from "nodemailer"
import nodeMailerHtmlToText from "nodemailer-html-to-text"
import { addEndpoint } from "@factor/api/endpoints"
import "./setup"
import { EmailTransactionalConfig } from "./util"

export const hasEmailService = (): boolean => {
  const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST } = process.env

  return !SMTP_USERNAME || !SMTP_PASSWORD || !SMTP_HOST ? false : true
}

const getEmailSMTPService = (): Transporter | void => {
  if (!hasEmailService()) return

  const {
    SMTP_USERNAME = "",
    SMTP_PASSWORD = "",
    SMTP_HOST = "",
    SMTP_PORT = 587
  } = process.env

  const options = {
    host: SMTP_HOST,
    port: SMTP_PORT as number,
    secure: false, // true for 587, false for other ports
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD
    }
  }

  const emailServiceClient = nodeMailer.createTransport(options)

  // https://github.com/andris9/nodemailer-html-to-text
  emailServiceClient.use("compile", nodeMailerHtmlToText.htmlToText())

  return emailServiceClient
}

export const sendTransactional = async (
  _arguments: EmailTransactionalConfig
): Promise<void> => {
  _arguments = applyFilters("transactional-email-arguments", _arguments)

  const { _id = "none", to, title, text, linkText, linkUrl, textFooter } = _arguments

  let { from, subject } = _arguments

  if (!from) from = setting("app.email")

  subject = `${subject} - ${setting("app.name")}`

  const lines = []

  if (title) lines.push(`<b style="font-size: 1.1em">${title}</b>`)

  if (text) lines.push(text)

  if (linkText && linkUrl) lines.push(`<a href="${linkUrl}">${linkText}</a>`)

  if (textFooter) lines.push(textFooter)

  const html = lines.map(_ => `<p>${_}</p>`).join("")
  const plainText = require("html-to-text").fromString(html)

  const theEmail = applyFilters("transactional-email", {
    _id,
    from,
    to,
    subject,
    html,
    text: plainText
  })

  const emailServiceClient = getEmailSMTPService()

  if (emailServiceClient) {
    return await emailServiceClient.sendMail(theEmail)
  } else {
    log.warn("Email could not be sent (SMTP service not setup)", theEmail)
  }
}

export const setup = async (): Promise<void> => {
  addEndpoint({
    id: "email",
    handler: {
      sendTransactional
    }
  })
}

setup()
