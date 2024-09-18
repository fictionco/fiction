import type { Card } from '@fiction/site'
import type { InputOption } from '@fiction/ui/index.js'
import { type ActionItem, type EndpointResponse, FictionObject, type StandardServices, vue } from '@fiction/core/index.js'

export type NavCardUserConfig = { isNavItem?: boolean, navIcon?: string, navIconAlt?: string, parentItemId?: string }

export type SettingsToolConfig<T extends string = string, U extends Record<string, any> | undefined = Record<string, any> | undefined> = {
  slug?: T
  href?: string
  title?: string | vue.Ref<string>
  el?: vue.Component
  userConfig?: NavCardUserConfig
  options?: (args: { tool: SettingsTool<T, U>, service: StandardServices, card: Card }) => vue.Ref<InputOption[]>
  save?: (args: { tool: SettingsTool<T, U>, service: StandardServices }) => Promise<EndpointResponse>
  val?: vue.Ref<U> | vue.WritableComputedRef<U>
  getActions?: (args: { tool: SettingsTool<T, U>, service: StandardServices }) => vue.ComputedRef<ActionItem[]>
}

export class SettingsTool<T extends string = string, U extends Record<string, any> | undefined = Record<string, any> | undefined> extends FictionObject<SettingsToolConfig<T, U>> {
  val = this.settings.val || vue.ref({}) as vue.Ref<U>
  slug = this.settings.slug || ''
  href = this.settings.href || ''
  title = vue.computed(() => vue.isRef(this.settings.title) ? this.settings.title.value : (this.settings.title || ''))
  el = this.settings.el
  userConfig = this.settings.userConfig || {}
  options = this.settings.options
  save = this.settings.save
  getActions = this.settings.getActions
  constructor(settings: SettingsToolConfig<T, U>) {
    super('SettingsTool', settings)
  }
}

export type WidgetLocation = 'homeMain' | 'homeSecondary' | string
