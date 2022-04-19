import * as vueUtils from "vue"
import * as store from "../store"
import { Endpoint, FactorEndpoint } from "../engine/endpoint"
import { contextLogger } from "../logger"
import { _stop } from "../error"
import * as utils from "../utils"
import type { Query } from "../engine/query"
import { UserConfig } from "./types"

type NodeEnv = "development" | "production"

export abstract class FactorPlugin<T extends Record<string, unknown> = {}> {
  public endpoints?: Endpoint[]
  public settings: T
  protected log = contextLogger(this.constructor.name)
  protected stop = _stop
  protected utils = utils
  protected vue = vueUtils
  protected store = store
  protected serverUrl: string = process.env.FACTOR_SERVER_URL ?? ""
  protected mode: "development" | "production"

  constructor(settings: T) {
    this.settings = settings
    this.mode = (process.env.NODE_ENV as NodeEnv) ?? "production"
  }

  abstract setup(settings?: Partial<T>): UserConfig | Promise<UserConfig>

  public setting<K extends keyof T>(key: K): T[K] | undefined {
    if (!this.settings) return undefined
    return this.settings[key]
  }
}
