import type { RequestOptions } from '@fiction/core'
import type { ManageEmailSendActionParams, ManageEmailSendParams } from './endpoint'
import type { EmailSendConfig } from './schema.js'
import { Email } from './email'
import type { FictionSend } from './index.js'

export async function manageEmails(args: { fictionSend: FictionSend, params: ManageEmailSendParams }): Promise<EmailSendConfig[]> {
  const { fictionSend, params } = args
  const r = await fictionSend.requests.ManageSend.projectRequest(params)

  return r.data || []
}

export async function manageEmailSend(args: { fictionSend: FictionSend, params: ManageEmailSendActionParams, options?: RequestOptions }) {
  const { fictionSend, params, options = {} } = args
  const fictionPosts = fictionSend.settings.fictionPosts

  const r = await fictionSend.requests.ManageSend.projectRequest(params, options)

  return r.data?.map(emailConfig => new Email({ ...emailConfig, fictionSend, fictionPosts })) || []
}

export async function loadEmail(args: { fictionSend: FictionSend }) {
  const { fictionSend } = args
  const fictionRouter = fictionSend.settings.fictionRouter

  const emailId = fictionRouter.query.value.emailId as string | undefined

  let email: Email
  if (!emailId) {
    const [_email] = await manageEmailSend({ fictionSend, params: { _action: 'create', fields: [{}] } })

    await fictionRouter.replace({ query: { emailId: _email?.emailId } })

    email = _email
  }
  else {
    const [_email] = await manageEmailSend({ fictionSend, params: { _action: 'get', where: { emailId }, loadDraft: true } })

    email = _email
  }

  return email
}
