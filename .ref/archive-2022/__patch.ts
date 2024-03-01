/**
 * Patch History API with pushState and replaceState events
 * so we can reliably track page views in SPAs
 */
type historyArgs = [unknown, string, string | URL | undefined | null]
const patchHistory = function (
  method: 'pushState' | 'replaceState',
): (...args: historyArgs) => void {
  const orig = history[method]
  return function (this: typeof orig, ...args: historyArgs): void {
    const rv = orig.apply(this, args as historyArgs)
    const e = new Event(method) as Event & { arguments: historyArgs }
    e.arguments = args
    window.dispatchEvent(e)
    return rv
  }
}
/**
 * Patch browser functionality if no other method exists
 */
export function patchBrowser(): void {
  history.pushState = patchHistory('pushState')
  history.replaceState = patchHistory('replaceState')
}
