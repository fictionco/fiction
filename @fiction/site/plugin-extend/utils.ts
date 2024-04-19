import type { FictionPlugin, FictionPluginSettings, ServiceList } from '@fiction/core'

// export type ExtensionManifest<T extends Record<string, any> = Record<string, any>> = {
//   extensionId: string
//   title: string
//   description: string
//   getExtension: () => Promise<{ setup: (settings: T) => Promise<FictionPlugin<T & FictionPluginSettings>> }>
// }

export type ExtensionLoader<T extends Record<string, any> = Record<string, any>> = {
  extensionId: string
  title: string
  description: string
  screenshot?: string
  getExtension: () => Promise<{ setup: (settings: T) => Promise<FictionPlugin<T & FictionPluginSettings>> }>
  // getManifest: () => Promise<{ manifest: ExtensionManifest<T> }>
  getSettings?: () => (Promise<Omit<T, keyof FictionPluginSettings>> | Omit<T, keyof FictionPluginSettings>)
}

// Define a function that takes an array of plugins and returns it.
// TypeScript will infer the type of T based on the provided settings.
export function getExtensionIndex<T extends Record<string, any>>(extensions: ExtensionLoader<T>[]) {
  return extensions as ExtensionLoader[]
}

/**
 * Asynchronously loads and initializes the specified extensions.
 */
export async function loadAndInitializeExtensions(args: {
  extensions: ExtensionLoader[]
  settings: FictionPluginSettings
  installIds?: string[]
}): Promise<ServiceList> {
  const { extensions, installIds } = args
  const service: ServiceList = {}

  const filteredExtensions = installIds ? extensions.filter(e => installIds.includes(e.extensionId)) : extensions

  for (const loader of filteredExtensions) {
    const settings = loader.getSettings ? await loader.getSettings() : {}
    const extension = await loader.getExtension()
    const plugin = await extension.setup({ ...args.settings, ...settings })
    service[loader.extensionId] = plugin
  }

  return service
}
