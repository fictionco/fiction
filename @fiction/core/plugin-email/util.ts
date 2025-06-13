import type { ActionButton, MediaObject, NavListItem, SuperTitle } from '../schemas'
import type { colorList, ColorThemeBright } from '../utils/colors'
import { z } from 'zod/v4'

export const EmailTypeSchema = z.enum(['alert', 'update', 'digest', 'campaign'])
export type EmailType = z.infer<typeof EmailTypeSchema>

export type EmailSendConfig = {

  // content
  superTitle?: SuperTitle
  title: string
  subTitle: string
  content?: string
  contentMarkdown?: string
  mediaFeatured?: MediaObject
  theme?: ColorThemeBright

  // footer and links
  readOnSiteUrl?: string
  mediaFooter?: MediaObject
  streetAddress?: string
  companyName?: string
  websiteUrl?: string
  buttons?: ActionButton[]
  unsubscribeUrl?: string
  poweredByFiction?: boolean
  footerLinks?: NavListItem[]

  // Email specifics

  subject: string
  preview?: string
  avatar?: MediaObject
  senderName?: string
  senderEmail?: string
  to?: string
  bodyHtml?: string
  bodyText?: string
  postId?: string
  emailId?: string
  toUserId?: string
  fromOrgId?: string
  env?: 'prod' | 'dev' | 'test'
  caller: string

  emailType?: EmailType

  // Theme
  previewMode?: 'dark' | 'light' | ''
  primaryColor?: keyof typeof colorList

}

export function replaceEmailDomain(email: string, newDomain?: string): string {
  if (!newDomain || email.includes('fiction.com'))
    return email

  return email.replace(/@[^>]+/, `@${newDomain}`)
}
