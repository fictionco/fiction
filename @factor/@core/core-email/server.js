module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "email", handler: this })
      this.client = this.init()
    }

    init() {
      const {
        SMTP_USERNAME,
        SMTP_PASSWORD,
        SMTP_HOST,
        SMTP_PORT
      } = Factor.$config.settings()

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

    async sendTransactional(args) {
      let { to, from, subject, title, text, linkText, linkUrl, textFooter } = args

      if (!from) {
        from = Factor.$config.setting("app.email")
      }

      subject = `${subject} - ${Factor.$config.setting("app.name")}`

      const lines = []

      if (title) {
        lines.push(`<b style="font-size: 1.1em">${title}</b>`)
      }

      if (text) {
        lines.push(text)
      }

      if (linkText && linkUrl) {
        lines.push(`<a href="${linkUrl}">${linkText}</a>`)
      }

      if (textFooter) {
        lines.push(textFooter)
      }

      const theEmail = {
        from,
        to,
        subject,
        html: lines.map(_ => `<p>${_}</p>`).join("")
      }

      let info
      if (this.client) {
        console.log("Send Email", to)
        info = await this.client.sendMail(theEmail)
      } else {
        Factor.$log.info("Email could not be sent.", theEmail)
      }

      return info
    }
  })()
}
