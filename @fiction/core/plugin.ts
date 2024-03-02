import type { FictionUser } from './plugin-user'
import { omit } from './utils'
import type { EndpointMap } from './utils/endpoint'
import { Endpoint } from './utils/endpoint'
import type { LogHelper } from './plugin-log'
import { log } from './plugin-log'
import type { Query } from './query'
import type { FictionServer } from './plugin-server'
import { _stop } from './utils/error'
import * as utils from './utils'
import type { FictionEnv } from './plugin-env'
import { standardTable } from './tbl'

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
  stop = _stop
  utils = utils
  log: LogHelper
  tbl = standardTable
  constructor(name: string, settings: T) {
    this.name = name
    this.settings = settings
    this.log = log.contextLogger(name)
  }

  afterSetup(_args: PluginSetupArgs): void | Promise<void> {}
  setup(_args: PluginSetupArgs): void | Promise<void> {}
  toJSON(): Record<string, unknown> {
    return omit(this, 'utils', 'stop', 'log', 'settings', 'toJSON', 'tbl')
  }
}

export abstract class FictionPlugin<
  T extends FictionPluginSettings = { fictionEnv: FictionEnv },
> extends FictionObject<T> {
  basePath: string
  log: LogHelper
  fictionEnv?: FictionEnv
  constructor(name: string, settings: T) {
    super(name, settings)
    this.basePath = `/${utils.toSlug(this.name)}`
    this.fictionEnv = this.settings.fictionEnv

    if (this.settings.root) {
      const root = this.settings.root
      const patterns = [
          `${root}/*.vue`,
          `${root}/**/*.vue`,
          `${root}/*.ts`,
          `${root}/**/*.ts`,
          `!${root}/node_modules/**`, // Exclude node_modules
          `!${root}/dist/**`, // Exclude dist
      ]
      this.fictionEnv?.addUiPaths(patterns)
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
    endpointHandler?: (options: utils.EndpointSettings<Query>) => Endpoint
    middleware?: () => utils.express.RequestHandler[]
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
        const opts: utils.EndpointSettings<Query> = {
          key,
          queryHandler,
          serverUrl: fictionServer?.serverUrl,
          basePath: basePath || this.basePath,
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

  toJSON(): Record<string, unknown> {
    return omit(this, 'utils', 'stop', 'log', 'settings', 'toJSON', 'fictionEnv', 'tbl')
  }
}