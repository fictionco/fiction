import { describe, expect, it } from 'vitest'
import { colorList, getColorScheme, hexToRgb, tailwindVarColorScheme } from '../colors'

describe('hexToRgb', () => {
  it('converts hex to RGB correctly', () => {
    expect(hexToRgb('#ffffff')).toBe('255 255 255')
    expect(hexToRgb('000000')).toBe('0 0 0')
    expect(hexToRgb('#FF0000')).toBe('255 0 0')
  })

  it('returns undefined for invalid hex', () => {
    expect(hexToRgb('G12345')).toBeUndefined()
    expect(hexToRgb('#1234567')).toBeUndefined() // Too long
    expect(hexToRgb('#12G')).toBeUndefined() // Not a valid hex character
  })
})

describe('getColorScheme', () => {
  it('returns the color scheme in RGB format by default', () => {
    const scheme = getColorScheme('orange')
    expect(scheme[50]).toBe('255 247 237') // Adjust based on actual hexToRgb output
    expect(scheme[500]).toBe('249 115 22')
  })

  it('returns the color scheme in HEX format when specified', () => {
    const scheme = getColorScheme('orange', { outputFormat: 'hex' })
    expect(scheme[50]).toBe('#fff7ed')
    expect(scheme[500]).toBe('#f97316')
  })

  it('inverts the color scheme for dark mode', () => {
    const scheme = getColorScheme('slate', { isDarkMode: true })
    // Assuming inversion swaps the scheme end to end
    expect(scheme[50]).toBe(hexToRgb(colorList.slate[950])) // Use actual hexToRgb logic
    expect(scheme[950]).toBe(hexToRgb(colorList.slate[50]))
  })

  it('falls back to the default "slate" scheme if an unknown scheme ID is provided', () => {
    const scheme = getColorScheme('unknown')
    expect(scheme[50]).toBe('248 250 252') // Assuming default is RGB
    expect(scheme[500]).toBe('100 116 139')
  })
})

describe('colors', () => {
  it('gets correct tailwind config', async () => {
    const result = tailwindVarColorScheme({ variable: 'foo', color: 'slate' })

    expect(result).toMatchInlineSnapshot(`
      {
        "0": "rgb(var(--foo-0, undefined) / <alpha-value>)",
        "100": "rgb(var(--foo-100, undefined) / <alpha-value>)",
        "1000": "rgb(var(--foo-1000, undefined) / <alpha-value>)",
        "200": "rgb(var(--foo-200, undefined) / <alpha-value>)",
        "25": "rgb(var(--foo-25, undefined) / <alpha-value>)",
        "300": "rgb(var(--foo-300, undefined) / <alpha-value>)",
        "400": "rgb(var(--foo-400, undefined) / <alpha-value>)",
        "50": "rgb(var(--foo-50, undefined) / <alpha-value>)",
        "500": "rgb(var(--foo-500, undefined) / <alpha-value>)",
        "600": "rgb(var(--foo-600, undefined) / <alpha-value>)",
        "700": "rgb(var(--foo-700, undefined) / <alpha-value>)",
        "800": "rgb(var(--foo-800, undefined) / <alpha-value>)",
        "900": "rgb(var(--foo-900, undefined) / <alpha-value>)",
        "950": "rgb(var(--foo-950, undefined) / <alpha-value>)",
        "975": "rgb(var(--foo-975, undefined) / <alpha-value>)",
        "DEFAULT": "rgb(var(--foo-500, undefined) / <alpha-value>)",
      }
    `)
  })

  it('generates correct CSS variables for Tailwind', () => {
    const scheme = {
      50: '#f8fafc',
      500: '#64748b',
      900: '#0f172a',
    }
    const result = tailwindVarColorScheme({
      variable: 'color-slate',
      scheme,
    })

    // Check a few specific keys to ensure formatting is correct
    expect(result[50]).toBe('rgb(var(--color-slate-50, 248 250 252) / <alpha-value>)')
    expect(result[500]).toBe('rgb(var(--color-slate-500, 100 116 139) / <alpha-value>)')
    expect(result.DEFAULT).toBe('rgb(var(--color-slate-500, 100 116 139) / <alpha-value>)')

    // Optionally, you could test the entire output if necessary, but these key checks should suffice for format verification
  })
})
