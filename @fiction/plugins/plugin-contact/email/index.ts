import type { EndpointMeta, EndpointResponse } from '@fiction/core/index.js'
import type { EmailConfigResponse } from '@fiction/plugin-transactions/index.js'
import type { Contact, FictionContact } from '../index.js'
import { getOrgAvatar, vue } from '@fiction/core/index.js'
import { EmailAction } from '@fiction/plugin-transactions/index.js'

export function getEmails(args: { fictionContact: FictionContact }) {
  const { fictionContact } = args
  const fictionTransactions = fictionContact.settings.fictionTransactions
  const fictionUser = fictionContact.settings.fictionUser

  const subscribe = new EmailAction<{
    transactionArgs: { userId: string, code?: string, where: { orgId: string } }
    transactionResponse: EndpointResponse<Contact>
    queryVars: { orgId: string, orgName?: string, orgEmail?: string }
  }>({
    fictionTransactions,
    actionId: 'subscribe',
    template: vue.defineAsyncComponent<vue.Component>(async () => import('./TransactionSubscribe.vue')), // <vue.Component> avoids circular reference
    emailConfig: async (emailVars) => {
      const { orgId } = emailVars.queryVars

      const r = await fictionUser.queries.ManageOrganization.serve({ _action: 'retrieve', where: { orgId } }, { server: true, caller: 'subscribe' })

      const org = r.data

      if (!org) {
        throw new Error('Organization not found')
      }

      const senderName = org.senderName || org.orgName
      const senderEmail = org.senderEmail || org.orgEmail
      const avatar = getOrgAvatar(org, { size: 200 })

      emailVars.masks = { ...emailVars.masks, avatarUrl: avatar?.url }

      return {
        emailVars,
        subject: `Confirm Your Subscription 👍`,
        title: 'Confirm Your Subscription',
        subTitle: 'Just click the link below',
        bodyMarkdown: `Please click the button below to confirm you'd like to receive emails from **${senderName}**.`,
        to: emailVars.email,
        senderName,
        senderEmail,
        emailType: 'alert',
        buttons: [
          { label: 'Confirm Subscription', href: emailVars.callbackUrl, theme: 'primary' },
        ],
        superTitle: { text: senderName, icon: avatar, href: emailVars.callbackUrl },
      } satisfies EmailConfigResponse
    },
    serverTransaction: async (args, meta: EndpointMeta) => {
      const { where, userId, code } = args

      if (!code) {
        throw new Error('Missing code')
      }

      const orgId = where.orgId

      await fictionUser.queries.ManageUser.serve({ _action: 'verifyEmail', code, email: userId }, { ...meta, caller: 'subscribeServerTransactionVerifyEmail', server: true })

      const r = await fictionContact.queries.ManageContact.serve({ _action: 'create', orgId, contact: { userId } }, { ...meta, caller: 'subscribeServerTransactionCreate', server: true })

      const sub = r.data?.[0]

      return { status: 'success', data: sub, message: 'You\'re now subscribed!' }
    },
  })

  const unsubscribe = new EmailAction<{
    transactionArgs: { orgId: string, userId: string, code?: string }
  }>({
    fictionTransactions,
    actionId: 'unsubscribe',
    template: vue.defineAsyncComponent<vue.Component>(async () => import('./TransactionUnsubscribe.vue')), // <vue.Component> avoids circular reference

    serverTransaction: async (args, meta: EndpointMeta) => {
      const { orgId, userId, code } = args

      if (!code) {
        throw new Error('Missing code')
      }

      const r = await fictionContact.queries.ManageContact.serve({ _action: 'update', orgId, where: [{ userId }], fields: { status: 'unsubscribed' } }, { ...meta, server: true })

      return { ...r, message: 'You are now unsubscribed.' }
    },
  })

  return { subscribe, unsubscribe }
}
