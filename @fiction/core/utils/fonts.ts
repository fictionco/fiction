import { toCamel } from './casing'
import { fonts } from './lib/fonts'

export const safeStacks = {
  monospace: `'Nimbus Mono PS', 'Courier New', monospace`,
  serif: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif`,
  sans: `Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif`,
  system: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
}

export type FontEntry = {
  category: string
  family: string
  files: Record<string, string>
  subsets: string[]
  variants: string[]
}

export function variantToGoogleFontsFormat(variant: string): string {
  const weightMap: Record<string, string> = {
    100: '100',
    200: '200',
    300: '300',
    regular: '400',
    500: '500',
    600: '600',
    700: '700',
    800: '800',
    900: '900',
  }
  const isItalic = variant.includes('italic')
  const weightKey = variant.replace('italic', '').trim() // Trim to remove extra spaces after replacement
  const weight = weightMap[weightKey] || '400' // Default to '400' if not found

  return `${isItalic ? '1' : '0'},${weight}`
}

// export function createGoogleFontsLink(args: { fontKeys: string[] }) {
//   const deduped = [...new Set(args.fontKeys || [])]

//   const fontParams = deduped.map((fontKey) => {
//     const family = fontKey.replace(/ /g, '+')
//     // Use variable font syntax to include all weights and styles
//     return `${family}`
//   }).filter(Boolean).join('&family=')

//   return fontParams ? `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap` : ''
// }

export function createGoogleFontsLink(args: { fontKeys: string[], fonts?: FontEntry[] }) {
  const deduped = [...new Set(args.fontKeys || [])]
  const fontEntries = args.fonts || fonts

  const fontParams = deduped.map((fontKey) => {
    const normalizedFontKey = toCamel(fontKey)

    const font = fontEntries.find(f => toCamel(f.family) === normalizedFontKey)
    if (!font) {
      console.error(`Font family not found: ${fontKey} (${normalizedFontKey})`)
      return ''
    }

    // Process each variant and convert to the correct format
    const variants = font.variants
      .map(variantToGoogleFontsFormat)
      .sort()
      .join(';')

    const family = font.family.replace(/ /g, '+')
    return `${family}:ital,wght@${variants}`
  }).filter(Boolean).join('&family=')

  return fontParams ? `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap` : ''
}
