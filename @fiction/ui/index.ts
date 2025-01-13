import type { FictionApp, FictionPluginSettings, vue } from '@fiction/core/index.js'
import type { Config as TailwindConfig } from 'tailwindcss'
import { FictionPlugin, safeDirname } from '@fiction/core/index.js'
import { tailwindVarColorScheme } from '@fiction/core/utils/colors.js'
import twContainerQueries from '@tailwindcss/container-queries'
import twForms from '@tailwindcss/forms'
import twTypography from '@tailwindcss/typography'
import { inputs } from './inputs/index.js'

export * from './inputs/index.js'
export * from './utils/utils.js'

type FictionUiSettings = {
  apps: FictionApp[]
  Logo?: vue.Component
  AdminPage?: vue.Component
  AdminWrap?: vue.Component
} & FictionPluginSettings

export class FictionUi extends FictionPlugin<FictionUiSettings> {
  apps: FictionApp[] = this.settings.apps || []
  ui: Record<string, vue.Component> = inputs
  Logo = this.settings.Logo
  AdminPage = this.settings.AdminPage
  AdminWrap = this.settings.AdminWrap
  constructor(settings: FictionUiSettings) {
    super('ui', { root: safeDirname(import.meta.url), ...settings })

    this.apps.forEach((app) => {
      app.addTailwindConfig(this.tailwindConfig())
    })
  }

  tailwindConfig(): Partial<TailwindConfig> {
    return {
      darkMode: ['variant', ['&:not(.light *)', '.light .dark &']],
      content: [`${this.settings.root}/*.vue`, `${this.settings.root}/*.ts`],
      plugins: [twForms, twContainerQueries, twTypography],

      theme: {
        extend: {
          fontFamily: {
            sans: [
              `var(--font-family-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji")`,
            ],
            serif: [
              `var(--font-family-serif, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif)`,
            ],
            mono: [
              `var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)`,
            ],
          },

          colors: {
            transparent: 'transparent',
            primary: tailwindVarColorScheme({ variable: 'primary', color: 'blue' }),
            theme: tailwindVarColorScheme({ variable: 'theme', color: 'gray' }),
          },

          typography: (args: any) => {
            const { theme } = args as { theme: (key: string) => string }
            return {
              theme: {
                css: {
                  '--tw-prose-body': theme('colors.theme[800]'),
                  '--tw-prose-headings': theme('colors.theme[900]'),
                  '--tw-prose-lead': theme('colors.theme[700]'),
                  '--tw-prose-links': theme('colors.theme[900]'),
                  '--tw-prose-bold': theme('colors.theme[900]'),
                  '--tw-prose-counters': theme('colors.theme[600]'),
                  '--tw-prose-bullets': theme('colors.theme[400]'),
                  '--tw-prose-hr': theme('colors.theme[300]'),
                  '--tw-prose-quotes': theme('colors.theme[900]'),
                  '--tw-prose-quote-borders': theme('colors.theme[300]'),
                  '--tw-prose-captions': theme('colors.theme[700]'),
                  '--tw-prose-code': theme('colors.theme[900]'),
                  '--tw-prose-pre-code': theme('colors.theme[100]'),
                  '--tw-prose-pre-bg': theme('colors.theme[900]'),
                  '--tw-prose-th-borders': theme('colors.theme[300]'),
                  '--tw-prose-td-borders': theme('colors.theme[200]'),
                  '--tw-prose-invert-body': theme('colors.theme[200]'),
                  '--tw-prose-invert-headings': theme('colors.white'),
                  '--tw-prose-invert-lead': theme('colors.theme[300]'),
                  '--tw-prose-invert-links': theme('colors.white'),
                  '--tw-prose-invert-bold': theme('colors.white'),
                  '--tw-prose-invert-counters': theme('colors.theme[400]'),
                  '--tw-prose-invert-bullets': theme('colors.theme[600]'),
                  '--tw-prose-invert-hr': theme('colors.theme[700]'),
                  '--tw-prose-invert-quotes': theme('colors.theme[100]'),
                  '--tw-prose-invert-quote-borders': theme('colors.theme[700]'),
                  '--tw-prose-invert-captions': theme('colors.theme[400]'),
                  '--tw-prose-invert-code': theme('colors.white'),
                  '--tw-prose-invert-pre-code': theme('colors.theme[300]'),
                  '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
                  '--tw-prose-invert-th-borders': theme('colors.theme[600]'),
                  '--tw-prose-invert-td-borders': theme('colors.theme[700]'),
                },
              },
            }
          },
        },
      },
    }
  }
}
