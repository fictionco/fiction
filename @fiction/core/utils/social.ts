import type { Organization } from '../plugin-user'
import type { SocialAccounts, SocialPlatform } from '../schemas/org'

export function getSocialUrl(args: { platform?: SocialPlatform, handle?: string }): string {
  const { platform, handle } = args
  if (!platform || !handle)
    return ''

  const socialUrls: Record<SocialPlatform, string> = {
    x: `https://www.x.com/${handle}`,
    crunchbase: `https://www.crunchbase.com/organization/${handle}`,
    facebook: `https://www.facebook.com/${handle}`,
    instagram: `https://www.instagram.com/${handle}`,
    linkedin: `https://www.linkedin.com/in/${handle}`,
    tiktok: `https://www.tiktok.com/@${handle}`,
    youtube: `https://www.youtube.com/c/${handle}`,
    github: `https://www.github.com/${handle}`,
    reddit: `https://www.reddit.com/user/${handle}`,
    discord: `https://discord.com/users/${handle}`,
    pinterest: `https://www.pinterest.com/${handle}`,
    snapchat: `https://www.snapchat.com/add/${handle}`,
    medium: `https://medium.com/@${handle}`,
    substack: `https://substack.com/@${handle}`,
    patreon: `https://www.patreon.com/${handle}`,
    whatsapp: `https://wa.me/${handle}`,
    telegram: `https://t.me/${handle}`,
    calendar: `https://calendar.google.com/calendar/u/0/r?cid=${handle}`,
    twitch: `https://www.twitch.tv/${handle}`,
  }
  return socialUrls[platform] || ''
}

export function getSocialUrlByOrg(args: { org?: Organization, platform?: string }): string {
  const { org } = args
  const platform = args?.platform as keyof SocialAccounts | undefined
  const accounts = org?.accounts || {}
  const handle = platform ? accounts?.[platform]?.handle : ''
  const platformUrl = getSocialUrl({ platform, handle })
  return platformUrl
}
