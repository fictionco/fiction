import type { EndpointResponse } from '../types'
import { log } from '../plugin-log'
import { vue } from './libraries'

export type AutosaveConfig<T extends EndpointResponse = EndpointResponse> = {
  onSave?: () => Promise<T | undefined | void>
  onTrigger?: () => void
  debounceMs?: number
  onError?: (error: unknown) => void
}

export class AutosaveUtility<T extends EndpointResponse = EndpointResponse> {
  isDirty = vue.ref(false)
  private saveTimeout: ReturnType<typeof setTimeout> | null = null
  private logger = log.contextLogger('AutosaveUtility')

  constructor(private config: AutosaveConfig<T>) {}

  public autosave(_args: { caller: string }): void {
    this.isDirty.value = true
    this.config.onTrigger?.()
    this.debouncedSave()
  }

  public async forceSync(): Promise<T | undefined | void> {
    this.clear()
    return await this.save()
  }

  public clear(): void {
    this.clearTimeout()
    this.isDirty.value = false
  }

  private debouncedSave(): void {
    this.clearTimeout()
    this.saveTimeout = setTimeout(() => this.save(), this.config.debounceMs ?? 2000)
  }

  private async save(): Promise<T | undefined | void> {
    if (!this.config.onSave) {
      return
    }

    try {
      const r = await this.config.onSave()
      this.isDirty.value = false

      return r
    }
    catch (error) {
      if (this.config.onError) {
        this.config.onError(error)
      }

      this.logger.error('Autosave error:', { error })
    }
  }

  clearTimeout(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
      this.saveTimeout = null
    }
  }
}
