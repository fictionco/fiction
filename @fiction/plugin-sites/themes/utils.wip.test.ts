import { describe, expect, it } from 'vitest'
import { extractIdFromUrl, incrementSlugId } from '../util'

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

describe('incrementSlugId', () => {
  it('should handle an empty viewId', () => {
    expect(incrementSlugId()).toBe('view-1')
  })

  it('should handle a viewId without a numeric part', () => {
    expect(incrementSlugId('page')).toBe('page-1')
  })

  it('should increment a numeric part if present', () => {
    expect(incrementSlugId('page-2')).toBe('page-3')
  })

  it('should append -1 if an alphabetic part is present without a numeric part', () => {
    expect(incrementSlugId('page-abc')).toBe('page-abc-1')
  })

  it('should increment the numeric part when both alphabetic and numeric parts are present', () => {
    expect(incrementSlugId('page-a-2')).toBe('page-a-3')
  })

  it('should handle numeric part at the end correctly', () => {
    expect(incrementSlugId('page-abc-10')).toBe('page-abc-11')
  })

  it('should handle double hyphens correctly', () => {
    expect(incrementSlugId('page--1')).toBe('page--2')
  })

  // Handling Multiple Numeric Parts
  it('should handle multiple numeric parts correctly', () => {
    expect(incrementSlugId('page-2-3')).toBe('page-2-4')
  })

  // Handling Non-Numeric Strings with Hyphens
  it('should handle non-numeric strings with hyphens correctly', () => {
    expect(incrementSlugId('page-abc-def')).toBe('page-abc-def-1')
  })

  // Handling Very Large Numbers
  it('should handle very large numbers correctly', () => {
    expect(incrementSlugId('page-99999')).toBe('page-100000')
  })

  // Handling Negative Numbers
  it('should handle two dashes correctly', () => {
    expect(incrementSlugId('page--2')).toBe('page--3')
  })

  // Handling Leading and Trailing Hyphens
  it('should handle leading hyphens correctly', () => {
    expect(incrementSlugId('-page')).toBe('-page-1')
  })
  it('should handle trailing hyphens correctly', () => {
    expect(incrementSlugId('page-')).toBe('page-1')
  })

  // Handling Non-String Inputs (for JavaScript compatibility)
  // Note: These tests are relevant if the function could be used in JavaScript.
  it('should handle non-string inputs gracefully', () => {
    // Assuming the function has been modified to handle any type as input
    expect(incrementSlugId(null as unknown as undefined)).toBe('view-1')
    expect(incrementSlugId(undefined)).toBe('view-1')
    expect(incrementSlugId(123 as unknown as string)).toBe('123-1')
  })

  // Handling Special Characters
  it('should handle special characters correctly', () => {
    expect(incrementSlugId('page-abc#@!-2')).toBe('page-abc#@!-3')
  })

  // Handling Only Numeric Input
  it('should handle only numeric input correctly', () => {
    expect(incrementSlugId('12345')).toBe('12345-1')
  })

  // Testing Idempotency
  it('should be idempotent for consistent results', () => {
    const firstRun = incrementSlugId('page-2')
    const secondRun = incrementSlugId(firstRun)
    expect(secondRun).toBe('page-4')
  })

  // Handling Complex Strings
  it('should handle complex strings with multiple hyphens and numbers', () => {
    expect(incrementSlugId('page-2x-3y-4')).toBe('page-2x-3y-5')
  })

  it('should prepend "old-" to slugs starting with an underscore', () => {
    expect(incrementSlugId('_home')).toBe('old-home')
  })

  it('should handle incrementing previously modified underscore slugs', () => {
    // Assuming an existing function or mechanism to track these "old-" prefixed slugs for increments
    const firstIncrement = incrementSlugId('_home') // 'old-home'
    const secondIncrement = incrementSlugId(firstIncrement) // Expected to increment if 'old-home' exists already
    expect(secondIncrement).toBe('old-home-1')
  })

  it('should increment the numeric part of a previously modified underscore slug', () => {
    expect(incrementSlugId('old-home-2')).toBe('old-home-3')
  })

  it('should append "-1" if a modified underscore slug does not end with a number', () => {
    expect(incrementSlugId('old-home')).toBe('old-home-1')
  })

  it('should handle complex underscore prefixed slugs', () => {
    expect(incrementSlugId('_page-2x-3y')).toBe('old-page-2x-3y')
  })

  it('should handle underscore prefixed numeric slugs correctly', () => {
    expect(incrementSlugId('_12345')).toBe('old-12345')
  })

  it('should handle underscore prefixed slugs with special characters', () => {
    expect(incrementSlugId('_page#@!')).toBe('old-page#@!')
  })
})
