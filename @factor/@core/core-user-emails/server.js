module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "user-emails", handler: this })

      Factor.$filters.add("create-new-user", user => {
        this.sendVerifyEmail({ email, _id: user._id }, { bearer: user })
      })

      Factor.$filters.add("user-schema-hooks", Schema => {
        const _this = this
        // EMAIL
        Schema.pre("save", async function(next) {
          const user = this
          if (!user.isModified("email")) return next()

          const { email, _id } = user
          user.emailVerified = false
          await _this.sendVerifyEmail({ _id, email }, { bearer: user })
        })
      })

      Factor.$filters.add("user-schema", _ => {
        _.emailVerificationCode = { type: String, select: false }
        _.passwordResetCode = { type: String, select: false }

        return _
      })
    }

    async verifyEmail({ _id, code }, { bearer }) {
      if (!bearer || bearer._id != _id) {
        Factor.$error.throw(400, `Email verification user doesn't match the logged in account.`)
      }

      const user = await Factor.$db.model("User").findOne({ _id }, "+emailVerificationCode")

      if (user.emailVerificationCode == code) {
        user.emailVerified = true
        user.emailVerificationCode = undefined
        await user.save()
        return "success"
      } else if (!user.emailVerified) {
        Factor.$error.throw(400, "Verification code does not match.")
      }
    }

    async sendPasswordResetEmail({ email }) {
      const passwordResetCode = Factor.$randomToken()

      const user = await Factor.$db.model("User").findOneAndUpdate({ email }, { passwordResetCode })

      if (!user || !user._id) {
        console.log("user", user)
        Factor.$error.throw(400, "Could not find an user with that email.")
      }

      await this.sendEmail({
        to: email,
        subject: "Password Reset",
        text: "Hello! Someone has requested to reset their password. To do so, just follow this link:",
        linkText: "Reset Password",
        action: "reset-password",
        _id: user._id,
        code: passwordResetCode
      })
    }

    async sendVerifyEmail({ email, _id }, { bearer }) {
      const emailVerificationCode = Factor.$randomToken()

      await Factor.$user.save({ _id, emailVerificationCode }, { bearer })

      await this.sendEmail({
        to: email,
        subject: "Confirm Your Email",
        text: "Hello! Please confirm your email by clicking on the following link:",
        linkText: "Verify Email",
        action: "verify-email",
        _id,
        code: emailVerificationCode
      })

      return emailVerificationCode
    }

    async sendEmail(args) {
      const { to, subject, action, _id, code, text, linkText } = args
      const url = `${Factor.$config.setting("url")}?_action=${action}&code=${code}&_id=${_id}`
      console.log("Email", url, args)

      // Factor.$email.send({
      //   to: email,
      //   subject: `Confirm Your Email`,
      //   html: `<p>Hello! Please confirm your email by clicking on the following link: </br> <a href="${url}">Verify "${email}"</a></p>`
      // })
    }
  })()
}
