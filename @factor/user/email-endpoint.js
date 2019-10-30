import { getModel, savePost } from "@factor/post/server"
import { randomToken, addFilter, addCallback, setting } from "@factor/tools"
import { sendTransactional } from "@factor/email"

addCallback("endpoints", { id: "user-emails", handler: "@factor/user/email-endpoint" })

addFilter("user-schema-hooks", Schema => {
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

addFilter("user-schema", _ => {
  _.emailVerificationCode = { type: String, select: false }
  _.passwordResetCode = { type: String, select: false }

  return _
})

export async function verifyEmail({ _id, code }, { bearer }) {
  if (!bearer || bearer._id != _id) {
    throw new Error(`Email verification user doesn't match the logged in account.`)
  }

  const user = await getModel("user").findOne({ _id }, "+emailVerificationCode")

  if (user.emailVerificationCode == code) {
    user.emailVerified = true
    user.emailVerificationCode = undefined
    await user.save()
    return "success"
  } else if (!user.emailVerified) {
    throw new Error("Verification code does not match.")
  }
}

export async function sendVerifyEmail({ email, _id, user }, { bearer }) {
  const emailVerificationCode = randomToken()

  await savePost({ data: { _id, emailVerificationCode, postType: "user" } }, { bearer })

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

export async function verifyAndResetPassword({ _id, code, password }) {
  const user = await getModel("post").findOne({ _id }, "+passwordResetCode")

  if (!user) {
    throw new Error(`Could not find user.`)
  }

  if (user.passwordResetCode && user.passwordResetCode == code) {
    user.password = password
    user.passwordResetCode = undefined
    await user.save()
    return "success"
  } else {
    throw new Error("Could not reset your password.")
  }
}

export async function sendPasswordResetEmail({ email }) {
  const passwordResetCode = randomToken()

  const user = await getModel("user").findOneAndUpdate({ email }, { passwordResetCode })

  if (!user || !user._id) {
    throw new Error("Could not find an user with that email.")
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

export async function sendEmail(args) {
  const { to, subject, action, _id, code, text, linkText } = args
  const linkUrl = `${setting("currentUrl")}?_action=${action}&code=${code}&_id=${_id}`

  return await sendTransactional({
    to,
    subject,
    text,
    linkText,
    linkUrl
  })
}
