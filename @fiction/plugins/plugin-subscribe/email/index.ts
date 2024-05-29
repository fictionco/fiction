import { type EndpointMeta, type EndpointResponse, type User, abort, vue } from '@fiction/core'
import { verifyCode } from '@fiction/core/plugin-user/utils'
import type { SendArgsRequest } from '@fiction/plugin-email-actions'
import { EmailAction } from '@fiction/plugin-email-actions'
import type { FictionSubscribe } from '..'

export type VerifyRequestVars = {
  code: string
  email: string
}

export function getEmails(args: { fictionSubscribe: FictionSubscribe }) {
  const { fictionSubscribe } = args
  const fictionEmailActions = fictionSubscribe.settings.fictionEmailActions
  const actionSubscribe = new EmailAction<{
    transactionArgs: VerifyRequestVars
    transactionResponse: EndpointResponse<User>
    sendArgs: SendArgsRequest<{ queryVars: { appName: string } }>
    sendResponse: EndpointResponse<{ isSent: boolean }>
  }>({
    fictionEmailActions,
    actionId: 'verifyEmail',
    template: vue.defineAsyncComponent<vue.Component>(() => import('./ActionSubscribe.vue')), // <vue.Component> avoids circular reference
    emailConfig: (vars) => {
      return {
        subject: `${vars.appName}: Confirm Subscription`,
        heading: 'Verify Your Email',
        subHeading: 'Click the Link Below',
        bodyMarkdown: `Confirm your subscription to ${vars.appName} by clicking the button below.`,
        to: `${vars.email}`,
        actions: [
          { name: 'Confirm Subscription', href: vars.callbackUrl, btn: 'primary' },
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

  return { actionSubscribe }
}
