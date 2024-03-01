import { describe, expect, it } from 'vitest'

import { displayDomain, getDomainFavicon, getUrlPath, refineRoute, safeUrl, standardizeUrlOrPath, updateUrl, urlPath } from '../url'

describe('refineRoute', () => {
  it('should handle misc vars', () => {
    const route = '/test/:testId/foo/:anotherId/bar/:yetAnotherId?'
    const result = refineRoute(route, { testId: undefined, anotherId: '456' })
    expect(result).toBe('/test/:testId/foo/456/bar')
  })

  it('should return just a slash for base route', () => {
    const route = '/'
    const result = refineRoute(route)
    expect(result).toBe('/')
  })

  it('replaces given parameters in the route', () => {
    const route = '/this/is/a/:itemId/whatever'
    const replacers = { itemId: '123', ignoreId: '777' }
    const result = refineRoute(route, replacers)
    expect(result).toBe('/this/is/a/123/whatever')
  })

  it('removes unreplaced optional parameters', () => {
    const route = '/this/is/a/:itemId/whatever/:optionalId?'
    const replacers = { itemId: '123' }
    const result = refineRoute(route, replacers)
    expect(result).toBe('/this/is/a/123/whatever')
  })

  it('does not remove unreplaced non-optional parameters', () => {
    const route = '/this/is/a/:itemId/whatever/:optionalId?'
    const replacers: Record<string, string> = {}
    const result = refineRoute(route, replacers)
    expect(result).toBe('/this/is/a/:itemId/whatever')
  })

  it('removes trailing slashes', () => {
    const route = '/this/is/a/trailing/slash/'
    const replacers: Record<string, string> = {}
    const result = refineRoute(route, replacers)
    expect(result).toBe('/this/is/a/trailing/slash')
  })

  it('collapses multiple slashes into one', () => {
    const route = '/this//is/a///route/with/multiple////slashes'
    const result = refineRoute(route)
    expect(result).toBe('/this/is/a/route/with/multiple/slashes')
  })

  it('handles complex cases correctly', () => {
    const route = '/:optional?/this/:id/is/:optional2?/complex/:optional3?/'
    const replacers = { id: '123' }
    const result = refineRoute(route, replacers)
    expect(result).toBe('/this/123/is/complex')
  })
})

describe('getUrlPath', () => {
  it('should handle full URLs correctly', () => {
    expect(getUrlPath({ urlOrPath: 'http://example.com/path/to/resource?query=123#section' }))
      .toBe('/path/to/resource?query=123#section')
  })

  it('should handle relative paths correctly', () => {
    expect(getUrlPath({ urlOrPath: '/path/to/resource?query=123#section' }))
      .toBe('/path/to/resource?query=123#section')
  })

  it('should return root path for empty or invalid input', () => {
    expect(getUrlPath({ urlOrPath: '' })).toBe('/')
    expect(getUrlPath({ urlOrPath: null as unknown as undefined })).toBe('/')
    expect(getUrlPath({ urlOrPath: undefined })).toBe('/')
    expect(getUrlPath({})).toBe('/')
  })

  it('should handle paths with unusual characters', () => {
    expect(getUrlPath({ urlOrPath: '/path/with space&special#chars!' }))
      .toBe('/path/with%20space&special#chars!')
  })
})

describe('updateUrl', () => {
  const base = 'http://example.com'

  it('should update the pathname, search, and hash', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: '/new/path?query=123#section' })
    expect(updated).toBe('http://example.com/new/path?query=123#section')
  })

  it('should handle an empty newValue', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: '' })
    expect(updated).toBe('http://example.com/')
  })

  it('should handle newValue with only a hash', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: '#section' })
    expect(updated).toBe('http://example.com/#section')
  })

  it('should handle newValue with only query parameters', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: '?query=123' })
    expect(updated).toBe('http://example.com/?query=123')
  })

  it('should handle complicated and poorly formatted path', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: '/new//path.html/?foo=bar#action' })
    expect(updated).toBe('http://example.com/new/path.html?foo=bar#action')
  })
  it('should correctly update when a full URL is provided', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: 'http://example.net/new/path?query=123#section' })
    expect(updated).toBe('http://example.net/new/path?query=123#section')
  })

  it('should handle full URL with only a domain', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: 'http://example.net' })
    expect(updated).toBe('http://example.net/')
  })

  it('should handle full URL with domain and hash', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: 'http://example.net#section' })
    expect(updated).toBe('http://example.net/#section')
  })

  it('should handle full URL with domain and query parameters', () => {
    const updated = updateUrl({ url: base, newUrlOrPath: 'http://example.net?query=123' })
    expect(updated).toBe('http://example.net/?query=123')
  })
})

describe('standardizeUrlOrPath', () => {
  it('should return a single slash for empty input', () => {
    expect(standardizeUrlOrPath({ urlOrPath: '' })).toBe('/')
  })

  it('should remove trailing slashes', () => {
    expect(standardizeUrlOrPath({ urlOrPath: '/path/to/resource/' })).toBe('/path/to/resource')
  })

  it('should handle query and hash', () => {
    expect(standardizeUrlOrPath({ urlOrPath: '/path/to/resource?whatever=123#look' })).toBe('/path/to/resource?whatever=123#look')
  })

  it('should add a leading slash if missing', () => {
    expect(standardizeUrlOrPath({ urlOrPath: 'path/to/resource' })).toBe('/path/to/resource')
  })

  it('should handle a path that is just a slash', () => {
    expect(standardizeUrlOrPath({ urlOrPath: '/' })).toBe('/')
  })

  it('should not modify a correct path', () => {
    expect(standardizeUrlOrPath({ urlOrPath: '/path/to/resource' })).toBe('/path/to/resource')
  })

  it('should clean up complicated path', () => {
    expect(standardizeUrlOrPath({ urlOrPath: '/path//to/resource/?whatever=123#look' })).toBe('/path/to/resource?whatever=123#look')
  })

  it('should correctly handle a full URL', () => {
    expect(standardizeUrlOrPath({ urlOrPath: 'http://example.com/path/to/resource?whatever=123#look' }))
      .toBe('http://example.com/path/to/resource?whatever=123#look')
  })

  it('should handle full URL with only a domain', () => {
    expect(standardizeUrlOrPath({ urlOrPath: 'http://example.com' })).toBe('http://example.com/')
  })

  it('should handle full URL with domain and hash', () => {
    expect(standardizeUrlOrPath({ urlOrPath: 'http://example.com#section' })).toBe('http://example.com/#section')
  })

  it('should handle full URL with domain and query parameters', () => {
    expect(standardizeUrlOrPath({ urlOrPath: 'http://example.com?query=123' })).toBe('http://example.com/?query=123')
  })

  it('should clean up complicated full URL path', () => {
    expect(standardizeUrlOrPath({ urlOrPath: 'http://example.com/path//to/resource/?whatever=123#look' }))
      .toBe('http://example.com/path/to/resource?whatever=123#look')
  })

  it('should retain the original URL if it is already well-formed', () => {
    expect(standardizeUrlOrPath({ urlOrPath: 'http://example.com/well/formatted/path?query=123#section' }))
      .toBe('http://example.com/well/formatted/path?query=123#section')
  })

  it('should encode spaces in the path', () => {
    expect(standardizeUrlOrPath({ urlOrPath: '/path with space/to/resource' })).toBe('/path%20with%20space/to/resource')
  })
})

describe('urlPath', () => {
  it('should correctly concatenate parts into a URL path', () => {
    expect(urlPath(['path', 'to', 'resource'])).toBe('/path/to/resource')
  })

  it('should remove redundant leading and trailing slashes', () => {
    expect(urlPath(['/path/', '/to/', '/resource/'])).toBe('/path/to/resource')
  })

  it('should handle empty parts and multiple slashes', () => {
    expect(urlPath(['path', '', '///to///', 'resource'])).toBe('/path/to/resource')
  })

  it('should return a single slash for empty input', () => {
    expect(urlPath([])).toBe('/')
  })
})

describe('displayDomain', () => {
  it('should return an empty string for undefined or empty input', () => {
    expect(displayDomain(undefined)).toBe('')
    expect(displayDomain('')).toBe('')
  })

  it('should remove http and https protocols', () => {
    expect(displayDomain('http://example.com')).toBe('example.com')
    expect(displayDomain('https://example.com')).toBe('example.com')
  })

  it('should remove www prefix', () => {
    expect(displayDomain('www.example.com')).toBe('example.com')
  })

  it('should remove trailing slash', () => {
    expect(displayDomain('example.com/')).toBe('example.com')
  })

  it('should handle complex URLs', () => {
    expect(displayDomain('http://www.example.com/path?query=123')).toBe('example.com/path?query=123')
  })
})

describe('getDomainFavicon', () => {
  it('should return an empty string for undefined or empty input', () => {
    expect(getDomainFavicon(undefined)).toBe('')
    expect(getDomainFavicon('')).toBe('')
  })

  it('should return favicon URL for a single string input', () => {
    expect(getDomainFavicon('http://example.com')).toBe('https://icons.duckduckgo.com/ip3/example.com.ico')
  })

  it('should handle array input and use the first element', () => {
    expect(getDomainFavicon(['http://example.com', 'http://another.com'])).toBe('https://icons.duckduckgo.com/ip3/example.com.ico')
  })

  it('should correctly extract hostname from a complex URL', () => {
    expect(getDomainFavicon('https://www.example.com/path?query=123')).toBe('https://icons.duckduckgo.com/ip3/www.example.com.ico')
  })
})

describe('safeUrl', () => {
  it('should return undefined for invalid URLs', () => {
    expect(safeUrl('invalid-url')).toBeUndefined()
  })

  it('should return a URL object for valid URLs', () => {
    const result = safeUrl('http://example.com')
    expect(result).toBeInstanceOf(URL)
    expect(result?.toString()).toBe('http://example.com/')
  })

  it('should return undefined for undefined or empty input', () => {
    expect(safeUrl(undefined)).toBeUndefined()
    expect(safeUrl('')).toBeUndefined()
  })
})
