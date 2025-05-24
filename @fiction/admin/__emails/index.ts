import type { EndpointResponse, User } from '@fiction/core'
import type { EmailConfigResponse } from '@fiction/plugin-transactions'
import type { FictionAdmin } from '..'
import { vue } from '@fiction/core'
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
          `Your verification code is: **${emailVars.code}**`,
          `You can either enter this code or click the button below.`,
        ].join('\n\n'),
        to: `${emailVars.email}`,
        buttons: [
          { label: 'Verify Email', href: verifyUrl, theme: 'primary' },
        ],
        emailType: 'alert',
      } satisfies EmailConfigResponse
    },
  })

  // Magic Login Email Action
  const magicLoginEmailAction = new EmailAction({
    fictionTransactions,
    template: vue.defineAsyncComponent<vue.Component>(async () => import('./ActionMagicLogin.vue')),
    actionId: 'magicLogin',
    emailConfig: async (emailVars) => {
      const signInUrl = `${emailVars.originUrl}${authBasePath}/verify-email?code=${emailVars.code}&email=${emailVars.email}`

      const queryVars = emailVars.queryVars
      return {
        emailVars,
        subject: `${emailVars.appName}: Your code is ${emailVars.code}`,
        title: 'Verification Code',
        subTitle: 'Use this code to verify your account',
        contentMarkdown: [
          `Verify your account with this code:`,
          `## ${emailVars.code}`,
        ].join('\n\n'),
        to: `${emailVars.email}`,
        footerLinks: [
          {
            label: 'Visit Fiction.com',
            href: 'https://www.fiction.com',
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
        emailType: 'alert',
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
