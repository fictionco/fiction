import type { ActionButton } from '@fiction/platform'
import type { MediaItem } from '../types'
import type { colorList } from '../utils'

export type EmailSendConfig = {
  // From info
  fromName?: string
  fromEmail?: string
  avatarUrl?: string

  // Content
  subject?: string
  title?: string
  subTitle?: string
  bodyMarkdown?: string
  preview?: string

  // Media
  mediaSuper?: MediaItem
  mediaFooter?: MediaItem
  legal?: MediaItem

  // Actions & Links
  actions?: ActionButton[]
  unsubscribeUrl?: string

  // Email specifics
  to?: string
  bodyHtml?: string
  bodyText?: string
  campaignId?: string
  emailId?: string
  toUserId?: string
  fromOrgId?: string
  env?: 'prod' | 'dev' | 'test'
  caller?: string

  emailType?: 'transactional' | 'campaign' | 'newsletter' | 'notification'

  // Theme
  previewMode?: 'dark' | 'light' | ''
  primaryColor?: keyof typeof colorList
}

export function replaceEmailDomain(email: string, newDomain?: string): string {
  if (!newDomain || email.includes('fiction.com'))
    return email

  return email.replace(/@[^>]+/, `@${newDomain}`)
}
