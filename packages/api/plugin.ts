import { Endpoint, EndpointMap } from "./utils/endpoint"
import { log } from "./plugin-log"
import { Query } from "./query"
import type { FactorServer } from "./plugin-server"
import { ServiceConfig } from "./plugin-env/types"
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
  public queries: ReturnType<typeof this.createQueries> = {}

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
    serverUrl?: string
    basePath?: string
    factorServer: FactorServer
    endpointHandler?: typeof Endpoint
  }): M {
    const {
      queries,
      factorServer,
      basePath,
      endpointHandler = Endpoint,
    } = params

    const serverUrl = factorServer.serverUrl

    if (!serverUrl) {
      this.log.warn("serverUrl missing - cannot create endpoints")
      return {} as M
    }

    const q = queries ?? {}

    const entries = Object.entries(q)
      .map(([key, query]) => {
        return [
          key,
          new endpointHandler({
            key,
            queryHandler: query,
            serverUrl,
            basePath: basePath || this.basePath,
          }),
        ]
      })
      .filter(Boolean) as [string, Endpoint][]

    const requests = Object.fromEntries(entries)

    factorServer.addEndpoints(Object.values(requests))

    return requests as M
  }
}
