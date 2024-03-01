import type { EndpointResponse } from '@factor/api'
import { log } from '@factor/api'

import type { IntegrationRow } from './tables'

export interface ModalMessage {
  from?: 'kaption'
  messageType: 'connectResult' | string
  data: EndpointResponse<Error | IntegrationRow>
}

export class AuthorizationModal {
  width = 500
  height = 600
  modalWindow?: Window | null

  layout = this.getLayout(this.width, this.height)
  log = log.contextLogger('AuthorizationModal')
  messageCallbacks = new Set<(msg: ModalMessage) => void>()
  successCallbacks = new Set<
    (msg: EndpointResponse<IntegrationRow, 'success'>) => void
  >()

  failureCallbacks = new Set<(msg: EndpointResponse<Error, 'error'>) => void>()
  closeCallbacks = new Set<() => void>()
  features = {
    width: this.layout?.computedWidth,
    height: this.layout?.computedHeight,
    top: this.layout?.top,
    left: this.layout?.left,
    scrollbars: 1,
    resizable: 1,
    // noopener: 'no'
    //
    // Note: using "noopener=yes" seems safer here, as the modal will run on third-party websites.
    // But we need detect if the modal has been closed by the user, during the authorization process,
    // To do so, we are polling the modal status of the modal (using the read-only closed property).
    // If we can find a workaround that provides both the ability to use "noopener=yes"
    // and detect the modal close status, it will be safer to proceed so.
    status: 0,
    toolbar: 0,
    location: 0,
    copyhistory: 0,
    menubar: 0,
    directories: 0,
  }

  /**
   * The modal is expected to be in the center of the screen.
   */
  getLayout(expectedWidth: number, expectedHeight: number) {
    if (typeof window === 'undefined')
      return

    const screenWidth = window.screen.width
    const screenHeight = window.screen.height

    const computedWidth = Math.min(expectedWidth, screenWidth)
    const computedHeight = Math.min(expectedHeight, screenHeight)

    const left = screenWidth / 2 - computedWidth / 2
    const top = screenHeight / 2 - computedHeight / 2

    return {
      left: Math.max(left, 0),
      top: Math.max(top, 0),
      computedWidth,
      computedHeight,
    }
  }

  onMessage(cb: (msg: ModalMessage) => void) {
    this.messageCallbacks.add(cb)
  }

  onClose(cb: () => any): void {
    this.closeCallbacks.add(cb)
  }

  onSuccess(cb: (msg: EndpointResponse<IntegrationRow, 'success'>) => void) {
    this.successCallbacks.add(cb)
  }

  onFailure(cb: (msg: EndpointResponse<Error, 'error'>) => void) {
    this.failureCallbacks.add(cb)
  }

  /**
   * Open the modal
   */

  open(args: { url: string }) {
    const windowName = 'ConnectWithOAuth'
    const windowFeatures = this.featuresToString()
    this.modalWindow = window.open(args.url, windowName, windowFeatures)

    let hasSuccess = false

    window.addEventListener(
      'message',
      (event) => {
        const msg = event.data as ModalMessage

        if (!msg || typeof msg !== 'object' || msg.from !== 'kaption')
          return

        this.messageCallbacks.forEach(cb => cb(msg))

        if (msg.messageType === 'connectResult') {
          if (msg.data.status === 'success') {
            hasSuccess = true
            this.successCallbacks.forEach(cb =>
              cb(msg.data as EndpointResponse<IntegrationRow, 'success'>),
            )
          }
          else {
            this.failureCallbacks.forEach(cb =>
              cb(msg.data as EndpointResponse<Error, 'error'>),
            )
          }
        }
      },
      false,
    )

    const interval = window.setInterval(() => {
      if (this.modalWindow?.closed) {
        this.closeCallbacks.forEach(cb => cb())
        window.clearInterval(interval)
        if (!hasSuccess) {
          this.failureCallbacks.forEach(cb =>
            cb({
              status: 'error',
              message: 'closed without success',
              data: new Error('closed without success'),
            } as EndpointResponse<Error, 'error'>),
          )
        }
      }
    }, 100)

    return this.modalWindow
  }

  close() {
    this.modalWindow?.close()
  }

  /**
   * Helper to convert the features object of this class
   * to the comma-separated list of window features required
   * by the window.open() function.
   */

  featuresToString(): string {
    const featuresAsString: string[] = []

    for (const key in this.features) {
      featuresAsString.push(
        `${key}=${this.features[key as keyof typeof this.features]}`,
      )
    }

    return featuresAsString.join(',')
  }
}
