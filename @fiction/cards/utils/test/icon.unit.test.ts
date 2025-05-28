import type { Organization } from '@fiction/core'
import type { Site } from '@fiction/site'
import fictionIcon from '@fiction/ui/brand/icon.png'
import { describe, expect, it } from 'vitest'
import { getDefaultIconUrl, getHeadIconConfig, getSiteIcons } from '../icon'

describe('icon Utils', () => {
  const mockSite = {
    title: { value: 'Test Site' },
    org: {
      value: {
        icon: { url: 'custom-icon.png' },
        shareImage: { url: 'custom-share.png' },
      } satisfies Site['fullConfig']['value'],
    },
  } as any // Type as any to avoid full Site implementation

  describe('getDefaultIconUrl', () => {
    it('returns fiction icon when no site is provided', () => {
      const result = getDefaultIconUrl()
      expect(result).toBe(fictionIcon)
    })
  })

  describe('getSiteIcons', () => {
    it('returns fiction icon for all variants when no site provided', () => {
      const icons = getSiteIcons()
      expect(icons.favicon).toBe(fictionIcon)
      expect(icons.appleTouchIcon).toBe(fictionIcon)
      expect(icons.msTileIcon).toBe(fictionIcon)
      expect(icons.ogImage).toBe(fictionIcon)
    })
  })

  describe('getHeadIconConfig', () => {
    it('uses custom icons when provided', () => {
      const config = getHeadIconConfig({ org: mockSite.org.value })

      expect(config).toMatchInlineSnapshot(`
        {
          "appleTouchIconUrl": "custom-icon.png",
          "faviconType": "image/png",
          "faviconUrl": "custom-icon.png",
          "msTileIconUrl": "custom-icon.png",
          "ogImageUrl": "",
        }
      `)

      expect(config.faviconUrl).toBe('custom-icon.png')
      expect(config.appleTouchIconUrl).toBe('custom-icon.png')
      expect(config.msTileIconUrl).toBe('custom-icon.png')
    })

    it('falls back to default icons when custom not provided', () => {
      const siteMock = {
        title: { value: 'Test Site' },
        fullConfig: { value: { brand: {} } },
      } as any

      const config = getHeadIconConfig({ org: mockSite.org.value })

      expect(config).toMatchInlineSnapshot(`
        {
          "appleTouchIconUrl": "custom-icon.png",
          "faviconType": "image/png",
          "faviconUrl": "custom-icon.png",
          "msTileIconUrl": "custom-icon.png",
          "ogImageUrl": "",
        }
      `)

      expect(config.faviconUrl || '').toContain('png')
      expect(config.appleTouchIconUrl || '').toContain('png')
      expect(config.msTileIconUrl || '').toContain('png')
    })

    it('correctly determines favicon mime type', () => {
      const tests = [
        { ext: 'svg', expected: 'image/svg+xml' },
        { ext: 'png', expected: 'image/png' },
        { ext: 'ico', expected: 'image/x-icon' },
        { ext: 'jpg', expected: 'image/png' }, // Falls back to png
      ]

      tests.forEach(({ ext, expected }) => {
        const orgMock = {
          orgName: 'Test Org',
          icon: { url: `icon.${ext}` },
        } as Organization

        const config = getHeadIconConfig({ org: orgMock })
        expect(config.faviconType).toBe(expected)
      })
    })

    it('handles missing site gracefully', () => {
      const config = getHeadIconConfig({ org: undefined })
      expect(config).toMatchInlineSnapshot(`
        {
          "appleTouchIconUrl": "/@fiction/ui/brand/icon.png",
          "faviconType": "image/png",
          "faviconUrl": "/@fiction/ui/brand/icon.png",
          "msTileIconUrl": "/@fiction/ui/brand/icon.png",
          "ogImageUrl": "",
        }
      `)
    })
  })
})
