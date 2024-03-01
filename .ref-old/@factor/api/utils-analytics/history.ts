/**
 * Patch History API with pushState and replaceState events
 * so we can reliably track page views in SPAs
 */

let __patched = false
type historyArgs = [unknown, string, string | URL | undefined | null]
const patchHistory = function (
  method: "pushState" | "replaceState",
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
const patchBrowser = (): void => {
  if (!__patched) {
    history.pushState = patchHistory("pushState")
    history.replaceState = patchHistory("replaceState")
    __patched = true
  }
}

export const onHistoryChange = (cb: () => void): void => {
  patchBrowser()

  window.addEventListener("pushState", (): void => cb())
  // eslint-disable-next-line unicorn/prefer-add-event-listener
  window.onpopstate = ({ state }: PopStateEvent): void => {
    if (state) cb()
  }
}
