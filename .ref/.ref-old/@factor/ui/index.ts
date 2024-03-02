import { FactorPlugin, FactorPluginSettings, FactorApp, vue } from "@factor/api"
import twForms from "@tailwindcss/forms"
import {
  tailwindVarColorScheme,
  getColorScheme,
} from "@factor/api/utils/colors"
import { inputs } from "./inputs"
const def = vue.defineAsyncComponent
type FactorUiSettings = {
  factorApp: FactorApp
} & FactorPluginSettings

export * from "./inputs"

export const els = {
  ElAvatar: def(() => import("./ElAvatar.vue")),
  ElButton: def(() => import("./ElButton.vue")),
  ElForm: def(() => import("./ElForm.vue")),
  ElInput: def(() => import("./ElInput.vue")),
  ElSpinner: def(() => import("./ElSpinner.vue")),
  ElModal: def(() => import("./ElModal.vue")),
}

export class FactorUi extends FactorPlugin<FactorUiSettings> {
  factorApp: FactorApp
  root = this.utils.safeDirname(import.meta.url)
  ui: Record<string, vue.Component> = inputs
  constructor(settings: FactorUiSettings) {
    super("ui", settings)
    this.factorApp = settings.factorApp

    this.factorApp.addTailwindConfig({
      content: [`${this.root}/*.vue`, `${this.root}/*.ts`],
      plugins: [twForms],
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
            input: "var(--input-border-width, 1px)",
            3: "3px",
          },
          borderRadius: {
            input: "var(--input-border-radius, .4em)",
          },
          boxShadow: {
            input: `var(--input-shadow, 'none')`,
            "input-focus": `var(--input-shadow-focus, 'none')`,
          },
          spacing: {
            "input-x": "var(--input-x, .5rem)",
            "input-y": "var(--input-y, .33rem)",
          },
          maxWidth: {
            input: "var(--input-max-width, 100%)",
            "input-lg": "var(--input-max-width-lg, 100%)",
          },
          fontSize: {
            "input-size": [
              "var(--input-size, .875rem)",
              {
                lineHeight: "calc(var(--input-size, .875rem) * 1.4)",
              },
            ],
            "input-label-size": [
              "var(--input-label-size, --input-size)",
              {
                lineHeight: "calc(var(--input-label-size, --input-size) * 1.4)",
              },
            ],
          },
          ringWidth: {
            "input-width": "var(--input-ring-width, 3px)",
          },
          ringColor: {
            "input-color": "var(--input-ring-color, var(--theme-200, #e2e8f0))",
          },

          colors: {
            transparent: "transparent",
            slate: {
              25: "#fdfdff",
            },

            action: {
              main: "var(--action-main, var(--theme-500, #64748b))",
              dark: "var(--action-dark, var(--action-main, var(--theme-600, #64748b)))",
              light:
                "var(--action-light, var(--action-main, var(--theme-400, #64748b)))",
              contrast: "var(--action-contrast, var(--theme-0, #FFFFFF))",
            },
            primary: tailwindVarColorScheme({
              variable: "primary",
              color: "blue",
            }),

            secondary: tailwindVarColorScheme({
              variable: "secondary",
              color: "pink",
            }),
            caution: tailwindVarColorScheme({
              variable: "caution",
              color: "amber",
            }),
            danger: tailwindVarColorScheme({
              variable: "danger",
              color: "rose",
            }),
            success: tailwindVarColorScheme({
              variable: "success",
              color: "emerald",
            }),
            theme: tailwindVarColorScheme({
              variable: "theme",
              color: "slate",
            }),
            canvas: {
              main: "var(--canvas-main, var(--theme-0, #FFFFFF))",
              panel: "var(--canvas-panel, var(--theme-50, #FFFFFF))",
              "panel-alt": "var(--canvas-panel-alt, var(--theme-100, #FFFFFF))",
              border: "var(--canvas-border, var(--theme-300, #FFFFFF))",
            },
            /**
             * Needed to allow for input specific colors to be selectively
             * overridden without also overriding the theme colors.
             */
            input: {
              bg: "var(--input-bg, var(--theme-0, transparent))",
              "bg-alt":
                "var(--input-bg-alt, var(--input-bg, var(--theme-200, #e2e8f0)))",
              text: "var(--input-text, var(--theme-700, #334155))",
              "text-alt":
                "var(--input-text-alt, var(--input-text, var(--theme-500, #64748b)))",
              border: "var(--input-border, var(--theme-300, #cbd5e1))",
              "border-alt":
                "var(--input-border-alt, var(--input-border, var(--theme-400, #94a3b8)))",
              placeholder:
                "var(--input-placeholder, var(--theme-400, #94a3b8))",
              active: "var(--input-active, var(--theme-500, #64748b))",
              "active-text":
                "var(--input-active-text, var(--theme-0, #FFFFFF))",
            },
          },
        },
      },
    })
  }
}
