import type { EmailSendConfig, Organization } from '@fiction/core'
import type { FictionContact } from '@fiction/plugin-contact'
import type { FictionPosts, Post, TablePostConfig } from '..'

export async function getEmailForPost(args: {
  org: Organization
  postConfig: TablePostConfig
  fictionPosts: FictionPosts
  withDefaults: boolean
  previewMode?: 'dark' | 'light' | ''
}): Promise<EmailSendConfig> {
  const { postConfig, fictionPosts, withDefaults = false, org, previewMode } = args
  const { fictionEmail, fictionEnv } = fictionPosts.settings
  const isTest = fictionEnv?.isTest.value
  const env = fictionEnv.isProd.value ? 'prod' : isTest ? 'test' : 'dev'

  const senderName = org.orgName
  const senderEmail = org.orgEmail
  const avatar = org.avatar
  const websiteUrl = `https://${org.handle}.fiction.com`
  const companyName = 'Fiction Inc.'
  const streetAddress = '123 Fiction St, Fiction City, FC 12345'

  const emailConfig: EmailSendConfig = {
    senderName: senderName || (withDefaults ? 'No Name' : ''),
    senderEmail: senderEmail || (withDefaults ? 'No Email' : ''),
    emailType: 'campaign',
    fromOrgId: postConfig.orgId,
    postId: postConfig.postId,
    subject: postConfig.emailConfig?.subject || (withDefaults ? 'No Subject' : ''),
    preview: postConfig.emailConfig?.preview || (withDefaults ? 'No Preview' : ''),
    title: postConfig?.title || (withDefaults ? 'No Title' : ''),
    subTitle: postConfig?.subTitle || (withDefaults ? 'No Subtitle' : ''),
    content: postConfig?.content || (withDefaults ? 'No content' : ''),
    superTitle: {
      icon: avatar,
      text: senderName || (withDefaults ? 'No Publication Title' : ''),
      href: websiteUrl,
    },
    mediaFeatured: postConfig?.media,
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

export async function getPostEmailRecipientCount(args: { post?: Post, fictionContact: FictionContact }) {
  const { post, fictionContact } = args
  const mode = post?.audience.value || 'all'

  let recipientCount = 0

  if (mode === 'nobody' || !post) {
    return 0
  }

  // undefined filters means all recipients
  const filters = undefined

  try {
    const response = await fictionContact.requests.ManageContact.projectRequest({
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
