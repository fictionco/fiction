import type { ManageCampaignRequestParams } from './endpoint.js'
import type { FictionSend } from './index.js'

import type { EmailCampaignConfig } from './schema.js'
import { log, type Organization, type RequestOptions, toMarkdown, type TransactionalEmailConfig, vue } from '@fiction/core'
import { EmailCampaign } from './campaign.js'

const logger = log.contextLogger('NewsletterUtils')

export async function manageEmailCampaign(args: { fictionSend: FictionSend, params: ManageCampaignRequestParams, options?: RequestOptions }) {
  const { fictionSend, params, options = {} } = args

  const r = await fictionSend.requests.ManageCampaign.projectRequest(params, options)

  return r.data?.map(emailConfig => new EmailCampaign({ ...emailConfig, fictionSend })) || []
}

export async function loadEmail(args: { fictionSend: FictionSend, campaignId: string }) {
  const { fictionSend, campaignId } = args

  if (!campaignId)
    throw new Error('No campaignId')

  const [_campaign] = await manageEmailCampaign({ fictionSend, params: { _action: 'get', where: { campaignId } } })

  const campaign = _campaign

  return campaign
}

export async function getEmailForCampaign(args: {
  org: Organization
  campaignConfig: EmailCampaignConfig
  fictionSend: FictionSend
  withDefaults: boolean
  previewMode?: 'dark' | 'light' | ''
}): Promise<TransactionalEmailConfig> {
  const { campaignConfig, fictionSend, withDefaults = false, org, previewMode } = args
  const fictionEmail = fictionSend.settings.fictionEmail
  const isApp = fictionSend.settings.fictionEnv?.isApp.value

  const img = await fictionEmail?.emailImages({ fictionMedia: fictionSend.settings.fictionMedia })

  const { orgName, orgEmail, url, address, avatar } = org

  let emailConfig: TransactionalEmailConfig = {
    fromName: orgName || (withDefaults ? 'No Name' : ''),
    fromEmail: orgEmail || (withDefaults ? 'No Email' : ''),
    avatarUrl: avatar?.url,
    subject: campaignConfig.subject || (withDefaults ? 'No Subject' : ''),
    heading: campaignConfig.post?.title || (withDefaults ? 'No Title' : ''),
    subHeading: campaignConfig.post?.subTitle || (withDefaults ? 'No Subtitle' : ''),
    bodyMarkdown: toMarkdown(campaignConfig.post?.content || (withDefaults ? 'No content' : '')),
    actions: campaignConfig.userConfig?.actions || [],
    mediaSuper: { media: { url: avatar?.url }, name: orgName, href: url },
    mediaFooter: { media: { url: img.footer.url }, name: 'Powered by Fiction', href: 'https://www.fiction.com' },
    legal: { name: orgName, href: url, desc: address || '' },
    unsubscribeUrl: '#',
    previewMode,
  }

  if (isApp) {
    const EmailStandard = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailStandard.vue'))
    const { render } = await import('@vue-email/render')
    emailConfig.bodyHtml = await render(EmailStandard, emailConfig)
  }
  else {
    emailConfig = await fictionEmail?.renderEmailTemplate(emailConfig)
  }

  return emailConfig
}
