import Factor from "@factor/core"
import log from "@factor/logger"
import { addCallback, applyFilters, setting } from "@factor/tools"
export default () => {
  return new (class {
    constructor() {
      addCallback("endpoints", { id: "email", handler: this })
      this.client = this.init()
    }

    init() {
      const { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } = process.env

      if (!SMTP_USERNAME || !SMTP_PASSWORD || !SMTP_HOST) {
        require("./setup").default(Factor)
        this.hasEmail = false
        this.transporter = false
        return false
      }

      this.hasEmail = true

      this.transporter = require("nodemailer").createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT || 587,
        secure: false, // true for 587, false for other ports
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD
        }
      })

      // https://github.com/andris9/nodemailer-html-to-text
      var htmlToText = require("nodemailer-html-to-text").htmlToText
      this.transporter.use("compile", htmlToText())

      return this.transporter
    }

    async sendTransactional(_arguments) {
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

      let info
      if (this.client) {
        info = await this.client.sendMail(theEmail)
      } else {
        log.info("Email could not be sent.", theEmail)
      }

      return info
    }
  })()
}
