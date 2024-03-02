import type { FactorUser } from "./plugin-user"
import { omit } from "./utils"
import { Endpoint, EndpointMap } from "./utils/endpoint"
import { log, LogHelper } from "./plugin-log"
import type { Query } from "./query"
import type { FactorServer } from "./plugin-server"
import { _stop } from "./utils/error"
import * as utils from "./utils"
import type { FactorEnv } from "./plugin-env"

export type FactorPluginSettings = {
  factorEnv: FactorEnv
  [key: string]: unknown
}

export abstract class FactorObject<T extends { [key: string]: unknown } = {}> {
  name: string
  settings: T
  stop = _stop
  utils = utils
  log: LogHelper
  constructor(name: string, settings: T) {
    this.name = name
    this.settings = settings
    this.log = log.contextLogger(name)
  }

  afterSetup(): void | Promise<void> {}
  setup(): void | Promise<void> {}

  toJSON(): Record<string, unknown> {
    return omit(this, "utils", "stop", "log", "settings", "toJSON")
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
    this.basePath = `/${utils.slugify(this.name)}`
    this.factorEnv = this.settings.factorEnv
    let context = "env"
    if (this.factorEnv) {
      const versionContext = [
        `v${this.factorEnv.version.split(".").pop()}`,
        `${this.factorEnv.factorVersion.split(".").pop()}`,
      ]
      context = versionContext.join("/")
    }

    this.log = log.contextLogger(`${context}:${this.name}`)
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
    factorServer?: FactorServer
    factorUser?: FactorUser
    endpointHandler?: (options: utils.EndpointSettings<Query>) => Endpoint
    middleware?: () => utils.express.RequestHandler[]
  }): M {
    const {
      queries,
      factorServer,
      factorUser,
      basePath,
      endpointHandler,
      middleware,
    } = params

    const serverUrl = factorServer?.serverUrl.value

    if (!serverUrl) {
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
          middleware,
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

  toJSON(): Record<string, unknown> {
    return omit(this, "utils", "stop", "log", "settings", "toJSON", "factorEnv")
  }
}
