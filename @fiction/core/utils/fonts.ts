import type { FontFamily } from '../schemas/index.js'

export const safeStacks = {
  monospace: `'Nimbus Mono PS', 'Courier New', monospace`,
  serif: `Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif`,
  sans: `Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif`,
  system: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
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

class GoogleFontsUtility {
  private loadedFonts: Set<string> = new Set()

  public variantToGoogleFontsFormat(variant: string): string {
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
    const weightKey = variant.replace('italic', '').trim()
    const weight = weightMap[weightKey] || '400'
    return `${isItalic ? '1' : '0'},${weight}`
  }

  public createGoogleFontsLink(args: { fontFamilies: FontFamily[] }): string {
    const { fontFamilies } = args
    const deduped = [...new Set(fontFamilies.map(_ => _.family))].filter(Boolean)

    const fontParams = deduped.map((familyName) => {
      const family = familyName?.replace(/ /g, '+')
      return `${family}:wght@300;400;500;600;700;800;900`
    }).filter(Boolean).join('&family=')

    return fontParams ? `https://fonts.googleapis.com/css2?family=${fontParams}&display=swap` : ''
  }

  public async loadFont(fontFamily: FontFamily): Promise<void> {
    const { family = '' } = fontFamily

    if (!family || Object.keys(safeStacks).includes(family)) {
      return
    }

    if (typeof window === 'undefined' || this.loadedFonts.has(family)) {
      return
    }

    const link = document.createElement('link')
    link.href = this.createGoogleFontsLink({
      fontFamilies: [fontFamily],
    })
    link.rel = 'stylesheet'
    link.id = `google-font-${family.replace(/\s+/g, '-').toLowerCase()}`
    document.head.appendChild(link)
    this.loadedFonts.add(family)
  }

  public isFontLoaded(fontFamily: FontFamily): boolean {
    const { family = '' } = fontFamily
    return this.loadedFonts.has(family)
  }

  public reset() {
    if (typeof document !== 'undefined') {
      const links = document.head.querySelectorAll('link[id^="google-font-"]')
      links.forEach(link => link.remove())
    }

    this.loadedFonts.clear()
  }
}

export const googleFontsUtility = new GoogleFontsUtility()
