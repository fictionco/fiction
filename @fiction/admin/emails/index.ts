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
  const verifyEmailAction = new EmailAction<{
    transactionArgs: VerifyRequestVars
    transactionResponse: EndpointResponse<User>
    queryVars: Record<string, string>
  }>({
    fictionTransactions,
    actionId: 'verifyEmail',
    template: vue.defineAsyncComponent<vue.Component>(async () => import('./VEmailVerify.vue')), // <vue.Component> avoids circular reference
    emailConfig: async (emailVars) => {
      return {
        emailVars,
        subject: `${emailVars.appName}: Verify Your Email`,
        title: 'Verify Your Email',
        subTitle: 'Click the Link Below',
        bodyMarkdown: `Verify your email using the code: **${emailVars.code}** or click the button below.`,
        to: `${emailVars.email}`,
        buttons: [
          { label: 'Verify Email', href: emailVars.callbackUrl, theme: 'primary' },
        ],
      } satisfies EmailConfigResponse
    },
    serverTransaction: async (args, meta: EndpointMeta) => {
      const { code, email, transaction } = args

      const fictionUser = transaction.settings.fictionTransactions?.settings.fictionUser

      if (!fictionUser)
        throw abort('missing modules', { expose: true })

      const user = await fictionUser.queries.ManageUser.serve({ _action: 'verifyEmail', code, email }, { ...meta, server: true })

      return user
    },
  })

  // Magic Login Email Action
  const magicLoginEmailAction = new EmailAction({
    fictionTransactions,
    template: vue.defineAsyncComponent<vue.Component>(async () => import('./ActionMagicLogin.vue')),
    actionId: 'magicLogin',
    emailConfig: async (emailVars) => {
      return {
        emailVars,
        subject: `${emailVars.appName}: Your Sign-In Link 🪄`,
        title: 'Your Sign-In Link is Ready',
        subTitle: 'Click the link below to log in',
        bodyMarkdown: [
          `[This link](${emailVars.callbackUrl}) will sign you in to ${emailVars.appName}.`,
          `Alternatively, you can login with this code: **${emailVars.code}**.`,
          `If you didn't request this email, don't worry, you can safely ignore it.`,
        ].join(`\n\n`),
        to: `${emailVars.email}`,
        buttons: [
          {
            label: `Sign in to ${emailVars.appName}`,
            href: emailVars.callbackUrl,
            theme: 'primary',
          },
        ],
      } satisfies EmailConfigResponse
    },

  })

  // Magic Login Email Action
  const oneTimeCode = new EmailAction({
    fictionTransactions,
    actionId: 'oneTimeCode',
    emailConfig: async (emailVars) => {
      return {
        emailVars,
        subject: `${emailVars.appName}: Your One-Time-Code 🧑‍💻`,
        title: 'Here is your one-time code',
        subTitle: 'Use this code to verify your email',
        bodyMarkdown: `Use this code to verify your email: **${emailVars.code}**`,
        to: `${emailVars.email}`,
      }
    },

  })

  return { verifyEmailAction, magicLoginEmailAction, oneTimeCode }
}
