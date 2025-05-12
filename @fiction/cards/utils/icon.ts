import type { Organization } from '@fiction/core'
import fictionFaviconSvg from '@fiction/ui/brand/favicon.svg'
import fictionIcon from '@fiction/ui/brand/icon.png'

type IconOptions = {
  'name'?: string
  'size'?: number
  'background'?: string
  'color'?: string
  'length'?: number
  'rounded'?: boolean
  'bold'?: boolean
  'format'?: 'svg' | 'png'
  'font-size'?: number
  'uppercase'?: boolean
}

export function getDefaultIconUrl(args?: { options?: Partial<IconOptions> }) {
  const { options = {} } = args || {}

  const format = options.format || 'png'

  return format === 'svg' ? fictionFaviconSvg : fictionIcon
}

// Helper function to generate specific icon sizes
export function getSiteIcons() {
  return {
    favicon: getDefaultIconUrl({ options: { size: 32, format: 'svg', rounded: false } }),
    appleTouchIcon: getDefaultIconUrl({ options: { size: 180, format: 'png', rounded: false } }),
    msTileIcon: getDefaultIconUrl({ options: { size: 144, format: 'png', rounded: false } }),
    ogImage: getDefaultIconUrl({ options: { 'size': 512, 'format': 'png', 'rounded': false, 'font-size': 0.4 } }),
  }
}

export function getHeadIconConfig(args: { org?: Organization }) {
  const { org } = args

  // Get configured icons or defaults
  const defaultIcons = getSiteIcons()

  const faviconUrl = org?.icon?.url || defaultIcons.favicon
  const iconUrl = org?.icon?.url || defaultIcons.appleTouchIcon
  const msTileIconUrl = org?.icon?.url || defaultIcons.msTileIcon
  const ogImageUrl = '' // config.shareImage?.url || defaultIcons.ogImage

  // Get MIME type for favicon
  const faviconExt = faviconUrl?.split('.').pop()?.toLowerCase() || ''
  const specialFaviconTypes: Record<string, string> = {
    svg: 'image/svg+xml',
    png: 'image/png',
    ico: 'image/x-icon',
  }
  const faviconType = specialFaviconTypes[faviconExt] || 'image/png'

  return {
    faviconUrl,
    faviconType,
    appleTouchIconUrl: iconUrl,
    msTileIconUrl,
    ogImageUrl,
  }
}
