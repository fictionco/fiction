import { toSlug } from './utils/casing.js'
import { omit } from './utils/obj.js'
import type { CreateEndpointRequestsParams, EndpointMap } from './utils/endpoint.js'
import { createEndpointRequests } from './utils/endpoint.js'
import type { LogHelper } from './plugin-log/index.js'
import { log } from './plugin-log/index.js'
import type { Query } from './query.js'
import { abort } from './utils/error.js'
import type { FictionEnv } from './plugin-env/index.js'

export type FictionPluginSettings = {
  fictionEnv: FictionEnv
  root?: string
  createQueries?: () => Record<string, Query>
}

export type PluginSetupArgs = {
  context: 'node' | 'app' | 'test'
}

export abstract class FictionObject< T extends object = object> {
  name: string
  settings: T
  log: LogHelper
  constructor(name: string, settings: T) {
    this.name = name
    this.settings = settings
    this.log = log.contextLogger(name)
  }

  public afterSetup(_args: PluginSetupArgs): void | Promise<void> {}
  public setup(_args: PluginSetupArgs): void | Promise<void> {}
  public beforeSetup(_args: PluginSetupArgs): void | Promise<void> {}
  toJSON(): Record<string, unknown> {
    return omit(this, 'log', 'settings', 'toJSON')
  }
}

export abstract class FictionPlugin<T extends FictionPluginSettings = { fictionEnv: FictionEnv }> extends FictionObject<T> {
  basePath: string
  fictionEnv: FictionEnv
  constructor(name: string, settings: T) {
    super(name, settings)
    this.basePath = `/${toSlug(this.name)}`
    this.fictionEnv = this.settings.fictionEnv

    if (this.settings.root) {
      const root = this.settings.root
      this.fictionEnv?.addUiRoot(root)
    }

    this.log = log.contextLogger(`${this.name}`)
  }

  protected createRequests< M extends EndpointMap<R>, R extends Record<string, Query> = Record<string, Query> >(params: CreateEndpointRequestsParams<R>): M {
    return createEndpointRequests({ basePath: this.basePath, ...params })
  }

  override toJSON(): Record<string, unknown> {
    return omit(this, 'log', 'settings', 'toJSON', 'fictionEnv')
  }
}
