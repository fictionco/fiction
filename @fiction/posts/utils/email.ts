import type { EmailSendConfig, Organization } from '@fiction/core'
import type { FictionSubscribe } from '@fiction/plugins/plugin-subscribe'
import type { FictionPosts, Post, TablePostConfig } from '..'
import { proseToMarkdown } from '@fiction/core'

export async function getEmailForPost(args: {
  org: Organization
  postConfig: TablePostConfig
  fictionPosts: FictionPosts
  withDefaults: boolean
  previewMode?: 'dark' | 'light' | ''
}): Promise<EmailSendConfig> {
  const { postConfig, fictionPosts, withDefaults = false, org, previewMode } = args
  const { fictionEmail, fictionEnv, fictionMedia } = fictionPosts.settings
  const isTest = fictionEnv?.isTest.value
  const env = fictionEnv.isProd.value ? 'prod' : isTest ? 'test' : 'dev'

  const img = await fictionEmail?.emailImages({ fictionMedia })

  const {
    senderName = org.orgName,
    senderEmail = org.orgEmail,
    avatar,
    websiteUrl,
    companyName = org.orgName,
    streetAddress,
  } = postConfig.sender || {}

  const emailConfig: EmailSendConfig = {
    senderName: senderName || (withDefaults ? 'No Name' : ''),
    senderEmail: senderEmail || (withDefaults ? 'No Email' : ''),
    emailType: 'post',
    fromOrgId: postConfig.orgId,
    postId: postConfig.postId,
    subject: postConfig.emailConfig?.subject || (withDefaults ? 'No Subject' : ''),
    preview: postConfig.emailConfig?.preview || (withDefaults ? 'No Preview' : ''),
    title: postConfig?.title || (withDefaults ? 'No Title' : ''),
    subTitle: postConfig?.subTitle || (withDefaults ? 'No Subtitle' : ''),
    bodyMarkdown: await proseToMarkdown(postConfig?.content || (withDefaults ? 'No content' : '')),
    superTitle: {
      icon: avatar,
      text: senderName || (withDefaults ? 'No Publication Title' : ''),
      href: websiteUrl,
    },
    mediaFeatured: postConfig?.media,
    mediaFooter: { url: img.footer.url },
    poweredByFiction: true,
    streetAddress,
    companyName,
    websiteUrl,
    unsubscribeUrl: '#',
    previewMode,
    env,
  }

  emailConfig.bodyHtml = await fictionEmail.compileTemplateToHtml({ emailConfig })

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
