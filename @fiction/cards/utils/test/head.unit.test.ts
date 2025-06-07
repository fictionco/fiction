import type { Site } from '@fiction/site'
import { describe, expect, it, vi } from 'vitest'
import { getHeadScripts, getSiteBrandColors, getStructuredData } from '../head'

// Mock the getColorScheme function
vi.mock('@fiction/core', () => ({
  getColorScheme: vi.fn(_color => ({
    50: '#f8fafc',
    500: '#3b82f6',
    900: '#1e3a8a',
  })),
}))

// Helper to create a mock site object
function createMockSite(overrides = {}) {
  return {
    frame: {
      displayUrl: {
        value: 'https://example.com',
      },
    },
    title: { value: 'Test Site' },
    url: { value: 'https://example.com' },
    org: {
      value: {
        name: 'Test Org',
        avatar: {
          url: 'https://example.com/avatar.jpg',
        },
      },

    },
    fullConfig: {
      value: {
        shareImage: {
          url: 'https://example.com/share.jpg',
        },
        locale: 'en-US',
        googleTagManagerId: 'GTM-12345',
        standard: {
          primaryColor: 'blue',
          description: 'Test description',
        },
      } satisfies Site['fullConfig']['value'],
    },
    currentPage: {
      value: {
        title: {
          value: 'Test Page',
        },
        description: {
          value: 'Page description',
        },
        slug: {
          value: '/test-page',
        },
        isHome: {
          value: false,
        },
      },
    },
    ...overrides,
  } as unknown as Site
}

describe('getSiteBrandColors', () => {
  it('should return color scheme for specified primary color', () => {
    const site = createMockSite()
    const result = getSiteBrandColors({ site })
    expect(result).toEqual({
      50: '#f8fafc',
      500: '#3b82f6',
      900: '#1e3a8a',
    })
  })

  it('should use default blue color when no primary color specified', () => {
    const site = createMockSite({
      fullConfig: {
        value: {},
      },
    })
    const result = getSiteBrandColors({ site })
    expect(result).toEqual({
      50: '#f8fafc',
      500: '#3b82f6',
      900: '#1e3a8a',
    })
  })

  it('should handle undefined site', () => {
    const result = getSiteBrandColors({ site: undefined })
    expect(result).toEqual({
      50: '#f8fafc',
      500: '#3b82f6',
      900: '#1e3a8a',
    })
  })
})

describe('getStructuredData', () => {
  it('should return empty object string when no site provided', () => {
    const result = getStructuredData({ site: undefined })
    expect(result).toBe('{}')
  })

  it('should generate correct structured data for normal page', () => {
    const site = createMockSite()
    const result = JSON.parse(getStructuredData({ site }))

    expect(result['@graph'][0].name).toBe('Test Org')

    expect(result).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "https://example.com/#person",
            "@type": "Person",
            "description": "Test description",
            "image": "https://example.com/share.jpg",
            "name": "Test Org",
            "url": "https://example.com",
          },
          {
            "@id": "https://example.com/test-page#webpage",
            "@type": "WebPage",
            "description": "Page description",
            "inLanguage": "en-US",
            "mainEntity": {
              "@id": "https://example.com/#person",
            },
            "name": "Test Page",
            "url": "https://example.com/test-page",
          },
        ],
      }
    `)

    expect(result).toEqual({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': 'https://example.com/#person',
          'name': 'Test Org',
          'url': 'https://example.com',
          'image': 'https://example.com/share.jpg',
          'description': 'Test description',
        },
        {
          '@type': 'WebPage',
          '@id': 'https://example.com/test-page#webpage',
          'url': 'https://example.com/test-page',
          'name': 'Test Page',
          'description': 'Page description',
          'mainEntity': { '@id': 'https://example.com/#person' },
          'inLanguage': 'en-US',
        },
      ],
    })
  })

  it('should handle home page slug correctly', () => {
    const site = createMockSite({
      currentPage: {
        value: {
          title: { value: 'Home' },
          description: { value: 'Home description' },
          slug: { value: 'whatever' },
          isHome: { value: true },
        },
      },
    })
    const result = JSON.parse(getStructuredData({ site }))
    expect(result['@graph'][1].url).toBe('https://example.com')
  })

  it('should use fallback values when optional data is missing', () => {
    const site = createMockSite({
      org: null,
      fullConfig: {
        value: {
          seo: {},
        },
      },
    })
    const result = JSON.parse(getStructuredData({ site }))
    expect(result['@graph'][0].name).toBe('Test Site')
    expect(result['@graph'][1].inLanguage).toBe('en-US')
  })
})

describe('getHeadScripts', () => {
  it('should return GTM noscript when noscript is true and GTM ID exists', () => {
    const site = createMockSite()
    const result = getHeadScripts({ site, noscript: true })

    expect(result).toHaveLength(1)
    expect(result[0].innerHTML).toContain('GTM-12345')
    expect(result[0].innerHTML).toContain('iframe')
  })

  it('should return empty array for noscript when no GTM ID exists', () => {
    const site = createMockSite({
      fullConfig: {
        value: {
          customCode: {},
        },
      },
    })
    const result = getHeadScripts({ site, noscript: true })
    expect(result).toHaveLength(0)
  })

  it('should return correct scripts array with GTM', () => {
    const site = createMockSite()
    const result = getHeadScripts({ site })

    expect(result).toHaveLength(3)
    expect(result[0].type).toBe('text/javascript')
    expect(result[1].type).toBe('application/ld+json')
    expect(result[2].innerHTML).toContain('GTM-12345')
  })

  it('should return scripts without GTM when no GTM ID exists', () => {
    const site = createMockSite({
      fullConfig: {
        value: {
          customCode: {},
        },
      },
    })
    const result = getHeadScripts({ site })

    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('text/javascript')
    expect(result[1].type).toBe('application/ld+json')
  })

  it('should handle undefined site', () => {
    const result = getHeadScripts({ site: undefined })
    expect(result).toHaveLength(2)
    expect(result[1].innerHTML).toBe('{}')
  })
})
