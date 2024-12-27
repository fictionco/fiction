import type express from 'express'
import type { ManageCampaignRequestParams } from './endpoint.js'

import type { FictionNewsletter } from './index.js'
import type { EmailCampaignConfig } from './schema.js'
import { log, type Organization, type RequestOptions, toMarkdown, type TransactionalEmailConfig, vue } from '@fiction/core'
import { EmailCampaign } from './campaign.js'

const logger = log.contextLogger('NewsletterUtils')

export async function manageEmailCampaign(args: { fictionNewsletter: FictionNewsletter, params: ManageCampaignRequestParams, options?: RequestOptions }) {
  const { fictionNewsletter, params, options = {} } = args

  const r = await fictionNewsletter.requests.ManageCampaign.projectRequest(params, options)

  return r.data?.map(emailConfig => new EmailCampaign({ ...emailConfig, fictionNewsletter })) || []
}

export async function loadEmail(args: { fictionNewsletter: FictionNewsletter, campaignId: string }) {
  const { fictionNewsletter, campaignId } = args

  if (!campaignId)
    throw new Error('No campaignId')

  const [_campaign] = await manageEmailCampaign({ fictionNewsletter, params: { _action: 'get', where: { campaignId } } })

  const campaign = _campaign

  return campaign
}

export async function getEmailForCampaign(args: {
  org: Organization
  campaignConfig: EmailCampaignConfig
  fictionNewsletter: FictionNewsletter
  withDefaults: boolean
  previewMode?: 'dark' | 'light' | ''
}): Promise<TransactionalEmailConfig> {
  const { campaignConfig, fictionNewsletter, withDefaults = false, org, previewMode } = args
  const fictionEmail = fictionNewsletter.settings.fictionEmail
  const isApp = fictionNewsletter.settings.fictionEnv?.isApp.value

  const img = await fictionEmail?.emailImages({ fictionMedia: fictionNewsletter.settings.fictionMedia })

  const { orgName, orgEmail, url, address, avatar } = org

  let emailConfig: TransactionalEmailConfig = {
    fromName: orgName || (withDefaults ? 'No Name' : ''),
    fromEmail: orgEmail || (withDefaults ? 'No Email' : ''),
    avatarUrl: avatar?.url,
    subject: campaignConfig.subject || (withDefaults ? 'No Subject' : ''),
    title: campaignConfig.post?.title || (withDefaults ? 'No Title' : ''),
    subTitle: campaignConfig.post?.subTitle || (withDefaults ? 'No Subtitle' : ''),
    bodyMarkdown: await toMarkdown(campaignConfig.post?.content || (withDefaults ? 'No content' : '')),
    actions: campaignConfig.userConfig?.actions || [],
    mediaSuper: { media: { url: avatar?.url }, label: orgName, href: url },
    mediaFooter: { media: { url: img.footer.url }, label: 'Powered by Fiction', href: 'https://www.fiction.com' },
    legal: { label: orgName, href: url, description: address || '' },
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

export async function trackingEndpointHandler(args: {
  fictionNewsletter: FictionNewsletter
  request: express.Request
  response: express.Response
}): Promise<void> {
  const { fictionNewsletter, request, response } = args
  const query = request.query as Record<string, string>
  const params = request.params as { action?: 'init' }

  const { action } = params

  if (!action) {
    fictionNewsletter.log.error('Invalid request', { action })
    response.status(400).send('Invalid request')
    return
  }

  fictionNewsletter.log.error('email tracking webhook', { data: { query, params } })

  try {
    if (action === 'init') {
      //
    }
    else {
      throw new Error('invalid action')
    }
  }
  catch (error) {
    const e = error as Error
    fictionNewsletter.log.error('tracking endpoint threw an error', { error })
    response.status(400).send({ status: 'error', message: e.message }).end()
  }
}
