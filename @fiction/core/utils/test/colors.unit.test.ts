import { describe, expect, it } from 'vitest'
import { colorList, getColorScheme, hexToRgbString, tailwindVarColorScheme } from '../colors'

describe('hexToRgbString', () => {
  it('converts hex to RGB correctly', () => {
    expect(hexToRgbString('#ffffff')).toBe('255 255 255')
    expect(hexToRgbString('000000')).toBe('0 0 0')
    expect(hexToRgbString('#FF0000')).toBe('255 0 0')
  })

  it('returns undefined for invalid hex', () => {
    expect(hexToRgbString('G12345')).toBeUndefined()
    expect(hexToRgbString('#1234567')).toBeUndefined() // Too long
    expect(hexToRgbString('#12G')).toBeUndefined() // Not a valid hex character
  })
})

describe('getColorScheme', () => {
  it('returns the color scheme in RGB format by default', () => {
    const scheme = getColorScheme('orange')
    expect(scheme[50]).toBe('255 247 237') // Adjust based on actual hexToRgbString output
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
    expect(scheme[50]).toBe(hexToRgbString(colorList.slate[950])) // Use actual hexToRgbString logic
    expect(scheme[950]).toBe(hexToRgbString(colorList.slate[50]))
  })
})

describe('colors', () => {
  it('gets correct tailwind config', async () => {
    const result = tailwindVarColorScheme({ variable: 'foo', color: 'slate' })

    expect(result).toMatchInlineSnapshot(`
      {
        "0": "rgb(var(--foo-0, 255 255 255) / <alpha-value>)",
        "100": "rgb(var(--foo-100, 226 230 239) / <alpha-value>)",
        "1000": "rgb(var(--foo-1000, 0 0 0) / <alpha-value>)",
        "200": "rgb(var(--foo-200, 197 202 212) / <alpha-value>)",
        "25": "rgb(var(--foo-25, 247 250 252) / <alpha-value>)",
        "300": "rgb(var(--foo-300, 166 173 185) / <alpha-value>)",
        "400": "rgb(var(--foo-400, 126 137 158) / <alpha-value>)",
        "50": "rgb(var(--foo-50, 243 246 249) / <alpha-value>)",
        "500": "rgb(var(--foo-500, 94 110 133) / <alpha-value>)",
        "600": "rgb(var(--foo-600, 60 74 95) / <alpha-value>)",
        "700": "rgb(var(--foo-700, 45 55 72) / <alpha-value>)",
        "800": "rgb(var(--foo-800, 32 40 56) / <alpha-value>)",
        "900": "rgb(var(--foo-900, 22 29 47) / <alpha-value>)",
        "950": "rgb(var(--foo-950, 13 20 36) / <alpha-value>)",
        "975": "rgb(var(--foo-975, 10 15 29) / <alpha-value>)",
        "DEFAULT": "rgb(var(--foo-500, 94 110 133) / <alpha-value>)",
      }
    `)

    expect(result[0]).not.toContain('undefined')
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
