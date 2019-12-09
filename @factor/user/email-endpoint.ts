import { savePost } from "@factor/post/server"
import { getModel } from "@factor/post/database"
import { addFilter, currentUrl, randomToken } from "@factor/api"
import { sendTransactional } from "@factor/email/server"
import { Document, HookNextFunction, Schema, SchemaDefinition } from "mongoose"
import { EndpointMeta } from "@factor/endpoint/types"
import { getUserModel } from "@factor/user/server"
import { addEndpoint } from "@factor/api/endpoints"
import { FactorUser } from "./types"
import { SendVerifyEmail, VerifyAndResetPassword, VerifyEmail } from "./email-request"
interface UserEmailConfig {
  to: string;
  subject: string;
  text: string;
  linkText: string;
  action: string;
  _id: string;
  code: string;
}

export const sendEmail = async (args: UserEmailConfig): Promise<void> => {
  const { to, subject, action, _id, code, text, linkText } = args
  const linkUrl = `${currentUrl()}?_action=${action}&code=${code}&_id=${_id}`

  await sendTransactional({
    to,
    subject,
    text,
    linkText,
    linkUrl
  })

  return
}

export const verifyEmail = async (
  { _id, code }: VerifyEmail,
  { bearer }: EndpointMeta
): Promise<void> => {
  if (!bearer || bearer._id != _id) {
    throw new Error(`Email verification user doesn't match the logged in account.`)
  }

  const user = await getUserModel().findOne({ _id }, "+emailVerificationCode")

  if (!user) {
    throw new Error("Can't find user ID.")
  } else if (user.emailVerificationCode == code) {
    user.emailVerified = true
    user.emailVerificationCode = undefined
    await user.save()
    return
  } else if (!user.emailVerified) {
    throw new Error("Verification code does not match.")
  }
}

export const sendVerifyEmail = async (
  { email, _id }: SendVerifyEmail,
  { bearer }: EndpointMeta
): Promise<void> => {
  const emailVerificationCode = randomToken()

  await savePost({ postType: "user", data: { _id, emailVerificationCode } }, { bearer })

  await sendEmail({
    to: email,
    subject: "Confirm Your Email",
    text: "Hello! Please confirm your email by clicking on the following link:",
    linkText: "Verify Email",
    action: "verify-email",
    _id,
    code: emailVerificationCode
  })

  return
}

export const verifyAndResetPassword = async ({
  _id,
  code,
  password
}: VerifyAndResetPassword): Promise<void> => {
  const user = await getModel("post").findOne({ _id }, "+passwordResetCode")

  if (!user) {
    throw new Error(`Could not find user.`)
  }

  if (user.passwordResetCode && user.passwordResetCode == code) {
    user.password = password
    user.passwordResetCode = undefined
    await user.save()
    return
  } else {
    throw new Error("Could not reset your password.")
  }
}

export const sendPasswordResetEmail = async ({
  email
}: {
  email: string;
}): Promise<void> => {
  const passwordResetCode = randomToken()

  const user = await getUserModel().findOneAndUpdate({ email }, { passwordResetCode })

  if (!user || !user._id) {
    throw new Error("Could not find an user with that email.")
  }

  await sendEmail({
    to: email,
    subject: "Password Reset",
    text:
      "Hello! We've received a request to reset the password associated with this account. To do so, just follow this link:",
    linkText: "Reset Password",
    action: "reset-password",
    _id: user._id,
    code: passwordResetCode
  })

  return
}

export const setup = (): void => {
  addEndpoint({
    id: "user-emails",
    handler: {
      sendPasswordResetEmail,
      verifyAndResetPassword,
      sendVerifyEmail,
      verifyEmail,
      sendEmail
    }
  })

  addFilter({
    key: "userEmails",
    hook: "user-schema-hooks",
    callback: (s: Schema) => {
      // EMAIL
      s.post("save", async function(
        this: FactorUser & Document,
        doc,
        next: HookNextFunction
      ): Promise<void> {
        if (!this.isModified("email")) return next()

        const { email, _id } = this
        this.emailVerified = false
        await sendVerifyEmail({ _id, email }, { bearer: this })

        return
      })
    }
  })

  addFilter({
    key: "emailVerify",
    hook: "user-schema",
    callback: (_: SchemaDefinition): SchemaDefinition => {
      _.emailVerificationCode = { type: String, select: false }
      _.passwordResetCode = { type: String, select: false }

      return _
    }
  })
}

setup()
