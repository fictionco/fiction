import { describe, expect, it } from 'vitest'
import type { FontEntry } from '../fonts'
import { createGoogleFontsLink, variantToGoogleFontsFormat } from '../fonts'

// Sample data similar to what you might have in './lib/fonts'
const fonts = [
  {
    family: 'Roboto',
    variants: ['100', '100italic', '300', '300italic', 'regular', 'italic', '700'],
  },
  {
    family: 'Open Sans',
    variants: ['300', 'regular', '700italic', '900'],
  },
] as FontEntry[]

describe('variantToGoogleFontsFormat', () => {
  it('should convert regular variants correctly', () => {
    expect(variantToGoogleFontsFormat('100')).toBe('0,100')
    expect(variantToGoogleFontsFormat('regular')).toBe('0,400')
  })

  it('should convert italic variants correctly', () => {
    expect(variantToGoogleFontsFormat('100italic')).toBe('1,100')
    expect(variantToGoogleFontsFormat('700italic')).toBe('1,700')
  })
})

describe('createGoogleFontsLink', () => {
  it('should return correct URL for valid font keys', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: ['Roboto', 'Open Sans'] })
    const expectedLink = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,1..1000;1,1..1000&family=Open+Sans:ital,wght@0,1..1000;1,1..1000&display=swap'
    expect(fontLink).toBe(expectedLink)
  })

  it('should encode spaces as plus signs in font family names', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: ['Open Sans'] })
    expect(fontLink).toContain('Open+Sans')
  })

  it('should return an empty string when no font keys are provided', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: [] })
    expect(fontLink).toBe('')
  })
})
