import type { Site } from '@fiction/site'
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

export function getDefaultIconUrl(args: { site?: Site, options?: Partial<IconOptions> }) {
  const { options = {} } = args

  const format = options.format || 'png'

  return format === 'svg' ? fictionFaviconSvg : fictionIcon
}

// Helper function to generate specific icon sizes
export function getSiteIcons(args: { site?: Site }) {
  const { site } = args

  return {
    favicon: getDefaultIconUrl({ site, options: { size: 32, format: 'svg', rounded: false } }),
    appleTouchIcon: getDefaultIconUrl({ site, options: { size: 180, format: 'png', rounded: false } }),
    msTileIcon: getDefaultIconUrl({ site, options: { size: 144, format: 'png', rounded: false } }),
    ogImage: getDefaultIconUrl({ site, options: { 'size': 512, 'format': 'png', 'rounded': false, 'font-size': 0.4 } }),
  }
}

export function getHeadIconConfig(args: { site?: Site }) {
  const { site } = args
  const config = site?.fullConfig.value || {}

  // Get configured icons or defaults
  const defaultIcons = getSiteIcons({ site })

  const faviconUrl = config.favicon?.url || defaultIcons.favicon
  const iconUrl = config.icon?.url || defaultIcons.appleTouchIcon
  const ogImageUrl = config.shareImage?.url || defaultIcons.ogImage

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
    msTileIconUrl: config.icon?.url || defaultIcons.msTileIcon,
    ogImageUrl,
  }
}
