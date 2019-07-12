module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.callback("endpoints", { id: "user-emails", handler: this })

      // Factor.$filters.add("create-new-user", user => {
      //   const { email, _id } = user
      //   this.sendVerifyEmail({ email, _id, user }, { bearer: user })
      // })

      Factor.$filters.add("user-schema-hooks", Schema => {
        const _this = this
        // EMAIL
        Schema.post("save", async function(doc, next) {
          const user = this
          if (!user.isModified("email")) return next()

          const { email, _id } = user
          user.emailVerified = false
          return await _this.sendVerifyEmail({ _id, email }, { bearer: user })
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

      const user = await Factor.$db.model("user").findOne({ _id }, "+emailVerificationCode")

      if (user.emailVerificationCode == code) {
        user.emailVerified = true
        user.emailVerificationCode = undefined
        await user.save()
        return "success"
      } else if (!user.emailVerified) {
        Factor.$error.throw(400, "Verification code does not match.")
      }
    }

    async sendVerifyEmail({ email, _id, user }, { bearer }) {
      const emailVerificationCode = Factor.$randomToken()

      await Factor.$user.save({ _id, emailVerificationCode, user }, { bearer })

      await this.sendEmail({
        to: email,
        subject: "Confirm Your Email",
        text: "Hello! Please confirm your email by clicking on the following link:",
        linkText: "Verify Email",
        action: "verify-email",
        _id,
        code: emailVerificationCode
      })

      return "success"
    }

    async verifyAndResetPassword({ _id, code, password }) {
      const user = await Factor.$user.model().findOne({ _id }, "+passwordResetCode")

      if (!user) {
        Factor.$error.throw(400, `Couldn't find user.`)
      }

      if (user.passwordResetCode && user.passwordResetCode == code) {
        user.password = password
        user.passwordResetCode = undefined
        await user.save()
        return "success"
      } else {
        Factor.$error.throw(400, "Could not reset your password.")
      }
    }

    async sendPasswordResetEmail({ email }) {
      const passwordResetCode = Factor.$randomToken()

      const user = await Factor.$user.model().findOneAndUpdate({ email }, { passwordResetCode })

      if (!user || !user._id) {
        Factor.$error.throw(400, "Could not find an user with that email.")
      }

      await this.sendEmail({
        to: email,
        subject: "Password Reset",
        text:
          "Hello! We've recieved a request to reset the password associated with this account. To do so, just follow this link:",
        linkText: "Reset Password",
        action: "reset-password",
        _id: user._id,
        code: passwordResetCode
      })

      return "success"
    }

    async sendEmail(args) {
      const { to, subject, action, _id, code, text, linkText } = args
      const linkUrl = `${Factor.$config.setting("url")}?_action=${action}&code=${code}&_id=${_id}`

      return await Factor.$email.sendTransactional({
        to,
        subject,
        text,
        linkText,
        linkUrl
      })
    }
  })()
}
