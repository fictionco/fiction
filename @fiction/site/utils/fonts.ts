import { createGoogleFontsLink, safeStacks } from '@fiction/core/utils/fonts'
import { deepMerge } from '@fiction/core/utils/obj'
import { vue } from '@fiction/core'
import type { Site } from '..'

export type FontConfigVal = { fontKey?: string, stack: 'monospace' | 'sans' | 'serif' }
export type FontConfig = {
  mono?: FontConfigVal
  input?: FontConfigVal
  title?: FontConfigVal
  sans?: FontConfigVal
  body?: FontConfigVal
  serif?: FontConfigVal
  highlight?: FontConfigVal
  [key: string]: FontConfigVal | undefined
}

const defaultSiteFonts: FontConfig = {
  mono: { fontKey: 'DM Mono', stack: 'monospace' },
  input: { fontKey: 'DM Mono', stack: 'sans' },
  title: { fontKey: 'Poppins', stack: 'sans' },
  sans: { fontKey: 'Plus+Jakarta+Sans', stack: 'sans' },
  body: { stack: 'serif' },
  serif: { stack: 'serif' },
  highlight: { fontKey: 'Caveat', stack: 'sans' },
}

export function fontFamilyByKey(key?: string) {
  const k = key || 'body'
  if (defaultSiteFonts[k]) {
    return `var(--font-family-${k})`
  }
  else {
    return k
  }
}

export function activeSiteFont(site?: Site) {
  return vue.computed(() => {
    const userFonts = site?.userFonts.value || {}
    const themeFonts = site?.fullConfig.value?.fonts || {}

    const config = deepMerge<FontConfig>([defaultSiteFonts, themeFonts])

    for (const key in userFonts) {
      if (!config[key]) {
        config[key] = userFonts[key]
      }
    }

    const stacks = Object.fromEntries(Object.entries(config).map(([key, value]) => {
      if (!value)
        return [key, '']

      const fontList = [safeStacks[value.stack || '']]

      if (value.fontKey)
        fontList.unshift(`'${value.fontKey}'`)

      const deduped = [...new Set(fontList)]
      return [key, deduped.join(', ')]
    })) as Record<keyof FontConfig, string>

    const fontKeys = Object.values(config).flatMap(_ => [_?.fontKey]).filter(Boolean) as string[]

    const fontsUrl = createGoogleFontsLink({ fontKeys })

    return { stacks, fontsUrl }
  })
}
