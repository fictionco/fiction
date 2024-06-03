import { type EndpointMeta, type EndpointResponse, vue } from '@fiction/core'
import { EmailAction } from '@fiction/plugin-email-actions'
import type { FictionSubscribe, TableSubscribeConfig } from '..'

export function getEmails(args: { fictionSubscribe: FictionSubscribe }) {
  const { fictionSubscribe } = args
  const fictionEmailActions = fictionSubscribe.settings.fictionEmailActions
  const fictionUser = fictionSubscribe.settings.fictionUser

  const subscribe = new EmailAction<{
    transactionArgs: { orgId: string, userId: string }
    transactionResponse: EndpointResponse<TableSubscribeConfig>
    queryVars: { orgId: string, orgName: string, orgEmail: string }
  }>({
    fictionEmailActions,
    actionId: 'subscribe',
    template: vue.defineAsyncComponent<vue.Component>(() => import('./ActionSubscribe.vue')), // <vue.Component> avoids circular reference
    emailConfig: async (emailVars) => {
      const { orgId, orgName, orgEmail } = emailVars.queryVars

      const r = await fictionUser.queries.ManageOrganization.serve({ _action: 'retrieve', where: { orgId } }, { server: true, caller: 'subscribe' })

      const fromName = orgName || r.data?.orgName || emailVars.fullName
      const fromEmail = orgEmail || r.data?.orgEmail || emailVars.email
      return {
        emailVars,
        subject: `Confirm Your Subscription ✔`,
        heading: 'Confirm Your Subscription',
        subHeading: 'Click the Link Below',
        bodyMarkdown: `Confirm your subscription to ${fromName} by clicking the button below.`,
        to: `${emailVars.email}`,
        from: `${fromName} <${fromEmail}>`,
        actions: [
          { name: 'Confirm Subscription', href: emailVars.callbackUrl, btn: 'primary' },
        ],
      }
    },
    serverTransaction: async (action, args, meta: EndpointMeta) => {
      const { orgId, userId } = args

      const r = await fictionSubscribe.queries.ManageSubscription.serve({ _action: 'create', fields: { orgId, userId } }, { ...meta, server: true })

      const sub = r.data?.[0]

      return { status: 'success', data: sub, message: 'You\'re now subscribed!' }
    },
  })

  return { subscribe }
}
