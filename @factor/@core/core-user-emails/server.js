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

    async sendVerifyEmail({ email, _id }, { bearer }) {
      const emailVerificationCode = Factor.$randomToken()

      const url = `${Factor.$config.setting("url")}?_action=verify-email&code=${emailVerificationCode}&_id=${_id}`

      await Factor.$user.save({ _id, emailVerificationCode }, { bearer })

      console.log({ to: email, link: url })
      // Factor.$email.send({
      //   to: email,
      //   subject: `Confirm Your Email`,
      //   html: `<p>Hello! Please confirm your email by clicking on the following link: </br> <a href="${url}">Verify "${email}"</a></p>`
      // })

      return emailVerificationCode
    }
  })()
}
