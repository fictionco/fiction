import { FactorPlugin, FactorPluginSettings, FactorApp, vue } from "@factor/api"
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
      theme: {
        extend: {
          borderWidth: {
            input: "var(--input-border-width, 1px)",
          },
          borderRadius: {
            input: "var(--input-border-radius, 4px)",
          },

          boxShadow: {
            input: `var(--input-shadow, 'none')`,
            "input-focus": `var(--input-shadow-focus, 'none')`,
          },
          spacing: {
            "input-x": "var(--input-x, .75rem)",
            "input-y": "var(--input-y, .375rem)",
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
            primary: {
              50: "#f6f5ff",
              100: "#eeebff",
              200: "#d4ccff",
              300: "#baadff",
              400: "#8670ff",
              500: "#5233ff",
              600: "#4a2ee6",
              700: "#3e26bf",
              800: "#1a1452",
              900: "#28197d",
              DEFAULT: "#5233ff",
            },

            slate: {
              25: "#fdfdff",
            },
            theme: {
              DEFAULT: "var(--theme-base, var(--color-base))",
              50: "var(--theme-50, var(--theme-base))",
              100: "var(--theme-100, var(--theme-50))",
              200: "var(--theme-200, var(--theme-100))",
              300: "var(--theme-300, var(--theme-200))",
              400: "var(--theme-400, var(--theme-300))",
              500: "var(--theme-500, var(--theme-400))",
              600: "var(--theme-600, var(--theme-400))",
              700: "var(--theme-700, var(--theme-600))",
              800: "var(--theme-800, var(--theme-700))",
              900: "var(--theme-900, var(--theme-800))",
              base: "var(--theme-base, var(--color-base))",
              "base-alt": "var(--theme-base-alt, var(--color-base))",
              body: "var(--theme-body, var(--color-body))",
              "body-alt": "var(--theme-body-alt, var(--color-body-alt))",
              edge: "var(--theme-edge, var(--color-edge))",
              "edge-alt": "var(--theme-edge-alt, var(--color-edge-alt))",
              primary: "var(--theme-primary, var(--color-primary))",
              "primary-body":
                "var(--theme-primary-body,var(--color-primary-body))",
            },
            input: {
              primary: "var(--input-primary, var(--color-primary))",
              "primary-body":
                "var(--input-primary-body,var(--color-primary-body))",
              edge: "var(--input-edge, var(--color-edge))",
              "edge-light": "var(--input-edge-light, var(--color-edge-light))",
              body: "var(--input-body, var(--color-body))",
              "body-light": "var(--input-body-light, var(--color-body-light))",
              base: "var(--input-base, var(--color-base))",
              "base-alt": "var(--input-base-alt, var(--color-base-alt))",
              placeholder: "var(--input-placeholder, var(--color-placeholder))",
              shadow: "var(--input-shadow, var(--button-shadow))",
            },
          },
        },
      },
    })
  }
}
