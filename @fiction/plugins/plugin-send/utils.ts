import type { RequestOptions } from '@fiction/core'
import type { ManageCampaignRequestParams } from './endpoint.js'
import { EmailCampaign } from './campaign.js'
import type { FictionSend } from './index.js'

export async function manageEmailCampaign(args: { fictionSend: FictionSend, params: ManageCampaignRequestParams, options?: RequestOptions }) {
  const { fictionSend, params, options = {} } = args

  const r = await fictionSend.requests.ManageCampaign.projectRequest(params, options)

  return r.data?.map(emailConfig => new EmailCampaign({ ...emailConfig, fictionSend })) || []
}

export async function loadEmail(args: { fictionSend: FictionSend, campaignId: string }) {
  const { fictionSend, campaignId } = args

  if (!campaignId)
    throw new Error('No campaignId')

  const [_email] = await manageEmailCampaign({ fictionSend, params: { _action: 'get', where: { campaignId }, loadDraft: true } })

  const email = _email

  return email
}
