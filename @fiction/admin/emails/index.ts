import { type EndpointMeta, type EndpointResponse, type User, abort, vue } from '@fiction/core'
import { verifyCode } from '@fiction/core/plugin-user/utils'
import type { SendArgsRequest } from '@fiction/plugin-email-actions'
import { EmailAction } from '@fiction/plugin-email-actions'
import type { FictionAdmin } from '..'

export type VerifyRequestVars = {
  code: string
  email: string
}

export function getEmails(args: { fictionAdmin: FictionAdmin }) {
  const { fictionAdmin } = args
  const fictionEmailActions = fictionAdmin.settings.fictionEmailActions
  const appName = fictionAdmin.fictionEnv.meta.app?.name
  const verifyEmailAction = new EmailAction<{ transactionArgs: VerifyRequestVars, transactionResponse: EndpointResponse<User>, send: object }>({
    fictionEmailActions,
    actionId: 'verify-email',
    template: vue.defineAsyncComponent<vue.Component>(() => import('./VEmailVerify.vue')), // <vue.Component> avoids circular reference
    emailConfig: (vars) => {
      return {
        subject: `${vars.appName}: Verify Your Email`,
        heading: 'Verify Your Email',
        subHeading: 'Click the Link Below',
        bodyMarkdown: `Verify your email using the code: **${vars.code}** or click the button below.`,
        to: `${vars.email}`,
        actions: [
          { name: 'Verify Email', href: vars.callbackUrl, btn: 'primary' },
        ],
      }
    },
    serverAction: async (action, args, meta: EndpointMeta) => {
      const { code, email } = args

      const fictionUser = action.settings.fictionEmailActions?.settings.fictionUser

      if (!fictionUser)
        throw abort('missing modules', { expose: true })

      const user = await fictionUser.queries.ManageUser.serve({ _action: 'verifyEmail', code, email }, { ...meta, server: true })

      return user
    },
  })

  // Magic Login Email Action
  const magicLoginEmailAction = new EmailAction({
    fictionEmailActions,
    template: vue.defineAsyncComponent<vue.Component>(() => import('./ActionMagicLogin.vue')),
    actionId: 'magic-login',
    emailConfig: (vars) => {
      return {
        subject: `${vars.appName} → Magic Sign In Link 🪄`,
        heading: 'Your magic link is ready',
        subHeading: 'Click the link below to log in',
        bodyMarkdown: `The link below will sign you in to ${vars.appName}.\n\nIf you didn't request this email, there's nothing to worry about, you can safely ignore it.`,
        to: `${vars.email}`,
        actions: [
          { name: 'Log In', href: vars.callbackUrl, btn: 'primary' },
        ],
      }
    },

  })

  return { verifyEmailAction, magicLoginEmailAction }
}
