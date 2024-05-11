import type { FictionApp, FictionPluginSettings, vue } from '@fiction/core'
import { FictionPlugin, safeDirname } from '@fiction/core'
import twForms from '@tailwindcss/forms'
import twContainerQueries from '@tailwindcss/container-queries'
import twTypography from '@tailwindcss/typography'
import { tailwindVarColorScheme } from '@fiction/core/utils/colors'
import type { Config as TailwindConfig } from 'tailwindcss'
import { inputs } from './inputs'

type FictionUiSettings = {
  apps: FictionApp[]
  Logo?: vue.Component
  AdminPage?: vue.Component
  AdminWrap?: vue.Component
} & FictionPluginSettings

export * from './inputs'

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
          borderWidth: {
            input: 'var(--input-border-width, 1px)',
            3: '3px',
          },
          borderRadius: {
            input: 'var(--input-border-radius, .4em)',
          },
          boxShadow: {
            'input': `var(--input-shadow, 'none')`,
            'input-focus': `var(--input-shadow-focus, 'none')`,
          },
          spacing: {
            'input-x': 'var(--input-x, .5rem)',
            'input-x-1.5': 'calc(var(--input-x, .5rem) * 1.5)',
            'input-x-2': 'calc(var(--input-x, .5rem) * 2)',
            'input-y': 'var(--input-y, .5rem)',
            'input-y-1.5': 'calc(var(--input-y, .5rem) * 1.5)',
            'input-y-2': 'calc(var(--input-y, .5rem) * 2)',
          },
          maxWidth: {
            'input': 'var(--input-max-width, 100%)',
            'input-lg': 'var(--input-max-width-lg, 100%)',
          },
          fontSize: {
            'input-size': [
              'var(--input-size, .85rem)',
              {
                lineHeight: 'calc(var(--input-size, 1rem))',
              },
            ],
            'input-label-size': [
              'var(--input-label-size, --input-size)',
              {
                lineHeight: 'calc(var(--input-label-size, --input-size) * 1.2)',
              },
            ],
          },
          ringWidth: {
            'input-width': 'var(--input-ring-width, 3px)',
          },
          ringColor: {
            'input-color': 'var(--input-ring-color, var(--primary-400, #e2e8f0))',
          },

          colors: {
            transparent: 'transparent',
            slate: { 25: '#fdfdff' },
            primary: tailwindVarColorScheme({ variable: 'primary', color: 'blue' }),
            theme: tailwindVarColorScheme({ variable: 'theme', color: 'gray' }),
            // action: {
            //   'main': 'var(--action-main, var(--primary-500, #2563eb))',
            //   'contrast': 'var(--action-contrast, var(--primary-0, #FFFFFF))',
            //   'alt': 'var(--action-alt, var(--theme-200, #e2e8f0))',
            //   'alt-contrast': 'var(--action-alt-contrast, var(--theme-700, #1e293b))',
            // },

            canvas: {
              'main': 'var(--canvas-main, var(--theme-0, #FFFFFF))',
              'panel': 'var(--canvas-panel, var(--theme-50, #FFFFFF))',
              'panel-alt': 'var(--canvas-panel-alt, var(--theme-100, #FFFFFF))',
              'border': 'var(--canvas-border, var(--theme-300, #FFFFFF))',
            },
            /**
             * Needed to allow for input specific colors to be selectively
             * overridden without also overriding the theme colors.
             */
            input: {
              'bg': 'var(--input-bg, var(--theme-50, transparent))',
              'bg-alt':
                'var(--input-bg-alt, var(--input-bg, var(--theme-200, #e2e8f0)))',
              'text': 'var(--input-text, var(--theme-700, #334155))',
              'text-alt':
                'var(--input-text-alt, var(--input-text, var(--theme-500, #64748b)))',
              'border': 'var(--input-border, var(--theme-300, #cbd5e1))',
              'border-alt':
                'var(--input-border-alt, var(--input-border, var(--theme-400, #94a3b8)))',
              'placeholder':
                'var(--input-placeholder, var(--theme-400, #94a3b8))',
              'active': 'var(--input-active, var(--theme-500, #64748b))',
              'active-text':
                'var(--input-active-text, var(--theme-0, #FFFFFF))',
            },
          },
        },
      },
    }
  }
}
