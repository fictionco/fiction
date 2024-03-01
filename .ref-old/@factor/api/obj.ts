import { omit } from "./utils/_"
import { log, LogHelper } from "./plugin-log"

export abstract class Obj<T extends { [key: string]: unknown } = {}> {
  name: string
  settings: T
  log: LogHelper
  constructor(name: string, settings: T) {
    this.name = name
    this.settings = settings
    this.log = log.contextLogger(name)
  }

  toJSON(): Record<string, unknown> {
    return omit(this, "log", "settings", "toJSON")
  }
}
