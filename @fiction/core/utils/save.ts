import { log, vue } from '@fiction/core'

export type AutosaveConfig = {
  onSave: () => Promise<void>
  debounceMs?: number
  onError?: (error: unknown) => void
}

export class AutosaveUtility {
  isDirty = vue.ref(false)
  private saveTimeout: ReturnType<typeof setTimeout> | null = null
  private logger = log.contextLogger('AutosaveUtility')

  constructor(private config: AutosaveConfig) {}

  public autosave(): void {
    this.isDirty.value = true
    this.debouncedSave()
  }

  public async forceSync(): Promise<void> {
    this.clear()
    await this.save()
  }

  public clear(): void {
    this.clearTimeout()
    this.isDirty.value = false
  }

  private debouncedSave(): void {
    this.clearTimeout()
    this.saveTimeout = setTimeout(() => this.save(), this.config.debounceMs ?? 2000)
  }

  private async save(): Promise<void> {
    try {
      await this.config.onSave()
      this.isDirty.value = false
    }
    catch (error) {
      if (this.config.onError) {
        this.config.onError(error)
      }

      this.logger.error('Autosave error:', { error })
    }
  }

  private clearTimeout(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout)
      this.saveTimeout = null
    }
  }
}
