import { type EndpointMeta, type EndpointResponse, gravatarUrl, vue } from '@fiction/core'
import { EmailAction } from '@fiction/plugin-transactions'
import type { FictionSubscribe, TableSubscribeConfig } from '..'

export function getEmails(args: { fictionSubscribe: FictionSubscribe }) {
  const { fictionSubscribe } = args
  const fictionTransactions = fictionSubscribe.settings.fictionTransactions
  const fictionUser = fictionSubscribe.settings.fictionUser

  const subscribe = new EmailAction<{
    transactionArgs: { orgId: string, userId: string, code?: string }
    transactionResponse: EndpointResponse<TableSubscribeConfig>
    queryVars: { orgId: string, orgName?: string, orgEmail?: string }
  }>({
    fictionTransactions,
    actionId: 'subscribe',
    template: vue.defineAsyncComponent<vue.Component>(() => import('./TransactionSubscribe.vue')), // <vue.Component> avoids circular reference
    emailConfig: async (emailVars) => {
      const { orgId, orgName, orgEmail } = emailVars.queryVars

      const fictionTransactions = fictionSubscribe.settings.fictionTransactions
      const r = await fictionUser.queries.ManageOrganization.serve({ _action: 'retrieve', where: { orgId } }, { server: true, caller: 'subscribe' })

      const fromName = orgName || r.data?.orgName || emailVars.fullName
      const fromEmail = orgEmail || r.data?.orgEmail || emailVars.email
      let avatar = r.data?.avatar

      if (!avatar) {
        const g = await gravatarUrl(fromEmail, { size: 200 })

        if (!g.isDefaultImage) {
          avatar = { url: g.url }
        }
        else {
          const url = fictionUser.userImages().org
          avatar = await fictionTransactions.settings.fictionMedia?.relativeMedia({ url })
        }
      }
      emailVars.masks = { ...emailVars.masks, avatarUrl: avatar?.url }

      return {
        emailVars,
        subject: `Confirm Your Subscription 👍`,
        heading: 'Confirm Your Subscription',
        subHeading: 'Just click the link below',
        bodyMarkdown: `Please click the button below to confirm you'd like to receive emails from **${fromName}**.`,
        to: `${emailVars.email}`,
        from: `${fromName} <${fromEmail}>`,
        actions: [
          { name: 'Confirm Subscription', href: emailVars.callbackUrl, btn: 'primary' },
        ],
        mediaSuper: { name: fromName, media: avatar },
      }
    },
    serverTransaction: async (args, meta: EndpointMeta) => {
      const { orgId, userId, code } = args

      if (!code) {
        throw new Error('Missing code')
      }

      await fictionUser.queries.ManageUser.serve({ _action: 'verifyEmail', code, email: userId }, { ...meta, server: true })

      const r = await fictionSubscribe.queries.ManageSubscription.serve({ _action: 'create', publisherId: orgId, subscriberId: userId }, { ...meta, server: true })

      const sub = r.data?.[0]

      return { status: 'success', data: sub, message: 'You\'re now subscribed!' }
    },
  })

  return { subscribe }
}
