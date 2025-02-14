import type { EmailSendConfig, Organization } from '@fiction/core'
import type { FictionPosts, TablePostConfig } from '..'
import { toMarkdown, vue } from '@fiction/platform'

export async function getEmailForPost(args: {
  org: Organization
  postConfig: TablePostConfig
  fictionPosts: FictionPosts
  withDefaults: boolean
  previewMode?: 'dark' | 'light' | ''
}): Promise<EmailSendConfig> {
  const { postConfig, fictionPosts, withDefaults = false, org, previewMode } = args
  const { fictionEmail, fictionEnv, fictionMedia } = fictionPosts.settings
  const isApp = fictionEnv?.isApp.value
  const isTest = fictionEnv?.isTest.value
  const env = fictionEnv.isProd.value ? 'prod' : isTest ? 'test' : 'dev'

  const img = await fictionEmail?.emailImages({ fictionMedia })

  const { orgName, orgEmail, url, address, avatar } = org

  let emailConfig: EmailSendConfig = {
    fromName: orgName || (withDefaults ? 'No Name' : ''),
    fromEmail: orgEmail || (withDefaults ? 'No Email' : ''),
    avatarUrl: avatar?.url,
    emailType: 'campaign',
    fromOrgId: postConfig.orgId,
    postId: postConfig.postId,
    subject: postConfig.emailSubject || (withDefaults ? 'No Subject' : ''),
    title: postConfig?.title || (withDefaults ? 'No Title' : ''),
    subTitle: postConfig?.subTitle || (withDefaults ? 'No Subtitle' : ''),
    bodyMarkdown: await toMarkdown(postConfig?.content || (withDefaults ? 'No content' : '')),
    mediaSuper: { media: { url: avatar?.url }, label: orgName, href: url },
    mediaFooter: { media: { url: img.footer.url }, label: 'Powered by Fiction', href: 'https://www.fiction.com' },
    legal: { label: orgName, href: url, description: address || '' },
    unsubscribeUrl: '#',
    previewMode,
    env,
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
