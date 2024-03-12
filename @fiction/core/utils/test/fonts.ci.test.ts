import { describe, expect, it } from 'vitest'
import type { FontEntry } from '../fonts'
import { createGoogleFontsLink, getThemeFontConfig, variantToGoogleFontsFormat } from '../fonts'

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
    const fontLink = createGoogleFontsLink({ fontKeys: ['Roboto', 'Open Sans'], fonts })
    const expectedLink = 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,700;1,100;1,300;1,400&family=Open+Sans:ital,wght@0,300;0,400;0,900;1,700&display=swap'
    expect(fontLink).toBe(expectedLink)
  })

  it('should handle non-existent font keys gracefully', () => {
    const fontLink = createGoogleFontsLink({ fontKeys: ['Non Existent Font'] })
    expect(fontLink).toBe('')
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

describe('getThemeFontConfig', () => {
  it('should correctly handle font config', async () => {
    const result = getThemeFontConfig({
      mono: { fontKey: 'DM Mono', stack: 'monospace' },
      input: { fontKey: 'DM Mono', stack: 'sans' },
      title: { fontKey: 'Poppins', stack: 'sans' },
      sans: { stack: 'sans' },
      body: { fontKey: 'Source Serif 4', stack: 'serif' },
      serif: { stack: 'serif' },
    })
    expect(result.mono).toContain('DM Mono')
    expect(result.body).toContain('Source Serif 4')
    const fontsUrl = result.fontsUrl
    expect(fontsUrl).toBeTruthy()
    expect(result).toMatchInlineSnapshot(`
      {
        "body": "'Source Serif 4', Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
        "getFontsUrl": [Function],
        "input": "'DM Mono', 'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "mono": "'DM Mono', 'Nimbus Mono PS', 'Courier New', monospace",
        "sans": "'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "serif": "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
        "title": "'Poppins', 'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
      }
    `)
  })
  it('returns default values when no fontConfig is provided', async () => {
    const result = getThemeFontConfig({})
    expect(result.mono).toMatchInlineSnapshot(`"'DM Mono', 'Nimbus Mono PS', 'Courier New', monospace"`)
    expect(result.body).toMatchInlineSnapshot(`"Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif"`)
    const fontsUrl = result.fontsUrl
    expect(fontsUrl).toMatchInlineSnapshot(`"https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"`)
  })

  it('returns custom font stacks when fontConfig is provided', async () => {
    const fontConfig = {
      mono: { fontKey: 'Custom Mono', stack: 'monospace' },
      body: { fontKey: 'Custom Serif', stack: 'serif' },
    } as const
    const result = getThemeFontConfig(fontConfig)
    expect(result.mono).toContain('Custom Mono')
    expect(result.body).toContain('Custom Serif')
    const fontsUrl = result.fontsUrl
    expect(fontsUrl).toMatchInlineSnapshot(`"https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"`)
    expect(result).toMatchInlineSnapshot(`
      {
        "body": "'Custom Serif', Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
        "getFontsUrl": [Function],
        "input": "'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "mono": "'Custom Mono', 'DM Mono', 'Nimbus Mono PS', 'Courier New', monospace",
        "sans": "'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "title": "'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
      }
    `)
  })
})
