import { onBrowserEvent } from '@factor/api/tracking'
import { logger } from '@factor/api/logger'

export type OffloadEvent =
  | 'pagehide'
  | 'unload'
  | 'visibilitychange'
  | 'historyChange'
  | 'leftIdle'
  | 'windowBlur'
  | 'expireSession'

type EventCallback = (offloadType: OffloadEvent) => void

class UnloadHandler {
  private unloadCallbacks: EventCallback[] = []
  private unloadWatchers: (() => void)[] = []
  public unloaded: boolean = false
  focused: boolean = true
  private timer: NodeJS.Timeout | undefined = undefined

  public clear(): void {
    this.unloadWatchers.forEach(clearWatcher => clearWatcher())
    this.unloadWatchers = []
    this.unloadCallbacks = []
  }

  private unload(offloadType: OffloadEvent): void {
    logger.log({
      level: 'info',
      context: 'unload',
      description: `maybe unload: ${this.unloaded}`,
    })
    if (!this.unloaded) {
      this.unloadCallbacks.forEach(cb => cb(offloadType))
      this.unloaded = true
    }
  }

  private timedUnload(args: { reason: OffloadEvent, wait?: number }): void {
    const { reason, wait = 30_000 } = args
    if (this.timer)
      clearTimeout(this.timer)

    this.focused = true
    this.timer = setTimeout(() => {
      if (!this.focused)
        this.unload(reason)
    }, wait)
  }

  public onUnload(cb: EventCallback): void {
    this.unloadCallbacks.push(cb)
    if (this.unloadWatchers.length === 0) {
      this.unloadWatchers = [
        onBrowserEvent('pagehide', () => this.unload('pagehide')),
        onBrowserEvent('beforeunload', () => this.unload('unload')),
        onBrowserEvent(
          'visibilitychange',
          () => {
            const v = document.visibilityState
            if (v === 'hidden')
              this.timedUnload({ reason: 'visibilitychange' })
            else if (v === 'visible')
              this.focused = true
          },
          document,
        ),
        // blur events should only trigger exit if the window isn't
        // refocused within 60s
        onBrowserEvent('blur', () => {
          this.timedUnload({ reason: 'windowBlur', wait: 120_000 })
        }),
        onBrowserEvent('focus', () => (this.focused = true)),
        onBrowserEvent('mousemove', () => (this.focused = true)),
      ]
    }
  }
}

export const UnloadUtility = new UnloadHandler()
