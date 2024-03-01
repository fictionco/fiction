import { onBrowserEvent } from '@factor/api/tracking'

/**
 * Callback on a standard JS error
 */
const errorList: string[] = []
export function onNewError(cb: (data: ErrorEvent) => void): void {
  onBrowserEvent('error', (errorEvent: ErrorEvent): void => {
    if (!errorList.includes(errorEvent.message)) {
      errorList.push(errorEvent.message)
      cb(errorEvent)
    }
  })
}
/**
 * Callback a function when a view or history change occurs
 */
export function onHistoryView(cb: () => void): void {
  window.addEventListener('pushState', (): void => cb())

  window.onpopstate = ({ state }: PopStateEvent): void => {
    if (state)
      cb()
  }
}
