import type { Site } from '@fiction/site'
import fictionIcon from '@fiction/ui/brand/icon.png'
import { getSiteBrandColors } from './head'

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

function formatColor(color?: string): string {
  // Remove # if present and ensure valid hex
  return color?.replace('#', '') || '000000'
}

export function getDefaultIconUrl(args: { site?: Site, options?: Partial<IconOptions> }) {
  const { site, options = {} } = args
  const siteName = site?.title.value || site?.org?.orgName

  if (!siteName) {
    return fictionIcon
  }

  const brandColor = getSiteBrandColors({ site })

  const defaultOptions: IconOptions = {
    'name': siteName,
    'size': 128,
    'background': formatColor(brandColor[950]),
    'color': formatColor(brandColor[100]),
    'length': 1,
    'rounded': false,
    'bold': true,
    'format': 'png',
    'font-size': 0.65,
    'uppercase': true,
  }

  const opts = { ...defaultOptions, ...options }

  const finalOptions = {
    ...opts,
    background: formatColor(opts.background),
    color: formatColor(opts.color),
  }

  // Build URL with parameters
  const params = new URLSearchParams()

  // Add all non-undefined options to params
  Object.entries(finalOptions).forEach(([key, value]) => {
    if (value !== undefined) {
      // Convert boolean to string
      const paramValue = typeof value === 'boolean' ? value.toString() : value
      params.append(key, paramValue.toString())
    }
  })

  return `https://ui-avatars.com/api/?${params.toString()}`
}

// Helper function to generate specific icon sizes
export function getSiteIcons(args: { site?: Site }) {
  const { site } = args

  return {
    favicon: getDefaultIconUrl({
      site,
      options: {
        size: 32,
        format: 'png',
        rounded: false,
      },
    }),
    appleTouchIcon: getDefaultIconUrl({
      site,
      options: {
        size: 180,
        format: 'png',
        rounded: false,
      },
    }),
    msTileIcon: getDefaultIconUrl({
      site,
      options: {
        size: 144,
        format: 'png',
        rounded: false,
      },
    }),
    ogImage: getDefaultIconUrl({
      site,
      options: {
        'size': 512, // Maximum size supported
        'format': 'png',
        'rounded': false,
        'font-size': 0.4, // Slightly smaller font for better appearance
      },
    }),
  }
}

export function getHeadIconConfig(args: { site?: Site }) {
  const { site } = args
  const config = site?.fullConfig.value.site || {}

  // Get configured icons or defaults
  const defaultIcons = getSiteIcons({ site })

  const faviconUrl = config.favicon?.url
  const iconUrl = config.icon?.url
  const ogImageUrl = config.shareImage?.url

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
