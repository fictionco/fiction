import { log, addCallback, applyFilters, setting } from "@factor/tools"

import nodeMailer from "nodemailer"
import nodeMailerHtmlToText from "nodemailer-html-to-text"
import "./setup"

export function hasEmailService() {
  const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST } = process.env

  return !SMTP_USERNAME || !SMTP_PASSWORD || !SMTP_HOST ? false : true
}

function getEmailSMTPService() {
  if (!hasEmailService()) return false

  const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env

  const emailServiceClient = nodeMailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT || 587,
    secure: false, // true for 587, false for other ports
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD
    }
  })

  // https://github.com/andris9/nodemailer-html-to-text
  emailServiceClient.use("compile", nodeMailerHtmlToText.htmlToText())

  return emailServiceClient
}

export async function sendTransactional(_arguments) {
  let {
    _id = "none",
    to,
    from,
    subject,
    title,
    text,
    linkText,
    linkUrl,
    textFooter
  } = applyFilters("transactional-email-arguments", _arguments)

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

  if (emailServiceClient) return await emailServiceClient.sendMail(theEmail)
  else log.warn("Email could not be sent.", theEmail)
}
