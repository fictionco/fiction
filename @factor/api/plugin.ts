import type { FactorUser } from './plugin-user'
import { omit } from './utils'
import type { EndpointMap } from './utils/endpoint'
import { Endpoint } from './utils/endpoint'
import type { LogHelper } from './plugin-log'
import { log } from './plugin-log'
import type { Query } from './query'
import type { FactorServer } from './plugin-server'
import { _stop } from './utils/error'
import * as utils from './utils'
import type { FactorEnv } from './plugin-env'
import { standardTable } from './tbl'

export type FactorPluginSettings = {
  factorEnv: FactorEnv
  root?: string
  createQueries?: () => Record<string, Query>
}

export type PluginSetupArgs = {
  context: 'node' | 'app' | 'test'
}

export abstract class FactorObject<
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

export abstract class FactorPlugin<
  T extends FactorPluginSettings = { factorEnv: FactorEnv },
> extends FactorObject<T> {
  basePath: string
  log: LogHelper
  factorEnv?: FactorEnv
  constructor(name: string, settings: T) {
    super(name, settings)
    this.basePath = `/${utils.toSlug(this.name)}`
    this.factorEnv = this.settings.factorEnv

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
      this.factorEnv?.addUiPaths(patterns)
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
    factorServer?: FactorServer
    factorUser?: FactorUser
    endpointHandler?: (options: utils.EndpointSettings<Query>) => Endpoint
    middleware?: () => utils.express.RequestHandler[]
  },
  ): M {
    const { queries, factorServer, factorUser, basePath, endpointHandler, middleware } = params

    if (!factorServer) {
      this.log.warn(`Create Requests Err: No factorServer found for "${this.name}"`)
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
          serverUrl: factorServer?.serverUrl,
          basePath: basePath || this.basePath,
          factorUser,
          middleware,
        }

        const handler = endpointHandler
          ? endpointHandler(opts)
          : new Endpoint(opts)

        return [key, handler]
      })
      .filter(Boolean) as [string, Endpoint][]

    const requests = Object.fromEntries(entries)

    factorServer?.addEndpoints(Object.values(requests))

    return requests as M
  }

  toJSON(): Record<string, unknown> {
    return omit(this, 'utils', 'stop', 'log', 'settings', 'toJSON', 'factorEnv', 'tbl')
  }
}
