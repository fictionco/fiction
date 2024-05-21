import { type EndpointMeta, type EndpointResponse, type User, abort, vue } from '@fiction/core'
import { verifyCode } from '@fiction/core/plugin-user/utils'
import { EmailAction } from '@fiction/plugin-email-actions'
import type { FictionAdmin } from '..'

export type VerifyRequestVars = {
  code: string
  email: string
}

export function getEmails(args: { fictionAdmin: FictionAdmin }) {
  const { fictionAdmin } = args
  const fictionEmailActions = fictionAdmin.settings.fictionEmailActions
  const verifyEmailAction = new EmailAction({
    fictionEmailActions,
    actionId: 'verify-email',
    template: vue.defineAsyncComponent<vue.Component>(() => import('./EmailVerify.vue')), // <vue.Component> avoids circular reference
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
    serverAction: async (action, args: VerifyRequestVars, meta: EndpointMeta): Promise<EndpointResponse<User>> => {
      const { code, email } = args

      const fictionUser = action.settings.fictionEmailActions?.settings.fictionUser

      if (!fictionUser)
        throw abort('missing modules', { expose: true })

      const user = await fictionUser.queries.ManageUser.serve({ _action: 'verifyEmail', code, email }, { ...meta, server: true })

      return { status: 'success', data: user }
    },
  })
  return { verifyEmailAction }
}
