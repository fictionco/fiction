import { FactorUser } from "@factor/api"
import { Endpoint, EndpointMap } from "./utils/endpoint"
import { log } from "./plugin-log"
import type { Query } from "./query"
import type { FactorServer } from "./plugin-server"
import type { ServiceConfig } from "./plugin-env/types"
import { _stop } from "./utils/error"
import * as store from "./utils/store"
import * as utils from "./utils"

export abstract class FactorPlugin<T extends Record<string, unknown> = {}> {
  public settings: T
  public log = log.contextLogger(this.constructor.name)
  protected stop = _stop
  protected utils = utils
  protected store = store

  protected basePath: string

  constructor(settings: T) {
    this.settings = settings
    this.basePath = `/${utils.slugify(this.constructor.name)}`
  }

  abstract setup(
    settings?: Partial<T>,
  ): ServiceConfig | Promise<ServiceConfig> | void | Promise<void>

  public setting<K extends keyof T>(key: K): T[K] | undefined {
    if (!this.settings) return undefined
    return this.settings[key]
  }

  protected createQueries(): Record<string, Query> {
    return {}
  }

  protected createRequests<
    M extends EndpointMap<R>,
    R extends Record<string, Query> = Record<string, Query>,
  >(params: {
    queries: R
    basePath?: string
    factorServer: FactorServer
    factorUser: FactorUser
    endpointHandler?: (options: utils.EndpointSettings<Query>) => Endpoint
  }): M {
    const { queries, factorServer, factorUser, basePath, endpointHandler } =
      params

    const serverUrl = factorServer.serverUrl

    if (!serverUrl) {
      this.log.warn("serverUrl missing - cannot create endpoints")
      return {} as M
    }

    const q = queries ?? {}

    const entries = Object.entries(q)
      .map(([key, queryHandler]) => {
        const opts = {
          key,
          queryHandler,
          serverUrl,
          basePath: basePath || this.basePath,
          factorUser,
        }

        const handler = endpointHandler
          ? endpointHandler(opts)
          : new Endpoint(opts)

        return [key, handler]
      })
      .filter(Boolean) as [string, Endpoint][]

    const requests = Object.fromEntries(entries)

    factorServer.addEndpoints(Object.values(requests))

    return requests as M
  }
}
