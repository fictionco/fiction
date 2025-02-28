import type { EndpointMeta, EndpointResponse, User } from '@fiction/core'
import type { EmailConfigResponse } from '@fiction/plugin-transactions'
import type { FictionAdmin } from '..'
import { abort, vue } from '@fiction/core'
import { EmailAction } from '@fiction/plugin-transactions'

export type VerifyRequestVars = {
  code: string
  email: string
}

export function getEmails(args: { fictionAdmin: FictionAdmin }) {
  const { fictionAdmin } = args
  const fictionTransactions = fictionAdmin.settings.fictionTransactions
  const authBasePath = '/app/auth'

  // Verification email action
  const verifyEmailAction = new EmailAction<{
    transactionArgs: VerifyRequestVars
    transactionResponse: EndpointResponse<User>
    queryVars: Record<string, string>
  }>({
    fictionTransactions,
    actionId: 'verifyEmail',
    template: vue.defineAsyncComponent<vue.Component>(async () => import('./VEmailVerify.vue')),
    emailConfig: async (emailVars) => {
      const verifyUrl = `${emailVars.originUrl}${authBasePath}/verify-email?code=${emailVars.code}&email=${emailVars.email}`

      return {
        emailVars,
        subject: `${emailVars.appName}: Verify Your Email`,
        title: 'Verify Your Email',
        subTitle: 'Confirm your account to get started',
        contentMarkdown: [
          `Thank you for creating an account with ${emailVars.appName}.`,
          `Your verification code is: **${emailVars.code}**`,
          `You can either enter this code or click the button below.`,
        ].join('\n\n'),
        to: `${emailVars.email}`,
        buttons: [
          { label: 'Verify Email', href: verifyUrl, theme: 'primary' },
        ],
      } satisfies EmailConfigResponse
    },
    serverTransaction: async (args, meta: EndpointMeta) => {
      const { code, email, transaction } = args

      const fictionUser = transaction.settings.fictionTransactions?.settings.fictionUser

      if (!fictionUser)
        throw abort('Required services missing', { expose: true })

      const user = await fictionUser.queries.ManageUser.serve(
        { _action: 'verifyEmail', code, email },
        { ...meta, server: true },
      )

      return user
    },
  })

  // Magic Login Email Action
  const magicLoginEmailAction = new EmailAction({
    fictionTransactions,
    template: vue.defineAsyncComponent<vue.Component>(async () => import('./ActionMagicLogin.vue')),
    actionId: 'magicLogin',
    emailConfig: async (emailVars) => {
      const signInUrl = `${emailVars.originUrl}${authBasePath}/magic-link-sent?code=${emailVars.code}&email=${emailVars.email}`

      return {
        emailVars,
        subject: `${emailVars.appName}: Your Sign-In Link`,
        title: 'Sign in to your account',
        subTitle: 'No password needed',
        contentMarkdown: [
          `Click the button below to sign in to your ${emailVars.appName} account.`,
          `Or use this code to sign in: **${emailVars.code}**`,
          `This link will expire in 24 hours.`,
        ].join('\n\n'),
        to: `${emailVars.email}`,
        buttons: [
          {
            label: 'Sign in now',
            href: signInUrl,
            theme: 'primary',
          },
        ],
        emailType: 'alert',
      } satisfies EmailConfigResponse
    },
  })

  // One-time code email
  const oneTimeCode = new EmailAction({
    fictionTransactions,
    actionId: 'oneTimeCode',
    emailConfig: async (emailVars) => {
      return {
        emailVars,
        subject: `${emailVars.appName}: Your verification code`,
        title: 'Your verification code',
        subTitle: 'Use this code to verify your account',
        bodyMarkdown: [
          `Your verification code is: **${emailVars.code}**`,
          `This code will expire in 30 minutes.`,
          `If you didn't request this code, please ignore this email.`,
        ].join('\n\n'),
        to: `${emailVars.email}`,
      }
    },
  })

  // Password reset email
  const passwordReset = new EmailAction({
    fictionTransactions,
    actionId: 'passwordReset',
    emailConfig: async (emailVars) => {
      const resetUrl = `${emailVars.originUrl}${authBasePath}/set-new-password?code=${emailVars.code}&email=${emailVars.email}`

      return {
        emailVars,
        subject: `${emailVars.appName}: Reset your password`,
        title: 'Reset your password',
        subTitle: 'Create a new password for your account',
        contentMarkdown: [
          `We received a request to reset your password.`,
          `Click the button below to create a new password.`,
          `This link will expire in 24 hours.`,
          `If you didn't request this, you can safely ignore this email.`,
        ].join('\n\n'),
        to: `${emailVars.email}`,
        buttons: [
          {
            label: 'Reset Password',
            href: resetUrl,
            theme: 'primary',
          },
        ],
        emailType: 'alert',
      }
    },
  })

  return { verifyEmailAction, magicLoginEmailAction, oneTimeCode, passwordReset }
}
