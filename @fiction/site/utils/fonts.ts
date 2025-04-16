import type { FontFamily } from '@fiction/core'
import type { Site } from '..'
import { vue } from '@fiction/core'
import { googleFontsUtility, safeStacks } from '@fiction/core/utils/fonts'
import { deepMerge } from '@fiction/core/utils/obj'

export type FontConfig = {
  mono?: FontFamily
  input?: FontFamily
  title?: FontFamily
  sans?: FontFamily
  body?: FontFamily
  serif?: FontFamily
  highlight?: FontFamily
  [key: string]: FontFamily | undefined
}

const defaultSiteFonts: FontConfig = {
  mono: { family: 'DM Mono', stack: 'monospace' },
  input: { family: 'DM Mono', stack: 'sans' },
  title: { stack: 'sans' },
  sans: { stack: 'sans' },
  body: { stack: 'serif' },
  serif: { stack: 'serif' },
  highlight: { family: 'Caveat', stack: 'sans' },
}

export function fontFamilyByKey(key?: string) {
  const k = key || 'body'
  if (defaultSiteFonts[k]) {
    return `var(--font-family-${k})`
  }
  else {
    return k.replace(/\+/g, ' ')
  }
}

export function activeSiteFont(site?: Site) {
  return vue.computed(() => {
    const userFonts = site?.userFonts.value || {}
    const themeFonts = site?.fullConfig.value?.standard?.fonts || {}

    const config = deepMerge<FontConfig>([defaultSiteFonts, themeFonts])

    for (const key in userFonts) {
      if (!config[key]) {
        config[key] = userFonts[key]
      }
    }

    const stacks = Object.fromEntries(Object.entries(config).map(([key, value]) => {
      if (!value)
        return [key, '']

      const fontList = value.stack ? [safeStacks[value.stack]] : [safeStacks.sans]

      if (value.family)
        fontList.unshift(`'${value.family}'`)

      const deduped = [...new Set(fontList)]
      return [key, deduped.join(', ')]
    })) as Record<keyof FontConfig, string>

    const fontFamilies = Object.values(config).filter(f => f?.family) as FontFamily[]

    // Use GoogleFontsUtility to create the fonts URL
    const fontsUrl = googleFontsUtility.createGoogleFontsLink({ fontFamilies })

    return { stacks, fontsUrl }
  })
}
