import type { ActionItem, EndpointResponse, StandardServices, vue } from '@fiction/core/index.js'
import type { InputOption } from '@fiction/ui/index.js'

export type NavCardUserConfig = { isNavItem?: boolean, navIcon?: string, navIconAlt?: string, parentItemId?: string }

export type SettingsTool<T extends string = string, U extends Record<string, any> | undefined = Record<string, any> | undefined> = {
  slug: T
  title?: string
  el?: vue.Component
  userConfig?: NavCardUserConfig
  options?: (args: { tool: SettingsTool<T, U>, service: StandardServices }) => vue.ComputedRef< InputOption[]>
  save?: (args: { tool: SettingsTool<T, U>, service: StandardServices }) => Promise<EndpointResponse>
  val?: vue.Ref<U> | vue.WritableComputedRef<U>
  getActions?: (args: { tool: SettingsTool<T, U>, service: StandardServices }) => vue.ComputedRef<ActionItem[]>
}
