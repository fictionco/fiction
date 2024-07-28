import type { FictionApp, FictionPluginSettings, vue } from '@fiction/core/index.js'
import { FictionPlugin, safeDirname } from '@fiction/core/index.js'
import twForms from '@tailwindcss/forms'
import twContainerQueries from '@tailwindcss/container-queries'
import twTypography from '@tailwindcss/typography'
import { tailwindVarColorScheme } from '@fiction/core/utils/colors.js'
import type { Config as TailwindConfig } from 'tailwindcss'
import { inputs } from './inputs/index.js'

type FictionUiSettings = {
  apps: FictionApp[]
  Logo?: vue.Component
  AdminPage?: vue.Component
  AdminWrap?: vue.Component
} & FictionPluginSettings

export * from './inputs/index.js'

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
        },
      },
    }
  }
}
