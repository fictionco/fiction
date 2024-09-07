import { log } from './plugin-log'
import { omit } from './utils/obj'
import type { LogHelper } from './plugin-log'

export abstract class Obj<T extends { [key: string]: unknown } = { [key: string]: unknown }> {
  name: string
  settings: T
  log: LogHelper
  constructor(name: string, settings: T) {
    this.name = name
    this.settings = settings
    this.log = log.contextLogger(name)
  }

  toJSON(): Record<string, unknown> {
    return omit(this, 'log', 'settings', 'toJSON')
  }
}
