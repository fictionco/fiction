import type { StandardServices, vue } from '@fiction/core'
import type { InputOption } from '@fiction/ui'

export type NavCardUserConfig = { isNavItem?: boolean, navIcon?: string, navIconAlt?: string, parentItemId?: string }

export type SettingsTool<T extends string = string, U extends Record<string, any> = Record<string, any>> = {
  slug: T
  title?: string
  el?: vue.Component
  props?: (args: U) => vue.ComputedRef<Record<string, unknown>>
  userConfig?: NavCardUserConfig
  options?: (args: { tool: SettingsTool, service: StandardServices }) => vue.ComputedRef< InputOption[]>
}
