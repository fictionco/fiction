import type { FictionPluginSettings } from '@fiction/core'
import { FictionPlugin } from '@fiction/core'
import { config } from 'dotenv'

type ModuleConfig = {
  name: string
  dependencies?: string[]
} & FictionPluginSettings

class RegistryPlugin extends FictionPlugin<ModuleConfig> {
  constructor(settings: ModuleConfig) {
    super(config.name, settings)
  }

  async init(services: RegistryPlugin[]) {
    // Initialize module with available services
  }
}

class ModuleRegistry {
  private modules: Record<string, RegistryPlugin> = {}
  private moduleConfigs: Record<string, ModuleConfig> = {}

  registerModule(name: string, config: ModuleConfig) {
    this.moduleConfigs[name] = config
  }

  async initializeModules() {
    for (const [name, config] of Object.entries(this.moduleConfigs)) {
      this.modules[name] = new RegistryPlugin(config)
    }

    for (const module of Object.values(this.modules)) {
      await this.initializeModule(module)
    }
  }

  private async initializeModule(module: RegistryPlugin) {
    const dependencies = module.settings.dependencies?.map(dep => this.modules[dep]) || []
    await module.init(dependencies)
  }

  getModule(name: string): FictionPlugin {
    return this.modules[name]
  }
}
