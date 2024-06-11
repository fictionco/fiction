import type express from 'express'
import type { FictionUser } from './plugin-user/index.js'
import { toSlug } from './utils/casing.js'
import { omit } from './utils/obj.js'
import type { EndpointMap, EndpointSettings } from './utils/endpoint.js'
import { Endpoint } from './utils/endpoint.js'
import type { LogHelper } from './plugin-log/index.js'
import { log } from './plugin-log/index.js'
import type { Query } from './query.js'
import type { FictionServer } from './plugin-server/index.js'
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

export abstract class FictionObject<
  T extends object = object,
> {
  name: string
  settings: T
  stop = abort
  abort = abort
  log: LogHelper
  constructor(name: string, settings: T) {
    this.name = name
    this.settings = settings
    this.log = log.contextLogger(name)
  }

  afterSetup(_args: PluginSetupArgs): void | Promise<void> {}
  setup(_args: PluginSetupArgs): void | Promise<void> {}
  beforeSetup(_args: PluginSetupArgs): void | Promise<void> {}
  toJSON(): Record<string, unknown> {
    return omit(this, 'stop', 'log', 'settings', 'toJSON')
  }
}

export abstract class FictionPlugin<
  T extends FictionPluginSettings = { fictionEnv: FictionEnv },
> extends FictionObject<T> {
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

  protected createQueries(): Record<string, Query> {
    return {}
  }

  protected createRequests<
    M extends EndpointMap<R>,
    R extends Record<string, Query> = Record<string, Query>,
  >(params: {
    queries?: R
    basePath?: string
    fictionServer?: FictionServer
    fictionUser?: FictionUser
    endpointHandler?: (options: EndpointSettings<Query>) => Endpoint
    middleware?: () => express.RequestHandler[]
  },
  ): M {
    const { queries, fictionServer, fictionUser, basePath, endpointHandler, middleware } = params

    if (!fictionServer) {
      this.log.warn(`Create Requests Err: No fictionServer found for "${this.name}"`)
      return {} as M
    }

    if (!queries) {
      this.log.warn(`No queries found for ${this.name}`)
      return {} as M
    }

    const entries = Object.entries(queries)
      .map(([key, queryHandler]) => {
        const opts: EndpointSettings<Query> = {
          key,
          queryHandler,
          serverUrl: fictionServer?.serverUrl,
          basePath: basePath || this.basePath,
          fictionEnv: this.settings.fictionEnv,
          fictionUser,
          middleware,
        }

        const handler = endpointHandler
          ? endpointHandler(opts)
          : new Endpoint(opts)

        return [key, handler]
      })
      .filter(Boolean) as [string, Endpoint][]

    const requests = Object.fromEntries(entries)

    fictionServer?.addEndpoints(Object.values(requests))

    return requests as M
  }

  override toJSON(): Record<string, unknown> {
    return omit(this, 'stop', 'log', 'settings', 'toJSON', 'fictionEnv')
  }
}
