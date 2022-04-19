import * as vueUtils from "vue"
import * as store from "../store"
import { Endpoint } from "../engine/endpoint"
import { contextLogger } from "../logger"
import { _stop } from "../error"
import * as utils from "../utils"
import { UserConfig } from "./types"

type NodeEnv = "development" | "production"

export abstract class FactorPlugin<T extends Record<string, unknown> = {}> {
  public endpoints?: Endpoint[]
  public settings: T
  public log = contextLogger(this.constructor.name)
  protected stop = _stop
  protected utils = utils
  protected vue = vueUtils
  protected store = store
  protected serverUrl: string = process.env.FACTOR_SERVER_URL ?? ""
  protected mode: "development" | "production"
  public isTest: boolean = false

  constructor(settings: T) {
    this.settings = settings
    this.mode = (process.env.NODE_ENV as NodeEnv) ?? "production"
  }

  abstract setup(settings?: Partial<T>): UserConfig | Promise<UserConfig>

  public setting<K extends keyof T>(key: K): T[K] | undefined {
    if (!this.settings) return undefined
    return this.settings[key]
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
