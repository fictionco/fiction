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

  const r = await fictionSend.requests.ManageSend.projectRequest(params, options)

  return r.data?.map(emailConfig => new Email({ ...emailConfig, fictionSend })) || []
}

export async function loadEmail(args: { fictionSend: FictionSend, emailId: string }) {
  const { fictionSend, emailId } = args

  if (!emailId)
    throw new Error('No emailId')

  const [_email] = await manageEmailSend({ fictionSend, params: { _action: 'get', where: { emailId }, loadDraft: true } })

  const email = _email

  return email
}
