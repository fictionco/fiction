import { FactorPlugin, FactorPluginSettings, FactorApp, vue } from "@factor/api"
import twForms from "@tailwindcss/forms"
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
          borderWidth: {
            input: "var(--input-border-width, 1px)",
            3: "3px",
          },
          borderRadius: {
            input: "var(--input-border-radius, 4px)",
          },

          boxShadow: {
            input: `var(--input-shadow, 'none')`,
            "input-focus": `var(--input-shadow-focus, 'none')`,
          },
          spacing: {
            "input-x": "var(--input-x, .5rem)",
            "input-y": "var(--input-y, .5rem)",
          },
          maxWidth: {
            input: "var(--input-max-width, 100%)",
            "input-lg": "var(--input-max-width-lg, 100%)",
          },
          fontSize: {
            "input-size": [
              "var(--input-size)",
              {
                lineHeight: "calc(var(--input-size) * 1.4)",
              },
            ],
            "input-label-size": [
              "var(--input-label-size, .875rem)",
              {
                lineHeight: "calc(var(--input-label-size) * 1.4)",
              },
            ],
          },

          colors: {
            transparent: "transparent",
            slate: {
              25: "#fdfdff",
            },
            primary: {
              0: "var(--primary-0, #FFFFFF)",
              50: "var(--primary-50, #f6f5ff)",
              100: "var(--primary-100, #eeebff)",
              200: "var(--primary-200, #d4ccff)",
              300: "var(--primary-300, #baadff)",
              400: "var(--primary-400, #8670ff)",
              500: "var(--primary-500, #5233ff)",
              600: "var(--primary-600, #4a2ee6)",
              700: "var(--primary-700, #3e26bf)",
              800: "var(--primary-800, #1a1452)",
              900: "var(--primary-900, #28197d)",
              DEFAULT: "var(--primary-500, #5233ff)",
            },
            theme: {
              DEFAULT: "var(--theme-0, #FFFFFF)",
              0: "var(--theme-0, #FFFFFF)",
              50: "var(--theme-50, #f8fafc)",
              100: "var(--theme-100, #f1f5f9)",
              200: "var(--theme-200, #e2e8f0)",
              300: "var(--theme-300, #cbd5e1)",
              400: "var(--theme-400, #94a3b8)",
              500: "var(--theme-500, #64748b)",
              600: "var(--theme-600, #475569)",
              700: "var(--theme-700, #334155)",
              800: "var(--theme-800, #1e293b)",
              900: "var(--theme-900, #0f172a)",
            },
            /**
             * Needed to allow for input specific colors to be selectively
             * overridden without also overriding the theme colors.
             */
            input: {
              bg: "var(--input-bg, var(--theme-100, #f1f5f9))",
              bgAlt: "var(--input-bg-alt, var(--theme-200, #e2e8f0))",
              text: "var(--input-text, var(--theme-700, #334155))",
              border: "var(--input-border, var(--theme-300, #cbd5e1))",
              "border-alt":
                "var(--input-border-alt, var(--theme-400, #94a3b8))",
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
