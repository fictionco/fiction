import { type EndpointMeta, type EndpointResponse, type User, abort, vue } from '@fiction/core'
import { verifyCode } from '@fiction/core/plugin-user/utils'
import type { SendArgsRequest } from '@fiction/plugin-email-actions'
import { EmailAction } from '@fiction/plugin-email-actions'
import type { FictionSubscribe, TableSubscribeConfig } from '..'

export type VerifyRequestVars = {
  code: string
  email: string
}

export function getEmails(args: { fictionSubscribe: FictionSubscribe }) {
  const { fictionSubscribe } = args
  const fictionEmailActions = fictionSubscribe.settings.fictionEmailActions
  const fictionUser = fictionSubscribe.settings.fictionUser
  const actionSubscribe = new EmailAction<{
    transactionArgs: { orgId: string, userId: string }
    transactionResponse: EndpointResponse<TableSubscribeConfig>
    queryVars: { orgId: string }
  }>({
    fictionEmailActions,
    actionId: 'verifyEmail',
    template: vue.defineAsyncComponent<vue.Component>(() => import('./ActionSubscribe.vue')), // <vue.Component> avoids circular reference
    emailConfig: async (vars) => {
      const { orgId } = vars.queryVars
      const r = await fictionUser.queries.ManageOrganization.serve({ _action: 'retrieve', where: { orgId } }, { server: true })

      const fromName = r.data?.orgName || vars.fullName
      const fromEmail = r.data?.orgEmail
      return {
        subject: `Confirm Your Subscription ✔`,
        heading: 'Confirm Your Subscription',
        subHeading: 'Click the Link Below',
        bodyMarkdown: `Confirm your subscription to ${fromName} by clicking the button below.`,
        to: `${vars.email}`,
        from: `${fromName} <${fromEmail}>`,
        actions: [
          { name: 'Confirm Subscription', href: vars.callbackUrl, btn: 'primary' },
        ],
      }
    },
    serverAction: async (action, args, meta: EndpointMeta) => {
      const { orgId, userId } = args

      const r = await fictionSubscribe.queries.ManageSubscription.serve({ _action: 'create', fields: { orgId, userId } }, { ...meta, server: true })

      const sub = r.data?.[0]

      return { status: 'success', data: sub }
    },
  })

  return { actionSubscribe }
}
