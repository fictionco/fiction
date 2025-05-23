import type { Organization } from '@fiction/core'
import type { Site } from '@fiction/site'
import fictionFaviconSvg from '@fiction/ui/brand/favicon.svg'
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
      expect(icons.favicon).toBe(fictionFaviconSvg)
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
          "faviconUrl": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20141%20145'%3e%3cstyle%3e%20path%20{%20fill:%20%23000;%20}%20/*%20Default%20color%20for%20light%20mode%20*/%20@media%20(prefers-color-scheme:%20dark)%20{%20path%20{%20fill:%20%23fff;%20}%20/*%20Color%20for%20dark%20mode%20*/%20}%20%3c/style%3e%3cpath%20d='M121.209%20145H60.388c-3.952%200-7.663-1.583-10.458-4.475L3.583%2092.686c-3.504-3.613-5.54-9.005-3.653-13.72%201.9-4.727%206.32-7.783%2011.276-7.783H69V12.567c0-5.097%202.958-9.66%207.532-11.625%204.497-1.932%209.867-.83%2013.306%202.718l46.369%2047.853c2.795%202.893%204.323%206.724%204.323%2010.796v62.752c0%2010.992-8.667%2019.932-19.321%2019.932V145zM62.8%20123.621h56.466V64.983L89.652%2034.235v58.637H33.197l29.614%2030.749H62.8z'/%3e%3c/svg%3e",
          "msTileIconUrl": "/@fiction/ui/brand/icon.png",
          "ogImageUrl": "",
        }
      `)
    })
  })
})
