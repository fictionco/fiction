import type { FictionPlugin, FictionPluginSettings, IndexItem, ServiceList } from '@fiction/core'

export type ExtensionManifest<T extends Record<string, any> = Record<string, any>> = {
  extensionId: string
  setup?: (settings: T) => Promise<FictionPlugin<T & FictionPluginSettings>>
  settings?: () => (Promise<Omit<T, keyof FictionPluginSettings>> | Omit<T, keyof FictionPluginSettings>)
  installStatus: 'installed' | 'disabled' | 'uninstalled'
} & IndexItem

export type ExtensionLoader<T extends Record<string, any> = Record<string, any>> = {
  load: () => Promise<{ plugin: ExtensionManifest<T> }>
} & Partial<ExtensionManifest<T>>

// Define a function that takes an array of plugins and returns it.
// TypeScript will infer the type of T based on the provided settings.
export function getExtensionIndexTypeHelper<T extends Record<string, any>>(extensions: ExtensionLoader<T>[]) {
  return extensions as ExtensionLoader[]
}

/**
 * Asynchronously loads and initializes the specified extensions.
 */
export async function loadAndInitializeExtensions(args: {
  extensions: ExtensionManifest[]
  settings: FictionPluginSettings
  installIds?: string[]
}): Promise<ServiceList> {
  const { extensions, installIds } = args
  const service: ServiceList = {}

  const filteredExtensions = installIds ? extensions.filter(e => installIds.includes(e.extensionId)) : extensions

  for (const manifest of filteredExtensions) {
    const settings = manifest.settings ? await manifest.settings() : {}

    if (!manifest.setup)
      throw new Error(`Extension (${manifest.extensionId}) must have a setup function`)

    const plugin = await manifest.setup({ ...args.settings, ...settings })
    service[manifest.extensionId] = plugin
  }

  return service
}
