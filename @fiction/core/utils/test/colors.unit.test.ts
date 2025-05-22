import type { GradientSetting } from '../../schemas'
import { describe, expect, it } from 'vitest'
import { colorList, getColorScheme, getGradientCss, hexToRgbString, normalizeColor, tailwindVarColorScheme } from '../colors'

describe('getGradientCss', () => {
  it('handles empty/invalid inputs', () => {
    expect(getGradientCss()).toBe('')
    expect(getGradientCss({})).toBe('')
    expect(getGradientCss({ stops: [] })).toBe('')
  })

  it('handles direct colors with opacity', () => {
    const gradient: GradientSetting = {
      angle: 45,
      stops: [
        { color: '#FF0000', position: 0, opacity: 0.5 },
        { color: '#0000FF', position: 100 },
      ],
    }
    expect(getGradientCss(gradient)).toBe(
      'linear-gradient(45deg, rgba(255 0 0 / 0.50) 0%, rgba(0 0 255 / 1.00) 100%)',
    )
  })

  it('handles theme-based colors', () => {
    const gradient: GradientSetting = {
      angle: 90,
      stops: [
        { theme: 'blue', scale: 500, position: 0 },
        { theme: 'emerald', scale: 600, position: 100, opacity: 0.8 },
      ],
    }
    // Using the known RGB values from our color scheme
    expect(getGradientCss(gradient)).toBe(
      'linear-gradient(90deg, rgba(59 130 246 / 1.00) 0%, rgba(5 150 105 / 0.80) 100%)',
    )
  })

  it('duplicates single stop for solid gradients', () => {
    const gradient: GradientSetting = {
      angle: 180,
      stops: [{ color: '#FF0000' }],
    }
    expect(getGradientCss(gradient)).toBe(
      'linear-gradient(180deg, rgba(255 0 0 / 1.00), rgba(255 0 0 / 1.00))',
    )
  })

  it('uses default angle when not specified', () => {
    const gradient: GradientSetting = {
      stops: [
        { color: '#FF0000' },
        { color: '#0000FF' },
      ],
    }
    expect(getGradientCss(gradient)).toBe(
      'linear-gradient(90deg, rgba(255 0 0 / 1.00), rgba(0 0 255 / 1.00))',
    )
  })

  it('forces 90deg when noAngle option is true', () => {
    const gradient: GradientSetting = {
      angle: 45,
      stops: [
        { color: '#FF0000' },
        { color: '#0000FF' },
      ],
    }
    expect(getGradientCss(gradient, { noAngle: true })).toBe(
      'linear-gradient(90deg, rgba(255 0 0 / 1.00), rgba(0 0 255 / 1.00))',
    )
  })

  it('handles mixed theme and direct colors', () => {
    const gradient: GradientSetting = {
      angle: 135,
      stops: [
        { theme: 'blue', scale: 500, position: 0 },
        { color: '#00FF00', position: 50, opacity: 0.5 },
        { theme: 'emerald', scale: 600, position: 100 },
      ],
    }
    expect(getGradientCss(gradient)).toBe(
      'linear-gradient(135deg, rgba(59 130 246 / 1.00) 0%, rgba(0 255 0 / 0.50) 50%, rgba(5 150 105 / 1.00) 100%)',
    )
  })

  it('uses default scale (500) for theme colors when not specified', () => {
    const gradient: GradientSetting = {
      stops: [
        { theme: 'blue', position: 0 },
        { theme: 'emerald', position: 100 },
      ],
    }
    expect(getGradientCss(gradient)).toBe(
      'linear-gradient(90deg, rgba(59 130 246 / 1.00) 0%, rgba(16 185 129 / 1.00) 100%)',
    )
  })
})

describe('normalizeColor', () => {
  it('handles hex colors', () => {
    expect(normalizeColor({ color: '#FF0000' })).toBe('rgba(255 0 0 / 1.00)')
    expect(normalizeColor({ color: '#00FF00' })).toBe('rgba(0 255 0 / 1.00)')
    expect(normalizeColor({ color: '#0000FF' })).toBe('rgba(0 0 255 / 1.00)')
    expect(normalizeColor({ color: '#123' })).toBe('rgba(17 34 51 / 1.00)')
  })

  it('handles rgb colors', () => {
    expect(normalizeColor({ color: 'rgb(255, 0, 0)' })).toBe('rgba(255 0 0 / 1.00)')
    expect(normalizeColor({ color: 'rgb(0, 255, 0)' })).toBe('rgba(0 255 0 / 1.00)')
    expect(normalizeColor({ color: 'rgb(0, 0, 255)' })).toBe('rgba(0 0 255 / 1.00)')
  })

  it('handles rgba colors', () => {
    expect(normalizeColor({ color: 'rgba(255, 0, 0, 0.5)' })).toBe('rgba(255 0 0 / 0.50)')
    expect(normalizeColor({ color: 'rgba(0, 255, 0, 0.3)' })).toBe('rgba(0 255 0 / 0.30)')
    expect(normalizeColor({ color: 'rgba(0, 0, 255, 0.7)' })).toBe('rgba(0 0 255 / 0.70)')
  })

  it('handles named colors', () => {
    expect(normalizeColor({ color: 'red' })).toBe('rgba(255 0 0 / 1.00)')
    expect(normalizeColor({ color: 'green' })).toBe('rgba(0 128 0 / 1.00)')
    expect(normalizeColor({ color: 'blue' })).toBe('rgba(0 0 255 / 1.00)')
  })

  it('handles custom opacity', () => {
    expect(normalizeColor({ color: '#FF0000', opacity: 0.5 })).toBe('rgba(255 0 0 / 0.50)')
    expect(normalizeColor({ color: 'rgb(0, 255, 0)', opacity: 0.3 })).toBe('rgba(0 255 0 / 0.30)')
    expect(normalizeColor({ color: 'blue', opacity: 0.7 })).toBe('rgba(0 0 255 / 0.70)')
  })

  it('clamps values to valid ranges', () => {
    expect(normalizeColor({ color: 'rgb(300, -50, 1000)' })).toBe('rgba(255 0 255 / 1.00)')
    expect(normalizeColor({ color: 'rgba(100, 100, 100, 1.5)' })).toBe('rgba(100 100 100 / 1.00)')
    expect(normalizeColor({ color: 'rgb(100, 100, 100)', opacity: 1.5 })).toBe('rgba(100 100 100 / 1.00)')
  })

  it('handles whitespace and capitalization', () => {
    expect(normalizeColor({ color: ' #FF0000 ' })).toBe('rgba(255 0 0 / 1.00)')
    expect(normalizeColor({ color: 'RGB(0, 255, 0)' })).toBe('rgba(0 255 0 / 1.00)')
    expect(normalizeColor({ color: '  Red  ' })).toBe('rgba(255 0 0 / 1.00)')
  })

  it('defaults to black for unknown colors', () => {
    expect(normalizeColor({ color: 'notacolor' })).toBe('rgba(0 0 0 / 1.00)')
  })
})

describe('hexToRgbString', () => {
  it('converts hex to RGB correctly', () => {
    expect(hexToRgbString('#ffffff')).toBe('255 255 255')
    expect(hexToRgbString('000000')).toBe('0 0 0')
    expect(hexToRgbString('#FF0000')).toBe('255 0 0')
  })

  it('returns 0 0 0 for invalid hex', () => {
    expect(hexToRgbString('G12345')).toBe('0 0 0')
    expect(hexToRgbString('#1234567')).toBe('0 0 0') // Too long
    expect(hexToRgbString('#12G')).toBe('0 0 0') // Not a valid hex character
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
    const scheme = getColorScheme('slate', { invert: true })
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
        "0": "rgb(var(--foo-0, 255 255 255) / var(--foo-0-alpha, <alpha-value>))",
        "100": "rgb(var(--foo-100, 226 230 239) / var(--foo-100-alpha, <alpha-value>))",
        "1000": "rgb(var(--foo-1000, 0 0 0) / var(--foo-1000-alpha, <alpha-value>))",
        "200": "rgb(var(--foo-200, 197 202 212) / var(--foo-200-alpha, <alpha-value>))",
        "25": "rgb(var(--foo-25, 247 250 252) / var(--foo-25-alpha, <alpha-value>))",
        "300": "rgb(var(--foo-300, 166 173 185) / var(--foo-300-alpha, <alpha-value>))",
        "400": "rgb(var(--foo-400, 126 137 158) / var(--foo-400-alpha, <alpha-value>))",
        "50": "rgb(var(--foo-50, 243 246 249) / var(--foo-50-alpha, <alpha-value>))",
        "500": "rgb(var(--foo-500, 94 110 133) / var(--foo-500-alpha, <alpha-value>))",
        "600": "rgb(var(--foo-600, 60 74 95) / var(--foo-600-alpha, <alpha-value>))",
        "700": "rgb(var(--foo-700, 45 55 72) / var(--foo-700-alpha, <alpha-value>))",
        "800": "rgb(var(--foo-800, 32 40 56) / var(--foo-800-alpha, <alpha-value>))",
        "900": "rgb(var(--foo-900, 22 29 47) / var(--foo-900-alpha, <alpha-value>))",
        "950": "rgb(var(--foo-950, 13 20 36) / var(--foo-950-alpha, <alpha-value>))",
        "975": "rgb(var(--foo-975, 10 15 29) / var(--foo-975-alpha, <alpha-value>))",
        "DEFAULT": "rgb(var(--foo-500, 94 110 133) / var(--foo-500-alpha, <alpha-value>))",
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
    expect(result[50]).toBe('rgb(var(--color-slate-50, 248 250 252) / var(--color-slate-50-alpha, <alpha-value>))')
    expect(result[500]).toBe('rgb(var(--color-slate-500, 100 116 139) / var(--color-slate-500-alpha, <alpha-value>))')
    expect(result.DEFAULT).toBe('rgb(var(--color-slate-500, 100 116 139) / var(--color-slate-500-alpha, <alpha-value>))')

    // Optionally, you could test the entire output if necessary, but these key checks should suffice for format verification
  })
})
