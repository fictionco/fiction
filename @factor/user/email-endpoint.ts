import { savePost } from "@factor/post/server"
import { getModel } from "@factor/post/database"
import { addFilter, currentUrl, randomToken } from "@factor/api"
import { sendTransactionalEmail } from "@factor/email/server"
import { Document, Schema, SchemaDefinition, HookNextFunction } from "mongoose"
import { EndpointMeta } from "@factor/endpoint/types"
import { getUserModel } from "@factor/user/server"
import { addEndpoint } from "@factor/api/endpoints"
import { FactorUser } from "./types"
import {
  VerificationResult,
  SendVerifyEmail,
  VerifyAndResetPassword,
  VerifyEmail,
  EmailResult
} from "./email-types"

type FactorUserEmailVerify = FactorUser & {
  emailVerificationCode?: string;
  passwordResetCode?: string;
}

interface UserEmailConfig {
  to: string;
  subject: string;
  text: string;
  linkText: string;
  action: string;
  _id: string;
  code: string;
}
/**
 * Sends user account email
 * @param args - standard email text
 */
export const sendEmail = async (args: UserEmailConfig): Promise<void> => {
  const { to, subject, action, _id, code, text, linkText } = args
  const linkUrl = `${currentUrl()}?_action=${action}&code=${code}&_id=${_id}`

  await sendTransactionalEmail({
    to,
    subject,
    text,
    linkText,
    linkUrl
  })

  return
}

/**
 * Verifies a user email with code sent to that email
 * @param _id - user id
 * @param code - the code sent via email
 * @param bearer - user making the request
 */
export const verifyEmail = async (
  { _id, code }: VerifyEmail,
  { bearer }: EndpointMeta
): Promise<VerificationResult | never> => {
  if (!bearer) {
    throw new Error(`You must be logged in to verify your account`)
  }
  if (bearer._id != _id) {
    throw new Error(`Email verification user doesn't match the logged in account.`)
  }

  const user = await getUserModel<FactorUserEmailVerify>().findOne(
    { _id },
    "+emailVerificationCode"
  )

  let result = EmailResult.failure

  if (!user) {
    throw new Error("Can't verify email. Can't find user ID.")
  } else if (user.emailVerificationCode == code) {
    user.emailVerified = true
    await user.save()
    result = EmailResult.success
  } else if (!user.emailVerified) {
    throw new Error("Email verification code does not match.")
  }

  user.emailVerificationCode = undefined
  return { result, user }
}
/**
 * Sends a verification email to the current user
 * @param code - allow other functionality to create the code and disable saving user as user might not exist yet
 * @param email - the user email
 * @param _id - the user _id
 */
export const sendVerifyEmail = async (
  { email, _id, code }: SendVerifyEmail,
  { bearer }: EndpointMeta
): Promise<EmailResult> => {
  const emailVerificationCode = code ? code : randomToken()

  if (!code) {
    await savePost({ postType: "user", data: { _id, emailVerificationCode } }, { bearer })
  }

  await sendEmail({
    to: email,
    subject: "Confirm Your Email",
    text: "Hello! Please confirm your email by clicking on the following link:",
    linkText: "Verify Email",
    action: "verify-email",
    _id,
    code: emailVerificationCode
  })

  return EmailResult.success
}
/**
 * Verifies password with a password reset code sent via email
 * @param _id - user id
 * @param code - code sent to email
 * @param password - the new password
 */
export const verifyAndResetPassword = async ({
  _id,
  code,
  password
}: VerifyAndResetPassword): Promise<EmailResult> => {
  const user = await getModel<FactorUserEmailVerify>("post").findOne(
    { _id },
    "+passwordResetCode"
  )

  if (!user) {
    throw new Error(`Could not find user.`)
  }

  if (user.passwordResetCode && user.passwordResetCode == code) {
    user.password = password
    user.passwordResetCode = undefined
    await user.save()
    return EmailResult.success
  } else {
    throw new Error("The password reset code is incorrect.")
  }
}
/**
 * Sends a password reset code to a an email.
 * @param email - the email address for the account
 */
export const sendPasswordResetEmail = async ({
  email
}: {
  email: string;
}): Promise<EmailResult> => {
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

  return EmailResult.success
}

export const setup = (): void => {
  /**
   * Adds methods to the userEmails endpoint
   */
  addEndpoint({
    id: "userEmails",
    handler: {
      sendPasswordResetEmail,
      verifyAndResetPassword,
      sendVerifyEmail,
      verifyEmail,
      sendEmail
    }
  })

  /**
   * Handle verification after a user changes their email
   */
  addFilter({
    key: "userEmails",
    hook: "user-schema-hooks",
    callback: (userSchema: Schema) => {
      userSchema.pre("save", async function(
        this: FactorUserEmailVerify & Document,
        next: HookNextFunction
      ): Promise<void> {
        if (!this.isModified("email") || this.$locals.noVerify) return

        const { email, _id } = this
        this.emailVerified = false
        this.emailVerificationCode = randomToken()

        sendVerifyEmail(
          { _id, email, code: this.emailVerificationCode },
          { bearer: this }
        )

        next()
      })
    }
  })

  /**
   * Add email verification properties to a user post schema
   */
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
