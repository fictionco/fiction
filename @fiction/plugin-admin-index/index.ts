// @unocss-include
import type { FactorPluginSettings } from '@fiction/core'
import { FactorPlugin } from '@fiction/core'
import type { FactorAdmin, FactorAdminSettings } from '@fiction/plugin-admin'

export type BaseAdminPluginSettings = FactorAdminSettings & { factorAdmin: FactorAdmin }

export type PluginMain<T extends BaseAdminPluginSettings> = {
  createPlugin: (args: T) => Promise<FactorPlugin<T>>
  serviceId: string
  title: string
  description: string
}

export type PluginLoader<T extends Record<string, any> = Record<string, any>> = {
  load: () => Promise<{ setup: () => PluginMain<T & BaseAdminPluginSettings> }>
  settings?: Omit<T, keyof BaseAdminPluginSettings>
}

// Define a function that takes an array of plugins and returns it.
// TypeScript will infer the type of T based on the provided settings.
export function createPluginConfig<T extends Record<string, any>>(plugins: PluginLoader<T>[]) {
  return plugins as PluginLoader[]
}

type PluginIndexSettings = { plugins: PluginLoader<Record<string, any>>[] } & FactorPluginSettings

export class FactorAdminPluginIndex<T extends PluginIndexSettings = PluginIndexSettings> extends FactorPlugin<T> {
  root = this.utils.safeDirname(import.meta.url)
  plugins = this.settings.plugins
  constructor(settings: T) {
    super('AdminPluginIndex', settings)
  }
}
