import * as vueUtils from "vue"
import * as store from "../utils/store"
import { Endpoint, EndpointMap } from "../engine/endpoint"
import { contextLogger } from "../logger"
import { _stop } from "../utils/error"
import * as utils from "../utils"
import { Query } from "../engine/query"
import { UserConfig } from "./types"

export abstract class FactorPlugin<T extends Record<string, unknown> = {}> {
  public settings: T
  public log = contextLogger(this.constructor.name)
  protected stop = _stop
  protected utils = utils
  protected vue = vueUtils
  protected store = store

  protected basePath: string
  public isTest: boolean = false
  public queries: ReturnType<typeof this.createQueries> = {}

  constructor(settings: T) {
    this.settings = settings
    this.basePath = `/${utils.slugify(this.constructor.name)}`
  }

  abstract setup(settings?: Partial<T>): UserConfig | Promise<UserConfig>

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
    endpointHandler?: typeof Endpoint
  }): M {
    if (!params.serverUrl) {
      this.log.warn("serverUrl missing - cannot create endpoints")
      return {} as M
    }

    const { queries, serverUrl, basePath, endpointHandler = Endpoint } = params
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

    return requests as M
  }

  validateRequiredFields = <T extends FactorPlugin>(params: {
    plugin: T
    fields: (keyof T)[]
    fieldsLive?: (keyof T)[]
  }): boolean => {
    const { fields, fieldsLive, plugin } = params

    let valid = true

    const requiredFields = [...fields]
    if (!this.isTest && fieldsLive) {
      requiredFields.push(...fieldsLive)
    }

    requiredFields.forEach((field) => {
      if (!plugin[field]) {
        this.log.error(`${field} is required`)
        valid = false
      }
    })

    return valid
  }
}
