import { log } from '@fiction/core/plugin-log/index.js'
import type { Organization } from '@fiction/core/plugin-user/types.js'
import { getAnonymousId } from '@fiction/core/utils/anon.js'
import type { TagSettings } from './types'

export abstract class ClientTag<T extends TagSettings = TagSettings> {
  org: Partial<Organization> & { orgId: string }
  siteId: string
  anonymousId: string
  storedData: Record<string, string> = {}
  statSeconds: number
  tagId: string
  log = log.contextLogger(this.constructor.name)
  settings: T
  initialized?: Promise<void> | void
  constructor(tagId: string, settings: T) {
    if (typeof window === 'undefined')
      throw new Error('no window')

    this.tagId = tagId

    this.settings = settings

    this.storedData = this.getStoredData()

    this.statSeconds = settings.statSeconds || 7

    this.org = settings.org

    this.siteId = settings.siteId

    const { anonymousId } = getAnonymousId()

    this.anonymousId = anonymousId
  }

  abstract init(): Promise<void> | void

  private getNamespace(): string {
    return `fiction-${this.tagId}`
  }

  getStoredData(): Record<string, string> {
    if (typeof localStorage === 'undefined')
      return {}

    const storedJson = localStorage.getItem(this.getNamespace())

    return (storedJson ? JSON.parse(storedJson) : {}) as Record<string, string>
  }

  storeItem(key: string, value: string): void {
    this.storedData[key] = value

    localStorage.setItem(this.getNamespace(), JSON.stringify(this.storedData))
  }

  stored(key: string): string {
    return this.storedData[key]
  }
}
