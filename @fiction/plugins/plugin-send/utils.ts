import type { ManageEmailSendParams } from './endpoint'
import type { EmailSendConfig } from './schema.js'
import type { FictionSend } from './index.js'

export async function manageEmails(args: { fictionSend: FictionSend, params: ManageEmailSendParams }): Promise<EmailSendConfig[]> {
  const { fictionSend, params } = args
  const r = await fictionSend.requests.ManageSend.projectRequest(params)

  return r.data || []
}
