// @unocss-include
import type { FictionPluginSettings } from '@fiction/core'
import { FictionPlugin, safeDirname } from '@fiction/core'
import type { FictionAdminSettings } from '@fiction/plugin-admin'

export type BaseAdminPluginSettings = FictionAdminSettings

export type PluginMain<T extends BaseAdminPluginSettings> = {
  createPlugin: (args: T) => Promise<FictionPlugin<T>>
  serviceId: string
  title: string
  description: string
}

export type PluginLoader<T extends Record<string, any> = Record<string, any>> = {
  load: () => Promise<{ setup: () => PluginMain<T & BaseAdminPluginSettings> }>
  settings?: () => Omit<T, keyof BaseAdminPluginSettings>
}

// Define a function that takes an array of plugins and returns it.
// TypeScript will infer the type of T based on the provided settings.
export function createPluginConfig<T extends Record<string, any>>(plugins: PluginLoader<T>[]) {
  return plugins as PluginLoader[]
}

type PluginIndexSettings = { plugins: PluginLoader<Record<string, any>>[] } & FictionPluginSettings

export class FictionAdminPluginIndex<T extends PluginIndexSettings = PluginIndexSettings> extends FictionPlugin<T> {
  plugins = this.settings.plugins
  constructor(settings: T) {
    super('AdminPluginIndex', { root: safeDirname(import.meta.url), ...settings })
  }
}
