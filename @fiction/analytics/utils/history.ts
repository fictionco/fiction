/**
 * Patch History API with pushState and replaceState events
 * so we can reliably track page views in SPAs
 */

export type HistoryArgs = [unknown, string, string | URL | undefined | null]

class HistoryPatcher {
  private patched: boolean = false

  constructor() {
    this.patchBrowser()
  }

  private patchHistory(method: 'pushState' | 'replaceState'): (...args: HistoryArgs) => void {
    const orig = history[method]
    return (...args: HistoryArgs): void => {
      const rv = orig.apply(history, args)
      const e = new Event(method) as Event & { arguments: HistoryArgs }
      e.arguments = args
      window.dispatchEvent(e)
      return rv
    }
  }

  private patchBrowser(): void {
    if (!this.patched) {
      history.pushState = this.patchHistory('pushState')
      history.replaceState = this.patchHistory('replaceState')
      this.patched = true
    }
  }

  public onHistoryChange(cb: () => void): void {
    this.patchBrowser()

    window.addEventListener('pushState', (): void => cb())
    // window.addEventListener('replaceState', (): void => cb())

    window.addEventListener('popstate', (_event: PopStateEvent) => cb())
  }
}

export const historyUtil = new HistoryPatcher()
