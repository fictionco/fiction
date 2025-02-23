import type { colorList, ColorThemeBright } from '@fiction/core/utils/colors'
import type { ActionButton, MediaObject, NavListItem, SuperTitle } from '../schemas/schemas'

export type EmailSendConfig = {

  // content
  superTitle?: SuperTitle
  title?: string
  subTitle?: string
  bodyMarkdown?: string
  mediaFeatured?: MediaObject
  theme?: ColorThemeBright

  // footer and links
  mediaFooter?: MediaObject
  streetAddress?: string
  company?: string
  websiteUrl?: string
  buttons?: ActionButton[]
  unsubscribeUrl?: string
  poweredByFiction?: boolean
  footerLinks?: NavListItem[]

  // Email specifics

  subject?: string
  preview?: string
  fromAvatar?: MediaObject
  fromName?: string
  fromEmail?: string
  fromReplyTo?: string
  to?: string
  bodyHtml?: string
  bodyText?: string
  postId?: string
  emailId?: string
  toUserId?: string
  fromOrgId?: string
  fromSiteId?: string
  env?: 'prod' | 'dev' | 'test'
  caller?: string

  emailType?: 'transactional' | 'campaign' | 'newsletter' | 'notification' | 'post'

  // Theme
  previewMode?: 'dark' | 'light' | ''
  primaryColor?: keyof typeof colorList
}

export function replaceEmailDomain(email: string, newDomain?: string): string {
  if (!newDomain || email.includes('fiction.com'))
    return email

  return email.replace(/@[^>]+/, `@${newDomain}`)
}
