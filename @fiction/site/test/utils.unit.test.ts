import { describe, expect, it } from 'vitest'
import { extractIdFromUrl } from '../util'

describe('extractIdFromUrl', () => {
  it('extracts ids from a well-formed URL', () => {
    const url = 'http://localhost:4444/admin/preview/theme-id/minimal/site-id/example-site'
    const ids = extractIdFromUrl(url)
    expect(ids).toEqual({ themeId: 'minimal', siteId: 'example-site' })
  })

  it('ignores non-id parts of the URL', () => {
    const url = 'http://localhost:4444/admin/preview/nonid/minimal/someotherid/example-site'
    const ids = extractIdFromUrl(url)
    expect(ids).toEqual({})
  })

  it('returns an empty object for URLs without ids', () => {
    const url = 'http://localhost:4444/admin/preview/'
    const ids = extractIdFromUrl(url)
    expect(ids).toEqual({})
  })

  it('handles URLs with missing values for known ids', () => {
    const url = 'http://localhost:4444/admin/preview/theme-id/'
    const ids = extractIdFromUrl(url)
    expect(ids).toEqual({ themeId: undefined })
  })

  it('handles URLs with extra slashes', () => {
    const url = 'http://localhost:4444/admin/preview///theme-id/minimal//site-id/example-site//'
    const ids = extractIdFromUrl(url)
    expect(ids).toEqual({ themeId: 'minimal', siteId: 'example-site' })
  })

  it('handles case sensitivity in ids', () => {
    const url = 'http://localhost:4444/admin/preview/Theme-Id/Minimal/Site-Id/Example-Site'
    const ids = extractIdFromUrl(url)
    expect(ids).toEqual({ themeId: 'Minimal', siteId: 'Example-Site' })
  })
})
