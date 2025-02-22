import type { EmailSendConfig, Organization } from '@fiction/core'
import type { FictionSubscribe } from '@fiction/plugins/plugin-subscribe'
import type { FictionPosts, Post, TablePostConfig } from '..'
import { toMarkdown, vue } from '@fiction/core'

export async function compileTemplate(args: { emailConfig: EmailSendConfig }): Promise<string> {
  const { emailConfig } = args
  const { renderToString } = await import('vue/server-renderer')
  const EmailV2 = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailV2.vue'))
  const app = vue.createSSRApp(EmailV2, emailConfig)
  return await renderToString(app)
}

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
    subject: postConfig.emailConfig?.subject || (withDefaults ? 'No Subject' : ''),
    preview: postConfig.emailConfig?.preview || (withDefaults ? 'No Preview' : ''),
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
    // const EmailStandard = vue.defineAsyncComponent(() => import('@fiction/core/plugin-email/templates/EmailStandard.vue'))
    // const { render } = await import('@vue-email/render')
    emailConfig.bodyHtml = await compileTemplate({ emailConfig })
  }
  else {
    emailConfig = await fictionEmail?.renderEmailTemplate(emailConfig)
  }

  return emailConfig
}

export async function getPostEmailRecipientCount(args: { post?: Post, fictionSubscribe: FictionSubscribe }) {
  const { post, fictionSubscribe } = args
  const mode = post?.emailConfig.value.target

  let recipientCount = 0

  if (mode === 'nobody' || !post) {
    return recipientCount
  }

  const filters = mode === 'filtered' ? post.emailConfig.value.filters : undefined

  try {
    const response = await fictionSubscribe.requests.ManageSubscription.projectRequest({
      _action: 'count',
      filters,
    })

    recipientCount = response.indexMeta?.count || 0
  }
  catch (error) {
    console.error('Error fetching recipient count:', error)
    recipientCount = 0
  }

  return recipientCount
}
