/**
 * @vitest-environment happy-dom
 */

import { beforeEach, describe, expect, it } from 'vitest'
import { createGoogleFontsLink, googleFontsUtility, variantToGoogleFontsFormat } from '../fonts'
import { fonts } from '../lib/fontList'

describe('googleFontsUtility', () => {
  beforeEach(() => {
    googleFontsUtility.reset()
  })

  describe('variantToGoogleFontsFormat', () => {
    it('should convert regular variants correctly', () => {
      expect(googleFontsUtility.variantToGoogleFontsFormat('100')).toBe('0,100')
      expect(googleFontsUtility.variantToGoogleFontsFormat('regular')).toBe('0,400')
    })

    it('should convert italic variants correctly', () => {
      expect(googleFontsUtility.variantToGoogleFontsFormat('100italic')).toBe('1,100')
      expect(googleFontsUtility.variantToGoogleFontsFormat('700italic')).toBe('1,700')
    })
  })

  describe('createGoogleFontsLink', () => {
    it('should return correct URL for valid font keys', () => {
      const fontLink = googleFontsUtility.createGoogleFontsLink({ fontKeys: ['Roboto', 'Open Sans'] })
      expect(fontLink).toContain('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap')
    })

    it('should encode spaces as plus signs in font family names', () => {
      const fontLink = googleFontsUtility.createGoogleFontsLink({ fontKeys: ['Open Sans'] })
      expect(fontLink).toContain('Open+Sans')
    })

    it('should return an empty string when no font keys are provided', () => {
      const fontLink = googleFontsUtility.createGoogleFontsLink({ fontKeys: [] })
      expect(fontLink).toBe('')
    })
  })

  it('should load fonts correctly', async () => {
    await googleFontsUtility.loadFont('Roboto')
    let linkElement = document.querySelector('link#google-font-roboto')
    expect(linkElement).not.toBeNull()
    expect(linkElement?.getAttribute('href')).toContain('Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900')
    expect(linkElement?.getAttribute('rel')).toBe('stylesheet')

    // Should not load again
    await googleFontsUtility.loadFont('Roboto')
    expect(document.querySelectorAll('link#google-font-roboto').length).toBe(1)

    await googleFontsUtility.loadFont('Open Sans')
    linkElement = document.querySelector('link#google-font-open-sans')
    expect(linkElement).not.toBeNull()
    expect(linkElement?.getAttribute('href')).toContain('Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800')
    expect(linkElement?.getAttribute('rel')).toBe('stylesheet')
  })

  it('should check if a font is loaded', async () => {
    await googleFontsUtility.loadFont('Roboto')
    expect(googleFontsUtility.isFontLoaded('Roboto')).toBe(true)
    expect(googleFontsUtility.isFontLoaded('Open Sans')).toBe(false)
  })
})

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
    const fontLink = createGoogleFontsLink({ fontKeys: ['Roboto', 'Open Sans'], fonts })
    const expectedLink = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
    expect(fontLink).toBe(expectedLink)
  })

  it('should encode spaces as plus signs in font family names', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: ['Open Sans'], fonts })
    expect(fontLink).toContain('Open+Sans')
  })

  it('should return an empty string when no font keys are provided', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: [], fonts })
    expect(fontLink).toBe('')
  })
})
