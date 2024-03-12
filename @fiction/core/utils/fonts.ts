import { toCamel } from './casing'
import { fonts } from './lib/fonts'
import { deepMerge } from './obj'

type ConfigVal = { fontKey?: string, fontKey2?: string, stack: 'monospace' | 'sans' | 'serif' }
export type FontConfig = {
  mono?: ConfigVal
  input?: ConfigVal
  title?: ConfigVal
  sans?: ConfigVal
  body?: ConfigVal
  serif?: ConfigVal
}
export function getThemeFontConfig(fontConfig: FontConfig) {
  const stacks = {
    monospace: `'Nimbus Mono PS', 'Courier New', monospace`,
    serif: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif`,
    sans: `Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif`,
  }

  const config = deepMerge<FontConfig>([{
    mono: { stack: 'monospace', fontKey2: 'DM Mono' },
    body: { stack: 'serif' },
    sans: { stack: 'sans', fontKey2: 'Roboto' },
    input: { stack: 'sans', fontKey2: 'Roboto' },
    title: { stack: 'sans', fontKey2: 'Roboto' },
  }, fontConfig])

  const configStacks = Object.fromEntries(Object.entries(config).map(([key, value]) => {
    const fontList = [stacks[value.stack || '']]

    if (value.fontKey2)
      fontList.unshift(`'${value.fontKey2}'`)

    if (value.fontKey)
      fontList.unshift(`'${value.fontKey}'`)

    const deduped = [...new Set(fontList)]
    return [key, deduped.join(', ')]
  })) as Record<keyof FontConfig, string>

  const fontKeys = Object.values(config).flatMap(_ => [_.fontKey, _.fontKey2]).filter(Boolean) as string[]

  const fontsUrl = createGoogleFontsLink({ fontKeys })

  return { ...configStacks, fontsUrl }
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

export function createGoogleFontsLink(args: { fontKeys: string[], fonts?: FontEntry[] }) {
  const deduped = [...new Set(args.fontKeys || [])]
  const fontEntries = args.fonts || fonts

  const fontParams = deduped.map((fontKey) => {
    const normalizedFontKey = toCamel(fontKey)

    const font = fontEntries.find(f => toCamel(f.family) === normalizedFontKey)
    if (!font)
      return ''

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
